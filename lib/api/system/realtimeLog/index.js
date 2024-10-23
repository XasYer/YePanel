import _ from 'lodash';
import moment from 'moment';
import { version } from '../../../common/index.js';
const originalLogger = _.cloneDeep(global.logger);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logger = { logger: {} };
const logMethods = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'mark'];
function proxyLogger(method, ws) {
    if (!logger[method]) {
        logger[method] = originalLogger[method].bind(originalLogger);
    }
    if (originalLogger.logger && !logger.logger[method]) {
        logger.logger[method] = originalLogger.logger[method].bind(originalLogger.logger);
    }
    global.logger[method] = (...logs) => {
        if (method !== 'info') {
            ws.send(JSON.stringify({ type: 'logger', level: method, logs: [version.BotName === 'TRSS' ? global.logger.blue('[TRSSYz]') : '', ...logs], timestamp: moment().format('HH:mm:ss.SSS') }));
        }
        return logger[method](...logs);
    };
    if (global.logger.logger) {
        global.logger.logger[method] = (...logs) => {
            ws.send(JSON.stringify({ type: 'logger', level: method, logs, timestamp: moment().format('HH:mm:ss.SSS') }));
            return logger.logger[method](...logs);
        };
    }
}
function unproxyLogger(method) {
    global.logger[method] = originalLogger[method].bind(originalLogger);
    if (global.logger?.logger) {
        global.logger.logger[method] = originalLogger.logger[method].bind(originalLogger.logger);
    }
}
export default [
    {
        url: '/realtimeLog',
        method: 'get',
        handler: () => 'Ciallo～(∠・ω< )⌒☆',
        wsHandler: (connection) => {
            logMethods.forEach((method) => proxyLogger(method, connection));
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
            connection.on('close', () => logMethods.forEach((method) => unproxyLogger(method)));
            connection.on('error', () => logMethods.forEach((method) => unproxyLogger(method)));
        }
    }
];
