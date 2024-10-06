import fs from 'fs';
import os from 'os';
import _ from 'lodash';
import { join } from 'path';
import { utils } from '../../common/index.js';
import si from 'systeminformation';
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
                            `${utils.formatBytes(active)} / ${utils.formatBytes(total)}`
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
                            `${utils.formatBytes(swapused)} / ${utils.formatBytes(swaptotal)}`
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
                const rss = utils.formatBytes(memory.rss);
                // 堆
                const heapTotal = utils.formatBytes(memory.heapTotal);
                // 栈
                const heapUsed = utils.formatBytes(memory.heapUsed);
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
                info.push({ key: '运行时间', value: utils.formatDuration(os.uptime()) });
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
                            used: utils.formatBytes(item.used),
                            size: utils.formatBytes(item.size),
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
