import moment from 'moment';
import { version } from '../../../common/index.js';
// @ts-ignore
import resetLog from '../../../../../../lib/config/log.js';
const logLevels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'mark'];
const sendWs = (ws, level, logs) => {
    ws.send(JSON.stringify({ type: 'logger', level, logs, timestamp: moment().format('HH:mm:ss.SSS') }));
};
const getProp = (target, p, ws) => {
    if (typeof p === 'string' && logLevels.includes(p)) {
        return (...logs) => {
            sendWs(ws, p, logs);
            return target[p](...logs);
        };
    }
    return target[p];
};
const proxyLogger = (ws) => {
    if (version.BotName === 'TRSS') {
        global.logger.logger = new Proxy(global.logger.logger, {
            get(target, p) {
                return getProp(target, p, ws);
            }
        });
    }
    else if (version.BotName === 'Miao') {
        global.logger = new Proxy(global.logger, {
            get(target, p) {
                return getProp(target, p, ws);
            }
        });
    }
};
const unproxyLogger = () => resetLog();
export default [
    {
        url: '/realtimeLog',
        method: 'get',
        handler: () => 'Ciallo～(∠・ω< )⌒☆',
        wsHandler: (connection) => {
            proxyLogger(connection);
            connection.on('message', message => {
                let data;
                try {
                    data = JSON.parse(message.toString());
                }
                catch {
                    connection.send(JSON.stringify({ type: 'error', success: false, content: 'Invalid message format' }));
                    return;
                }
                const { action } = data;
                switch (action) {
                    // 心跳
                    case 'ping':
                        connection.send(JSON.stringify({ type: 'ping', content: 'pong' }));
                        break;
                    default:
                        break;
                }
            });
            connection.on('close', () => unproxyLogger());
            connection.on('error', () => unproxyLogger());
        }
    }
];
