import { utils } from '../../../common/index.js';
export async function getRedisKeys(sep = ':', lazy = false) {
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
export default {
    http: [
        {
            url: '/get-redis-info',
            method: 'post',
            token: true,
            response: async () => {
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
                return {
                    success: true,
                    data: redisInfo
                };
            }
        },
        {
            url: '/get-redis-keys',
            method: 'post',
            token: true,
            response: async ({ body }) => {
                const { sep, lazy } = body;
                const keys = await getRedisKeys(sep, lazy);
                return {
                    success: true,
                    data: keys
                };
            }
        },
        {
            url: '/get-redis-value',
            method: 'post',
            token: true,
            response: async ({ body }) => {
                const { key } = body;
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
        },
        {
            url: '/set-redis-value',
            method: 'post',
            token: true,
            response: async ({ body: { key, value, newKey, expire } }) => {
                if (newKey) {
                    await redis.rename(key, newKey);
                    key = newKey;
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
            token: true,
            response: async ({ body }) => {
                const { keys } = body;
                const errorKeys = [];
                const successKeys = [];
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
    ]
};
