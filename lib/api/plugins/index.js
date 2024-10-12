/* eslint-disable @typescript-eslint/no-explicit-any */
import { version } from '../../common/index.js';
import { join } from 'path';
/** 缓存每个插件的修改设置方法 */
const guobaSetConfigDataCache = {};
export const setConfigDataCache = (plugin, fnc) => {
    guobaSetConfigDataCache[plugin] = fnc;
};
const customRoutes = {};
export const addCustomRoutes = (plugin, routes) => {
    customRoutes[plugin] = routes;
};
export default [
    {
        url: '/get-group-list',
        method: 'post',
        handler: () => {
            return {
                success: true,
                data: Array.from(Bot.gl.values()).map(i => ({ ...i, label: `${i.group_name || ''}(${i.group_id})`, value: i.group_id }))
            };
        }
    },
    {
        url: '/get-friend-list',
        method: 'post',
        handler: () => {
            return {
                success: true,
                data: Array.from(Bot.fl.values()).map(i => ({ ...i, label: `${i.user_name || ''}(${i.user_id})`, value: i.user_id }))
            };
        }
    },
    {
        url: '/get-guoba-data',
        method: 'post',
        handler: async ({ body }) => {
            const { plugin } = body;
            const guobaSupportPath = join(version.BotPath, 'plugins', plugin, 'guoba.support.ts');
            const supportGuoba = (await import(`file://${guobaSupportPath}?t=${Date.now()}`)).supportGuoba;
            const { configInfo: { getConfigData, schemas } } = supportGuoba();
            return {
                success: true,
                data: await getConfigData(),
                schemas
            };
        }
    },
    {
        url: '/setting/:plugin',
        method: 'post',
        handler: async (req) => {
            const { plugin } = req.params;
            let message = '未找到方法';
            if (guobaSetConfigDataCache[plugin]) {
                await guobaSetConfigDataCache[plugin](req.body, {
                    Result: {
                        ok: (_, msg) => message = msg,
                        error: (_, msg) => message = msg
                    }
                });
            }
            return { success: true, message };
        }
    }
];
