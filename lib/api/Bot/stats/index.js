import moment from 'moment';
import { config, version, utils } from '../../../common/index.js';
// @ts-ignore
import PluginLoader from '../../../../../../lib/plugins/loader.js';
Bot.on('message', (e) => {
    const day = utils.getTime();
    if (version.BotName === 'Miao') {
        // 接收消息数量
        incr(`YePanel:recv:${day}`);
    }
    // 接收群消息数量
    if (e.group_id && config.stats.rankChart.groupRecv) {
        const key = e?.group_name ? `${e.group_name}(${e.group_id})` : e.group_id;
        incr(`YePanel:recv:group:${key}:${day}`, 31);
    }
    // 接收用户消息数量
    if (e.user_id && config.stats.rankChart.userRecv) {
        const key = e?.sender?.nickname ? `${e.sender.nickname}(${e.user_id})` : e.user_id;
        incr(`YePanel:recv:user:${key}:${day}`, 31);
    }
});
// 插件调用统计
if (config.stats.rankChart.pluginUse || config.stats.countChart.plugin) {
    // 代理PluginLoader的 filtPermission 函数, 每次触发插件都会调用, 判断logFnc
    PluginLoader.filtPermission = new Proxy(PluginLoader.filtPermission, {
        apply(target, thisArg, args) {
            const res = target.apply(thisArg, args);
            if (res) {
                const day = utils.getTime();
                // 插件总调用数量
                if (config.stats.countChart.plugin) {
                    incr(`YePanel:plugin:total:${day}`, 31);
                }
                // 插件调用排行榜
                if (config.stats.rankChart.pluginUse) {
                    const [e] = args;
                    const { name, fnc } = getLog(e?.logFnc);
                    if (name && fnc) {
                        incr(`YePanel:plugin:use:${day}:${name}(${fnc})`);
                    }
                }
            }
            return res;
        }
    });
}
// 发送统计
if (config.stats.rankChart.groupSent || config.stats.rankChart.userSent || config.stats.rankChart.pluginSent ||
    config.stats.rankChart.sentType) {
    // 代理 count 每次发送消息都会调用
    PluginLoader.count = new Proxy(PluginLoader.count, {
        apply(target, thisArg, args) {
            const [e, type, msg] = args;
            const day = utils.getTime();
            // 群消息发送数量
            if (e?.group_id && config.stats.rankChart.groupSent && type !== 'receive') {
                const key = e?.group_name ? `${e.group_name}(${e.group_id})` : e.group_id;
                incr(`YePanel:sent:group:${key}:${day}`);
            }
            // 用户消息发送数量
            if (e?.user_id && config.stats.rankChart.userSent && type !== 'receive') {
                const key = e?.sender?.nickname ? `${e.sender.nickname}(${e.user_id})` : e.user_id;
                incr(`YePanel:sent:user:${key}:${day}`);
            }
            // 插件发送消息排行
            if (e?.logFnc && config.stats.rankChart.pluginSent) {
                const { name, fnc } = getLog(e.logFnc);
                if (name && fnc) {
                    incr(`YePanel:plugin:sent:${day}:${name}(${fnc})`);
                }
            }
            // 发送消息类型排行
            if (config.stats.rankChart.sentType && type !== 'receive') {
                const message = version.BotName === 'Miao' ? type : msg;
                for (const i of Array.isArray(message) ? message : [message]) {
                    incr(`YePanel:sent:type:${i?.type || 'text'}:${day}`);
                }
            }
            return target.apply(thisArg, args);
        }
    });
}
function getLog(log) {
    const info = {
        name: '',
        fnc: ''
    };
    if (log) {
        const reg = version.BotName === 'Miao' ? /\[(.+?)\]\[(.+?)\]/ : /\[(.+?)\((.+?)\)\]/;
        try {
            const [, name, fnc] = reg.exec(log) || [];
            if (name && fnc) {
                return { name: name.replace('34m[', ''), fnc };
            }
        }
        catch { }
    }
    return info;
}
function incr(key, day = 8) {
    redis.incr(key).then((i) => {
        if (i == 1) {
            redis.expire(key, 60 * 60 * 24 * day).catch(() => { });
        }
    }).catch(() => { });
}
function sort(data) {
    data.sort((a, b) => b.value - a.value);
    if (data.length > 10) {
        data.pop();
    }
}
async function scan(MATCH, getName) {
    const ChartData = [];
    let cursor = 0;
    do {
        const res = await redis.scan(cursor, { MATCH, COUNT: 10000 });
        cursor = res.cursor;
        for (const key of res.keys) {
            const name = getName(key);
            if (!name)
                continue;
            const value = Number(await redis.get(key));
            ChartData.push({ name, value });
            sort(ChartData);
        }
    } while (cursor !== 0);
    return ChartData;
}
export default [
    {
        url: '/get-stats-count-data',
        method: 'get',
        handler: async () => {
            const data = {
                sent: [],
                recv: [],
                plugin: [],
                time: []
            };
            const countConfig = config.stats.countChart;
            if (!countConfig.sent && !countConfig.recv && !countConfig.plugin) {
                return {
                    success: true,
                    data
                };
            }
            const date = moment();
            for (let i = 0; i < 30; i++) {
                const time = date.format('YYYY:MM:DD');
                const timeKey = time.replace(/:/g, '-');
                const tasks = [];
                // 发送消息数量
                if (countConfig.sent) {
                    if (version.BotName === 'Miao') {
                        tasks.push(redis.get(`Yz:count:sendMsg:day:${date.format('MMDD')}`));
                    }
                    else if (version.BotName === 'TRSS') {
                        tasks.push(redis.get(`Yz:count:send:msg:total:${time}`));
                    }
                }
                else {
                    tasks.push(Promise.resolve(false));
                }
                // 接收消息数量
                if (countConfig.recv) {
                    if (version.BotName === 'Miao') {
                        tasks.push(redis.get(`YePanel:recv:${time}`));
                    }
                    else if (version.BotName === 'TRSS') {
                        tasks.push(redis.get(`Yz:count:receive:msg:total:${time}`));
                    }
                }
                else {
                    tasks.push(Promise.resolve(false));
                }
                // 插件总调用数量
                if (countConfig.plugin) {
                    tasks.push(redis.get(`YePanel:plugin:total:${time}`));
                }
                else {
                    tasks.push(Promise.resolve(false));
                }
                const values = await Promise.all(tasks);
                if (values.some(v => v !== false)) {
                    data.time.unshift(timeKey);
                    if (values[0] !== false) {
                        data.sent.unshift(Number(values[0]));
                    }
                    if (values[1] !== false) {
                        data.recv.unshift(Number(values[1]));
                    }
                    if (values[2] !== false) {
                        data.plugin.unshift(Number(values[2]));
                    }
                }
                date.add(-1, 'days');
            }
            return {
                success: true,
                data
            };
        }
    },
    {
        url: '/get-stats-rank-data',
        method: 'get',
        handler: async ({ query }) => {
            const data = {
                pluginSent: false,
                pluginUse: false,
                groupRecv: false,
                groupSent: false,
                userRecv: false,
                userSent: false,
                sentType: false
            };
            const { time } = query;
            const keys = [
                { config: 'pluginSent', redis: 'plugin:sent' },
                { config: 'pluginUse', redis: 'plugin:use' },
                { config: 'groupRecv', redis: 'recv:group', reg: true },
                { config: 'groupSent', redis: 'sent:group', reg: true },
                { config: 'userRecv', redis: 'recv:user', reg: true },
                { config: 'userSent', redis: 'sent:user', reg: true },
                { config: 'sentType', redis: 'sent:type', reg: true }
            ];
            for (const i of keys) {
                if (config.stats.rankChart[i.config]) {
                    const rkey = i.reg ? `YePanel:${i.redis}:*:${time.replace(/-/g, ':')}` : `YePanel:${i.redis}:${time.replace(/-/g, ':')}:*`;
                    const getName = (key) => {
                        if (i.reg) {
                            const reg = new RegExp(rkey.replace('*', '(.+?)'));
                            return reg.exec(key)?.[1] || '';
                        }
                        else {
                            return key.replace(rkey.replace('*', ''), '');
                        }
                    };
                    data[i.config] = await scan(rkey, getName);
                }
            }
            return {
                success: true,
                data
            };
        }
    }
];
