import _ from 'lodash'
import moment from 'moment'
import { WebSocket } from 'ws'
import { RouteOptions } from 'fastify'

const originalLogger = _.cloneDeep(global.logger)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logger: { [key: string]: any, logger: { [key: string]: any} } = { logger: {} }

const logMethods: ('trace'| 'debug'| 'info'| 'warn'| 'error'| 'fatal'| 'mark')[] = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'mark']

function proxyLogger (method: 'trace'| 'debug'| 'info'| 'warn'| 'error'| 'fatal'| 'mark', ws: WebSocket) {
  if (!logger[method]) {
    logger[method] = originalLogger[method].bind(originalLogger)
  }
  if (!logger.logger[method]) {
    logger.logger[method] = originalLogger.logger[method].bind(originalLogger.logger)
  }

  global.logger[method] = (...logs) => {
    if (method !== 'info') {
      ws.send(JSON.stringify({ type: 'logger', level: method, logs: [global.logger.blue('[TRSSYz]'), ...logs], timestamp: moment().format('HH:mm:ss.SSS') }))
    }

    return logger[method](...logs)
  }

  if (global.logger.logger) {
    global.logger.logger[method] = (...logs: string[]) => {
      ws.send(JSON.stringify({ type: 'logger', level: method, logs, timestamp: moment().format('HH:mm:ss.SSS') }))

      return logger.logger[method](...logs)
    }
  }
}

function unproxyLogger (method: 'trace'| 'debug'| 'info'| 'warn'| 'error'| 'fatal'| 'mark') {
  global.logger[method] = originalLogger[method].bind(originalLogger)
  if (global.logger?.logger) {
    global.logger.logger[method] = originalLogger.logger[method].bind(originalLogger.logger)
  }
}

export default [
  {
    url: '/realtimeLog',
    method: 'get',
    handler: () => 'Ciallo～(∠・ω< )⌒☆',
    wsHandler: (connection) => {
      logMethods.forEach((method) => proxyLogger(method, connection))
      connection.on('message', message => {
        let data
        try {
          data = JSON.parse(message.toString())
        } catch {
          connection.send(JSON.stringify({ type: 'error', success: false, content: 'Invalid message format' }))
          return
        }
        const { action } = data
        switch (action) {
          // 心跳
          case 'ping':
            connection.send(JSON.stringify({ type: 'ping', content: 'pong' }))
            break
          default:
            break
        }
      })
      connection.on('close', () => logMethods.forEach((method) => unproxyLogger(method)))
      connection.on('error', () => logMethods.forEach((method) => unproxyLogger(method)))
    }
  }
] as RouteOptions[]
