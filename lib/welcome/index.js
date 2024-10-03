import fs from 'fs';
import os from 'os';
import _ from 'lodash';
import { join } from 'path';
import { formatBytes, formatDuration } from '../utils.js';
import si from 'systeminformation';
async function getDauChartData(uin) {
    const data = Bot[uin].dau;
    const stats = await data.getStats();
    return [
        {
            name: '今日活跃用户',
            value: stats.user_count,
            total: data.dauDB === 'level' ? data.all_user?.total : Bot[uin].fl.size
            // TODO: 成长百分比
            // percent: ''
            // TODO: 近期数据
            //   data: [stats.user_count]
        },
        {
            name: '今日活跃群数',
            value: stats.group_count,
            total: data.dauDB === 'level' ? data.all_group?.total : Bot[uin].gl.size
        },
        {
            name: '接收消息数量',
            value: stats.receive_msg_count
        },
        {
            name: '发送消息数量',
            value: stats.send_msg_count
        },
        {
            name: '新增群数',
            value: stats.group_increase_count
        },
        {
            name: '减少群数',
            value: stats.group_decrease_count
        }
    ];
}
async function getWeekChartData(uin) {
    const dau = Bot[uin].dau;
    const path = join(process.cwd(), 'data', 'QQBotDAU', uin);
    if (!fs.existsSync(path))
        return [];
    const daus = fs.readdirSync(path); // .reverse().slice(0, 2)
    if (_.isEmpty(daus))
        return false;
    let data = _.fromPairs(daus.map(v => [v.replace('.json', ''), JSON.parse(fs.readFileSync(`${path}/${v}`).toString())]));
    data = dau.monthlyDau(Object.values(data).flat().slice(-30));
    const userData = [];
    const groupData = [];
    const weekData = [];
    const receiveMsgData = [];
    const sendMsgData = [];
    data.coldata[1].forEach((v, i) => {
        if (i % 2 === 0) {
            userData.push(v.count);
            weekData.push(v.time);
        }
        else {
            groupData.push(v.count);
        }
    });
    data.linedata[0].forEach((v, i) => {
        if (i % 2 === 0) {
            receiveMsgData.push(v.linecount);
        }
        else {
            sendMsgData.push(v.linecount);
        }
    });
    return [
        {
            userData: userData.slice(userData.length - 7, userData.length),
            groupData: groupData.slice(groupData.length - 7, groupData.length),
            weekData: weekData.slice(weekData.length - 7, weekData.length),
            receiveMsgData: receiveMsgData.slice(receiveMsgData.length - 7, receiveMsgData.length),
            sendMsgData: sendMsgData.slice(sendMsgData.length - 7, sendMsgData.length)
        },
        {
            userData,
            groupData,
            weekData,
            receiveMsgData,
            sendMsgData
        }
    ];
}
async function getcallStat(uin) {
    const dau = Bot[uin].dau;
    const callStat = _.entries(dau.call_stats).sort((a, b) => b[1] - a[1]);
    const data = await dau.callStat(callStat, true);
    return data.group.map((i) => ({
        num: i.num,
        percentage: i.percent.replace('%', ''),
        color: i.color,
        name: i.name.replace(/^\[(.*)\]$/, '$1'),
        value: i.num
    }));
}
function getPluginNum() {
    // 获取插件数量插件包目录包含package.json才被视为一个插件包
    const dir = './plugins';
    const dirArr = fs.readdirSync(dir, { withFileTypes: true });
    const exc = ['example'];
    const plugin = dirArr.filter(i => i.isDirectory() &&
        fs.existsSync(join(dir, i.name, 'package.json')) &&
        !exc.includes(i.name));
    const plugins = plugin?.length;
    // 获取js插件数量，以.js结尾的文件视为一个插件
    const jsDir = join(dir, 'example');
    let js = 0;
    try {
        js = fs.readdirSync(jsDir)
            ?.filter(item => item.endsWith('.js'))
            ?.length;
    }
    catch { /* empty */ }
    return `${plugins ?? 0} plugins | ${js ?? 0} js`;
}
export default {
    http: [
        {
            url: '/get-home-data',
            method: 'post',
            token: true,
            response: async ({ body: { uin } }) => {
                return {
                    success: true,
                    data: {
                        chartData: await getDauChartData(uin),
                        weekData: await getWeekChartData(uin),
                        callStat: await getcallStat(uin)
                    }
                };
            }
        },
        {
            url: '/get-system-info',
            method: 'post',
            token: true,
            response: async () => {
                const { currentLoad: { currentLoad: cpuCurrentLoad }, cpu: { manufacturer, speed, cores, brand }, fullLoad, mem: { total, active, swaptotal, swapused } } = await si.get({
                    currentLoad: 'currentLoad',
                    cpu: 'manufacturer,speed,cores,brand',
                    fullLoad: '*',
                    mem: 'total,active,swaptotal,swapused'
                });
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
                const ramCurrentLoad = Math.round(Number((active / total).toFixed(2)) * 100);
                const visual = [
                    {
                        title: 'CPU',
                        value: Math.round(cpuCurrentLoad),
                        color: getColor(cpuCurrentLoad),
                        info: [
                            `${manufacturer} ${cores}核 ${speed}GHz`,
                            `CPU满载率 ${Math.round(fullLoad)}%`
                        ]
                    },
                    {
                        title: 'RAM',
                        value: ramCurrentLoad,
                        color: getColor(ramCurrentLoad),
                        info: [
                            `${formatBytes(active)} / ${formatBytes(total)}`
                        ]
                    }
                ];
                if (swaptotal) {
                    const swapCurrentLoad = Math.round(Number((swapused / swaptotal).toFixed(2)) * 100);
                    visual.push({
                        title: 'SWAP',
                        value: swapCurrentLoad,
                        color: getColor(swapCurrentLoad),
                        info: [
                            `${formatBytes(swapused)} / ${formatBytes(swaptotal)}`
                        ]
                    });
                }
                else {
                    visual.push({
                        title: 'SWAP',
                        value: 0,
                        color: '',
                        status: 'exception',
                        info: ['没有获取到数据']
                    });
                }
                const memory = process.memoryUsage();
                // 总共
                const rss = formatBytes(memory.rss);
                // 堆
                const heapTotal = formatBytes(memory.heapTotal);
                // 栈
                const heapUsed = formatBytes(memory.heapUsed);
                // 占用率
                const occupy = Number((memory.rss / (os.totalmem() - os.freemem())).toFixed(2)) * 100;
                visual.push({
                    title: 'Node',
                    value: Math.round(occupy),
                    color: getColor(occupy),
                    info: [
                        `总 ${rss}`,
                        `${heapTotal} | ${heapUsed}`
                    ]
                });
                const { controllers } = await si.graphics();
                const graphics = controllers?.find(item => item.memoryUsed && item.memoryFree && item.utilizationGpu);
                const info = [];
                info.push({ key: '操作系统', value: `${os.type()} ${os.arch()}` });
                info.push({ key: '主机名称', value: os.hostname() });
                info.push({ key: '系统版本', value: os.release() });
                info.push({ key: '运行时间', value: formatDuration(os.uptime()) });
                info.push({ key: 'CPU', value: manufacturer && brand && `${manufacturer} ${brand}` });
                if (graphics) {
                    const { vendor, temperatureGpu, utilizationGpu, memoryTotal, memoryUsed, model } = graphics;
                    visual.push({
                        title: 'GPU',
                        value: Math.round(utilizationGpu),
                        color: getColor(utilizationGpu),
                        info: [
                            `${(memoryUsed / 1024).toFixed(2)}G / ${(memoryTotal / 1024).toFixed(2)}G`,
                            `${vendor} ${temperatureGpu}°C`
                        ]
                    });
                    info.push({ key: 'GPU', value: model });
                }
                else {
                    visual.push({
                        title: 'GPU',
                        value: 0,
                        color: '',
                        status: 'exception',
                        info: ['没有获取到数据']
                    });
                }
                info.push({ key: '插件数量', value: getPluginNum() });
                try {
                    const packageFile = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
                    info.push({ key: 'TRSS-Yunzai', value: packageFile.version });
                }
                catch { /* empty */ }
                const { node, v8, git } = await si.versions('node,v8,git');
                info.push({ key: 'Node', value: node });
                info.push({ key: 'V8', value: v8 });
                info.push({ key: 'Git', value: git });
                const HardDisk = _.uniqWith(await si.fsSize(), (a, b) => a.used === b.used && a.size === b.size && a.use === b.use && a.available === b.available).filter(item => item.size && item.used && item.available && item.use);
                return {
                    success: true,
                    data: {
                        visual,
                        fsSize: HardDisk.map(item => ({
                            ...item,
                            used: formatBytes(item.used),
                            size: formatBytes(item.size),
                            use: Math.round(item.use),
                            color: getColor(item.use)
                        })),
                        info: info.filter(i => i.value)
                    }
                };
            }
        }
    ]
};
