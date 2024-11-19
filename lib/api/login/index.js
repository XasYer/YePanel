import { randomUUID } from 'crypto';
import { config, version } from '../../common/index.js';
import fs from 'fs';
import { join } from 'path';
import { setConfigDataCache, setPluginIconPath, addCustomRoutes } from '../../api/plugins/index.js';
const token = {};
export const getToken = (uin) => token[uin];
export const tokenAuth = (accesstoken) => {
    if (!accesstoken)
        return false;
    const [accessToken, ...args] = accesstoken.split('.');
    const uin = args?.join('.');
    if (!getToken(uin) || accessToken !== getToken(uin)) {
        return false;
    }
    return true;
};
const fastLoginKey = {};
export const createLoginKey = (uin) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    fastLoginKey[result] = uin;
    setTimeout(() => {
        delete fastLoginKey[result];
    }, 1000 * 60 * 5); // 5分钟过期
    return result;
};
export default [
    {
        url: '/login',
        method: 'post',
        preHandler: (request, reply, done) => done(),
        handler: ({ body }) => {
            let { username: uin, password: inputPassword } = body;
            const account = (() => {
                if (fastLoginKey[uin]) {
                    const bot = Bot[fastLoginKey[uin]];
                    uin = fastLoginKey[uin];
                    delete fastLoginKey[uin];
                    return {
                        password: '',
                        nickname: bot.nickname,
                        avatarUrl: bot.avatar,
                        uin: bot.uin
                    };
                }
                const account = config.server.password;
                if (account[uin]?.enable) {
                    return account[uin];
                }
                else if (Bot[uin]) {
                    const bot = Bot[uin];
                    return {
                        password: account.default.password,
                        nickname: account.default.nickname || bot.nickname,
                        avatarUrl: account.default.avatarUrl || bot.avatar
                    };
                }
                else {
                    return {};
                }
            })();
            if (account.password != inputPassword) {
                return {
                    message: '账号或密码错误'
                };
            }
            token[uin] = randomUUID();
            return {
                success: true,
                data: {
                    avatar: account.avatarUrl,
                    username: 'admin',
                    nickname: account.nickname,
                    roles: ['admin'],
                    accessToken: token[uin] + '.' + uin,
                    refreshToken: token[uin] + ':refreshToken.' + uin,
                    uin,
                    expires: '2030/10/30 00:00:00'
                }
            };
        }
    },
    {
        url: '/get-async-routes',
        method: 'get',
        handler: async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = {
                router: [],
                code: {},
                guoba: {}
            };
            const pluginsPath = join(version.BotPath, 'plugins');
            if (!fs.existsSync(pluginsPath)) {
                return {
                    success: true,
                    data
                };
            }
            // 读取plugins目录下所有文件名
            const pluginList = fs.readdirSync(pluginsPath);
            for (const plugin of pluginList) {
                const pluginPath = join(version.BotPath, 'plugins', plugin);
                // 判断是否为目录
                if (fs.statSync(pluginPath).isDirectory()) {
                    const YePanelPath = join(pluginPath, 'YePanel');
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const router = {};
                    // 判断是否存在YePanel目录
                    if (fs.existsSync(YePanelPath)) {
                        try {
                            // 动态导入YePanel目录下的index.js文件
                            const option = (await import(`file://${join(YePanelPath, 'index.js')}?t=${Date.now()}`)).default;
                            // 设置一级路由为插件名
                            Object.assign(router, option.router);
                            router.path = `/${plugin}`;
                            router.name = plugin;
                            // 给二级路由添加插件名的前缀
                            for (const i of router.children) {
                                i.path = `/${plugin}${i.path}`;
                                i.name = `${plugin}/${i.name}`;
                                i.component = 'plugins/YePanel/index';
                            }
                            data.code[plugin] = { main: {}, components: {} };
                            // 收集Vue页面
                            fs.readdirSync(YePanelPath).forEach(file => {
                                if (file.endsWith('.vue')) {
                                    data.code[plugin].main[file.replace('.vue', '')] = fs.readFileSync(join(YePanelPath, file), 'utf-8');
                                }
                            });
                            // 收集Vue组件
                            const componentPath = join(YePanelPath, 'components');
                            if (fs.existsSync(componentPath) && fs.statSync(componentPath).isDirectory()) {
                                fs.readdirSync(componentPath).forEach(file => {
                                    data.code[plugin].components[file.replace('.vue', '')] = fs.readFileSync(join(componentPath, file), 'utf-8');
                                });
                            }
                            addCustomRoutes(plugin, option.api);
                        }
                        catch { /* empty */ }
                    }
                    // 判断是否存在guoba.support.js
                    const guobaSupportPath = join(pluginPath, 'guoba.support.js');
                    if (fs.existsSync(guobaSupportPath)) {
                        try {
                            const supportGuoba = (await import(`file://${guobaSupportPath}?t=${Date.now()}`)).supportGuoba;
                            const { pluginInfo, configInfo: { setConfigData } } = supportGuoba();
                            setConfigDataCache(plugin, setConfigData);
                            if (pluginInfo.iconPath) {
                                if (fs.existsSync(pluginInfo.iconPath)) {
                                    setPluginIconPath(plugin, pluginInfo.iconPath);
                                    pluginInfo.iconPath = `api:/image/${plugin}`;
                                }
                                else {
                                    delete pluginInfo.iconPath;
                                }
                            }
                            if (!Array.isArray(pluginInfo.author)) {
                                pluginInfo.author = [pluginInfo.author];
                            }
                            if (!Array.isArray(pluginInfo.authorLink)) {
                                pluginInfo.authorLink = [pluginInfo.authorLink];
                            }
                            data.guoba[plugin] = { pluginInfo };
                            // 已经有路由, 并且没有设置页面
                            if (router.name) {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                if (!router.children.some((i) => i.name === `${plugin}/setting`)) {
                                    router.children.push({
                                        path: `/${plugin}/setting`,
                                        name: `${plugin}/setting`,
                                        component: 'plugins/setting/index',
                                        meta: {
                                            title: '设置',
                                            icon: pluginInfo.iconPath || pluginInfo.icon,
                                            showParent: true
                                        }
                                    });
                                }
                            }
                            else {
                                // 没有路由, 则创建
                                Object.assign(router, {
                                    path: `/${plugin}`,
                                    name: plugin,
                                    meta: {
                                        title: pluginInfo.title,
                                        icon: pluginInfo.iconPath || pluginInfo.icon
                                    },
                                    children: [
                                        {
                                            path: `/${plugin}/setting`,
                                            name: `${plugin}/setting`,
                                            component: 'plugins/setting/index',
                                            meta: {
                                                title: pluginInfo.title,
                                                icon: pluginInfo.iconPath || pluginInfo.icon
                                            }
                                        }
                                    ]
                                });
                            }
                        }
                        catch { /* empty */ }
                    }
                    if (router.name) {
                        data.router.push(router);
                    }
                }
            }
            return {
                success: true,
                data
            };
        }
    }
];
