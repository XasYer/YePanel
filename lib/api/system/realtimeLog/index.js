import _ from 'lodash';
import moment from 'moment';
import { tokenAuth } from '../../../api/login/index.js';
const originalLogger = _.cloneDeep(global.logger);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logger = { logger: {} };
const logMethods = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'mark'];
function proxyLogger(method, ws) {
    if (!logger[method]) {
        logger[method] = originalLogger[method].bind(originalLogger);
    }
    if (!logger.logger[method]) {
        logger.logger[method] = originalLogger.logger[method].bind(originalLogger.logger);
    }
    global.logger[method] = (...logs) => {
        if (method !== 'info') {
            ws.send(JSON.stringify({ type: 'logger', level: method, logs: [global.logger.blue('[TRSSYz]'), ...logs], timestamp: moment().format('HH:mm:ss.SSS') }));
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
export default {
    ws: [
        {
            url: '/realtimeLog',
            function: (ws, req) => {
                if (!tokenAuth(req.headers['sec-websocket-protocol'] || '')) {
                    ws.send('Authentication failed.');
                    ws.close();
                }
                else {
                    logMethods.forEach((method) => proxyLogger(method, ws));
                }
                ws.on('message', message => {
                    let data;
                    try {
                        data = JSON.parse(message.toString());
                    }
                    catch {
                        ws.send(JSON.stringify({ type: 'error', success: false, content: 'Invalid message format' }));
                        return;
                    }
                    const { action } = data;
                    switch (action) {
                        // 心跳
                        case 'ping':
                            ws.send(JSON.stringify({ type: 'ping', content: 'pong' }));
                            break;
                        default:
                            break;
                    }
                });
                ws.on('close', () => logMethods.forEach((method) => unproxyLogger(method)));
                ws.on('error', () => logMethods.forEach((method) => unproxyLogger(method)));
            }
        }
    ]
};
