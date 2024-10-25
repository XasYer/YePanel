import fs from 'fs';
import { version } from '../../../common/index.js';
import { join } from 'path';
export default [
    {
        url: '/get-log-list',
        method: 'get',
        handler: () => {
            try {
                const logList = fs.readdirSync(join(version.BotPath, 'logs')).filter(file => file.endsWith('.log'));
                return {
                    success: true,
                    data: logList
                };
            }
            catch (error) {
                return {
                    success: false,
                    message: error.message
                };
            }
        }
    },
    {
        url: '/get-log-content',
        method: 'get',
        handler: ({ query }) => {
            const { name } = query;
            try {
                const logContent = fs.readFileSync(join(version.BotPath, 'logs', name), 'utf-8');
                return {
                    success: true,
                    data: logContent
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
