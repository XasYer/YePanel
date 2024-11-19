import { utils } from '../../../common/index.js';
import { createClient } from 'redis';
const cfg = await (async () => {
    try {
        // @ts-ignore
        return (await import('../../../../../../lib/config/config.js')).default;
    }
    catch {
        return { redis: {} };
    }
})();
const clients = {};
const getRedisClient = async (db, host, port, username, password) => {
    if (!host) {
        host = cfg.redis.host;
        port = cfg.redis.port;
        username = cfg.redis.username;
        password = cfg.redis.password;
    }
    const key = `${host}:${port}:${username}:${password}:${db}`;
    if (clients[key]) {
        return clients[key].client;
    }
    try {
        const client = await createClient({
            socket: {
                host,
                port
            },
            username,
            password,
            database: Number(db)
        }).connect();
        clients[key] = {
            client,
            timer: setTimeout(() => {
                client.disconnect();
                delete clients[key];
            }, 1000 * 60 * 30) // 缓存30分钟
        };
        return client;
    }
    catch {
        return null;
    }
};
export async function getRedisKeys(sep = ':', db, host, port, username, password, lazy = false) {
    const redis = await getRedisClient(db, host, port, username, password);
    if (!redis) {
        return [];
    }
    function addKeyToTree(tree, parts, fullKey) {
        if (parts.length === 0)
            return;
        const [firstPart, ...restParts] = parts;
        let node = tree.find((item) => item.label === firstPart);
        const currentKey = fullKey ? `${fullKey}:${firstPart}` : firstPart;
        if (!node) {
            node = {
                label: firstPart,
                key: currentKey,
                children: []
            };
            tree.push(node);
        }
        addKeyToTree(node.children, restParts, currentKey);
    }
    const keysTree = [];
    let cursor = 0;
    do {
        const MATCH = !lazy ? '*' : sep ? `${sep}:*` : '*';
        const res = await redis.scan(cursor, { MATCH, COUNT: 10000 });
        cursor = res.cursor;
        const keys = res.keys;
        keys.forEach((key) => {
            if (lazy) {
                if (sep) {
                    if (key.startsWith(sep + ':')) {
                        const remaining = key.substring(sep.length + 1);
                        const nextPart = remaining.split(':')[0];
                        if (nextPart && !keysTree.some(i => i.label === nextPart)) {
                            keysTree.push({
                                label: nextPart,
                                key: `${sep}:${nextPart}`,
                                children: []
                            });
                        }
                    }
                }
                else {
                    if (key.includes(':')) {
                        const firstPart = key.split(':')[0];
                        if (!keysTree.some(i => i.label === firstPart)) {
                            keysTree.push({
                                label: firstPart,
                                key: firstPart,
                                children: []
                            });
                        }
                    }
                    else if (!keysTree.some(i => i.label === key)) {
                        keysTree.push({
                            label: key,
                            key,
                            children: []
                        });
                    }
                }
            }
            else {
                const parts = key.split(sep);
                addKeyToTree(keysTree, parts, '');
            }
        });
    } while (cursor != 0);
    return keysTree;
}
export default [
    {
        url: '/get-redis-info',
        method: 'get',
        handler: async () => {
            const data = await redis.info();
            const redisInfo = {};
            data.split('\n').forEach((line) => {
                if (line && !line.startsWith('#') && line.includes(':')) {
                    const index = line.indexOf(':');
                    const key = line.substring(0, index);
                    const value = line.substring(index + 1);
                    redisInfo[key.trim()] = value.trim();
                }
            });
            redisInfo.uptime_formatted = utils.formatDuration(Number(redisInfo.uptime_in_seconds));
            redisInfo.slelct_database = cfg.redis.db;
            const [, databases] = await redis.sendCommand(['CONFIG', 'GET', 'databases']);
            redisInfo.databases = databases;
            return {
                success: true,
                data: redisInfo
            };
        }
    },
    {
        url: '/get-redis-connection',
        method: 'get',
        handler: async ({ query }) => {
            const { host, port, db, username, password } = query;
            const redis = await getRedisClient(db, host, port, username, password);
            if (!redis) {
                return {
                    success: false,
                    message: '测试连接redis失败'
                };
            }
            return {
                success: true
            };
        }
    },
    {
        url: '/get-redis-keys',
        method: 'get',
        handler: async ({ query }) => {
            const { sep, db, lazy, host, port, username, password } = query;
            const keys = await getRedisKeys(sep, db, host, port, username, password, lazy);
            return {
                success: true,
                data: keys
            };
        }
    },
    {
        url: '/get-redis-value',
        method: 'get',
        handler: async ({ query }) => {
            const { key, db, host, port, username, password } = query;
            const redis = await getRedisClient(db, host, port, username, password);
            if (!redis) {
                return {
                    success: false,
                    message: '连接redis失败'
                };
            }
            try {
                const value = await redis.get(key);
                const expire = await redis.ttl(key);
                return {
                    success: true,
                    data: {
                        key,
                        value,
                        expire
                    }
                };
            }
            catch {
                const type = await redis.type(key);
                return {
                    success: false,
                    message: `暂未支持${type}类型,目前仅支持查看和修改string类型`
                };
            }
        }
    },
    {
        url: '/set-redis-value',
        method: 'post',
        handler: async ({ body }) => {
            const { key: oldKey, value, db, expire, newKey, host, port, username, password } = body;
            const redis = await getRedisClient(db, host, port, username, password);
            if (!redis) {
                return {
                    success: false,
                    message: '连接redis失败'
                };
            }
            const key = newKey || oldKey;
            if (newKey) {
                await redis.rename(oldKey, newKey);
            }
            if (expire === -2) {
                await redis.sendCommand(['GETSET', key, value]);
            }
            else if (expire === -1) {
                await redis.set(key, value);
            }
            else {
                await redis.set(key, value, { EX: expire });
            }
            return {
                success: true,
                data: {
                    key,
                    value
                }
            };
        }
    },
    {
        url: '/delete-redis-keys',
        method: 'post',
        handler: async ({ body }) => {
            const { keys, db, host, port, username, password } = body;
            const errorKeys = [];
            const successKeys = [];
            const redis = await getRedisClient(db, host, port, username, password);
            if (!redis) {
                return {
                    success: false,
                    message: '连接redis失败'
                };
            }
            for (const key of keys) {
                try {
                    await redis.del(key);
                    successKeys.push(key);
                }
                catch {
                    errorKeys.push(key);
                }
            }
            return {
                success: true,
                data: {
                    errorKeys,
                    successKeys
                }
            };
        }
    }
];
