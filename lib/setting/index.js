// @ts-ignore
import { config, configSave } from '../../../QQBot-Plugin/Model/index.js';
export default {
    http: [
        {
            url: '/get-setting-data',
            method: 'post',
            token: true,
            response: () => {
                let maxRetry = config.bot.maxRetry;
                if (maxRetry === Infinity) {
                    maxRetry = 0;
                }
                return {
                    success: true,
                    data: {
                        ...config,
                        bot: {
                            ...config.bot,
                            maxRetry
                        }
                    }
                };
            }
        },
        {
            url: '/set-setting',
            method: 'post',
            token: true,
            response: async ({ body }) => {
                const { data } = body;
                if (data.bot.maxRetry === 0) {
                    data.bot.maxRetry = Infinity;
                }
                for (const key in data) {
                    config[key] = data[key];
                }
                try {
                    await configSave();
                    return {
                        success: true
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
    ]
};
