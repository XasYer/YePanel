import moment from 'moment'
import { WebSocket } from 'ws'
import { RouteOptions } from 'fastify'
import { version } from '@/common'
// @ts-ignore
import resetLog from '../../../../../../lib/config/log.js'
// @ts-ignore
import { Logger } from 'log4js'

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' |'mark'

const logLevels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'mark']

const sendWs = (ws: WebSocket, level: string, logs: string[]) => {
  ws.send(JSON.stringify({ type: 'logger', level, logs, timestamp: moment().format('HH:mm:ss.SSS') }))
}

const getProp = (target: Logger, p: string | symbol, ws: WebSocket) => {
  if (typeof p === 'string' && logLevels.includes(p)) {
    return (...logs: string[]) => {
      sendWs(ws, p, logs)
      return (target[p as LogLevel] as any)(...logs)
    }
  }
  return target[p as LogLevel]
}

const proxyLogger = (ws: WebSocket) => {
  if (version.BotName === 'TRSS') {
    global.logger.logger = new Proxy(global.logger.logger, {
      get (target, p) {
        return getProp(target, p, ws)
      }
    })
  } else if (version.BotName === 'Miao') {
    global.logger = new Proxy(global.logger, {
      get (target, p) {
        return getProp(target, p, ws)
      }
    })
  }
}

const unproxyLogger = () => resetLog()

export default [
  {
    url: '/realtimeLog',
    method: 'get',
    handler: () => 'Ciallo～(∠・ω< )⌒☆',
    wsHandler: (connection) => {
      proxyLogger(connection)
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
      connection.on('close', () => unproxyLogger())
      connection.on('error', () => unproxyLogger())
    }
  }
] as RouteOptions[]
