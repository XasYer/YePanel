import fs from 'fs';
import os from 'os';
import _ from 'lodash';
import { join } from 'path';
import { utils, version } from '../../common/index.js';
import si from 'systeminformation';
import moment from 'moment';
import { execSync } from 'child_process';
const pluginsCache = {
    info: '',
    plugins: []
};
export function getPlugins(force = false) {
    if (pluginsCache.plugins.length && !force) {
        return pluginsCache;
    }
    // 获取插件数量插件包目录包含package.json或.git目录才被视为一个插件包
    const dir = join(version.BotPath, 'plugins');
    if (!fs.existsSync(dir)) {
        return pluginsCache;
    }
    const dirArr = fs.readdirSync(dir, { withFileTypes: true });
    const exc = ['example'];
    const plugins = dirArr.map(i => {
        let hasPackage = false;
        let hasGit = false;
        if (i.isDirectory()) {
            if (fs.existsSync(join(dir, i.name, 'package.json')) && !exc.includes(i.name)) {
                hasPackage = true;
            }
            const gitPath = join(dir, i.name, '.git');
            if (fs.existsSync(gitPath) && fs.statSync(gitPath).isDirectory()) {
                hasGit = true;
            }
        }
        return {
            hasPackage,
            hasGit,
            name: i.name
        };
    }).filter(i => i.hasPackage || i.hasGit);
    // 获取js插件数量，以.js结尾的文件视为一个插件
    const jsDir = join(dir, 'example');
    let js = 0;
    try {
        js = fs.readdirSync(jsDir)
            ?.filter(item => item.endsWith('.js'))
            ?.length;
    }
    catch { /* empty */ }
    pluginsCache.plugins = plugins;
    pluginsCache.info = `${plugins.length} plugins | ${js} js`;
    return pluginsCache;
}
const getColor = (value) => {
    if (value >= 90) {
        return '#d56565';
    }
    else if (value >= 70) {
        return '#FFD700';
    }
    else {
        return '#73a9c6';
    }
};
const infoCache = {};
export default [
    {
        url: '/get-system-info',
        method: 'get',
        handler: async () => {
            if (!infoCache.arch) {
                const { node, v8, git } = await si.versions('node,v8,git');
                Object.assign(infoCache, {
                    arch: `${os.type()} ${os.arch()}`,
                    hostname: os.hostname(),
                    release: os.release(),
                    node,
                    v8,
                    git
                });
            }
            const plugins = getPlugins();
            const info = [];
            info.push({ key: '操作系统', value: infoCache.arch });
            info.push({ key: '主机名称', value: infoCache.hostname });
            info.push({ key: '系统版本', value: infoCache.release });
            info.push({ key: '运行时间', value: utils.formatDuration(os.uptime()) });
            info.push({ key: '插件数量', value: plugins.info });
            info.push({ key: `${version.BotName}-Yunzai`, value: version.BotVersion });
            info.push({ key: 'Node', value: infoCache.node });
            info.push({ key: 'V8', value: infoCache.v8 });
            info.push({ key: 'Git', value: infoCache.git });
            return {
                success: true,
                data: {
                    info: info.filter(i => i.value),
                    plugins: plugins.plugins,
                    BotName: version.BotName
                }
            };
        }
    },
    {
        url: '/get-system-cpu',
        method: 'get',
        handler: async () => {
            const { brand, manufacturer, speed, cores } = await si.cpu();
            const { currentLoad } = await si.currentLoad();
            infoCache.cpu = manufacturer && brand && `${manufacturer} ${brand}`;
            return {
                success: true,
                data: [
                    {
                        title: 'CPU',
                        value: Math.round(currentLoad),
                        color: getColor(currentLoad),
                        info: [
                            `${manufacturer} ${cores}核 ${speed}GHz`,
                            `CPU满载率 ${Math.round(currentLoad)}%`
                        ],
                        model: infoCache.cpu
                    }
                ]
            };
        }
    },
    {
        url: '/get-system-ram',
        method: 'get',
        handler: async () => {
            const { total, active, swaptotal, swapused } = await si.mem();
            const ramCurrentLoad = Math.round(Number((active / total).toFixed(2)) * 100);
            const result = [
                {
                    title: 'RAM',
                    value: ramCurrentLoad,
                    color: getColor(ramCurrentLoad),
                    info: [
                        `${utils.formatBytes(active)} / ${utils.formatBytes(total)}`
                    ]
                }
            ];
            if (swaptotal) {
                const swapCurrentLoad = Math.round(Number((swapused / swaptotal).toFixed(2)) * 100);
                result.push({
                    title: 'SWAP',
                    value: swapCurrentLoad,
                    color: getColor(swapCurrentLoad),
                    info: [
                        `${utils.formatBytes(swapused)} / ${utils.formatBytes(swaptotal)}`
                    ]
                });
            }
            else {
                result.push({
                    title: 'SWAP',
                    value: 0,
                    color: '',
                    status: 'exception',
                    info: ['没有获取到数据']
                });
            }
            return {
                success: true,
                data: result
            };
        }
    },
    {
        url: '/get-system-node',
        method: 'get',
        handler: async () => {
            const memory = process.memoryUsage();
            // 总共
            const rss = utils.formatBytes(memory.rss);
            // 堆
            const heapTotal = utils.formatBytes(memory.heapTotal);
            // 栈
            const heapUsed = utils.formatBytes(memory.heapUsed);
            // 占用率
            const occupy = Number((memory.rss / (os.totalmem() - os.freemem())).toFixed(2)) * 100;
            return {
                success: true,
                data: [
                    {
                        title: 'Node',
                        value: Math.round(occupy),
                        color: getColor(occupy),
                        info: [
                            `总 ${rss}`,
                            `${heapTotal} | ${heapUsed}`
                        ]
                    }
                ]
            };
        }
    },
    {
        url: '/get-system-gpu',
        method: 'get',
        handler: async () => {
            const { controllers } = await si.graphics();
            const graphics = controllers?.find(item => item.memoryUsed && item.memoryFree && item.utilizationGpu);
            const result = [];
            if (graphics) {
                const { vendor, temperatureGpu, utilizationGpu, memoryTotal, memoryUsed, model } = graphics;
                infoCache.gpu = model;
                result.push({
                    title: 'GPU',
                    value: Math.round(utilizationGpu),
                    color: getColor(utilizationGpu),
                    info: [
                        `${(memoryUsed / 1024).toFixed(2)}G / ${(memoryTotal / 1024).toFixed(2)}G`,
                        `${vendor} ${temperatureGpu}°C`
                    ],
                    model: infoCache.gpu
                });
            }
            else {
                result.push({
                    title: 'GPU',
                    value: 0,
                    color: '',
                    status: 'exception',
                    info: ['没有获取到数据']
                });
            }
            return {
                success: true,
                data: result
            };
        }
    },
    {
        url: '/get-system-fs',
        method: 'get',
        handler: async () => {
            const HardDisk = _.uniqWith(await si.fsSize(), (a, b) => a.used === b.used && a.size === b.size && a.use === b.use && a.available === b.available).filter(item => item.size && item.used && item.available && item.use);
            return {
                success: true,
                data: HardDisk.map(item => ({
                    ...item,
                    used: utils.formatBytes(item.used),
                    size: utils.formatBytes(item.size),
                    use: Math.round(item.use),
                    color: getColor(item.use)
                }))
            };
        }
    },
    {
        url: '/get-bot-info',
        method: 'get',
        handler: async () => {
            const botList = version.BotName === 'TRSS' ? Bot.uin : (Bot?.adapter && Bot.adapter.includes(Bot.uin)) ? Bot.adapter : [Bot.uin];
            const botInfo = [];
            for (const uin of botList) {
                const bot = Bot[uin];
                if (!bot)
                    continue;
                const keys = [
                    `Yz:count:send:msg:bot:${uin}:total`,
                    `Yz:count:receive:msg:bot:${uin}:total`
                ];
                const values = await redis.mGet(keys) || [];
                botInfo.push({
                    uin,
                    avatar: bot.avatar,
                    nickname: bot.nickname || '未知',
                    version: bot.version?.version || '未知',
                    platform: bot.version?.name || '未知',
                    sent: values[0] || bot.stat?.sent_msg_cnt || 0,
                    recv: values[1] || bot.stat?.recv_msg_cnt || 0,
                    time: utils.formatDuration(Date.now() / 1000 - bot.stat?.start_time),
                    friend: bot.fl?.size || 0,
                    group: bot.gl?.size || 0
                });
            }
            return {
                success: true,
                data: botInfo
            };
        }
    },
    {
        url: '/get-message-info',
        method: 'get',
        handler: async () => {
            const data = {
                sent: [],
                recv: [],
                time: []
            };
            const date = moment().subtract(1, 'days');
            for (let i = 0; i < 30; i++) {
                const time = date.format('YYYY:MM:DD');
                const keys = version.BotName === 'TRSS'
                    ? [
                        `Yz:count:send:msg:total:${time}`,
                        `Yz:count:receive:msg:total:${time}`
                    ]
                    : [
                        `Yz:count:sendMsg:day:${date.format('MMDD')}`,
                        `YePanel:recv:${time}`
                    ];
                const value = await redis.mGet(keys);
                if (value.some(i => i !== null)) {
                    data.sent.unshift(Number(value[0]));
                    data.recv.unshift(Number(value[1]));
                    data.time.unshift(time.replace(/:/g, '-'));
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
        url: '/get-update-log',
        method: 'get',
        handler: async ({ query }) => {
            const { plugin } = query;
            try {
                const arg = {
                    encoding: 'utf-8',
                    cwd: plugin ? join(version.BotPath, 'plugins', plugin) : undefined
                };
                const exec = (cmd) => execSync(cmd, arg).toString().trim();
                const log = exec('git log -100 --pretty="%h||[%cd] %s" --date=format:"%F %T"');
                const branch = exec('git branch --show-current');
                const remote = exec(`git config branch.${branch}.remote`);
                const url = exec(`git config remote.${remote}.url`);
                return {
                    success: true,
                    data: {
                        log: log.split('\n'),
                        url: url.toString().replace(/.git$/, '')
                    }
                };
            }
            catch (error) {
                return {
                    success: false,
                    message: error.message
                };
            }
        }
    }
];
