/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
import { Application, Request } from 'express'
import { RedisClientType } from 'redis'
import { Logger } from 'log4js'
import { WebSocket } from 'ws'

interface logger extends Logger {
  error: (msg: string, ...args: any[]) => void
  info: (msg: string, ...args: any[]) => void
  debug: (msg: string, ...args: any[]) => void
  warn: (msg: string, ...args: any[]) => void
  trace: (msg: string, ...args: any[]) => void
  fatal: (msg: string, ...args: any[]) => void
  mark: (msg: string, ...args: any[]) => void
  logger: Logger
  blue: (name: string) => string
}

declare global {
  var Bot: {
    express: Application;
    wsf: {
      [key: string]: Array<(ws: WebSocket, req: Request, socket: internal.Duplex, head: Buffer) => void>;
    };
    [key: string]: {
      adapter: { name: string}
      avatar: string
      nickname: string
      fl: Map<string, number>
      gl: Map<string, number>
      dau: {
        dauDB: 'redis'|'level'|false
        all_user: {[key: string]: number, total: number}
        all_group: {[key: string]: number, total: number}
        call_stats: {[key: string]: number, total: number}
        getStats: () => Promise<{user_count: number, group_count: number, receive_msg_count: number, send_msg_count: number, group_increase_count: number, group_decrease_count: number}>
        monthlyDau: (any) => Promise<any>
        callStat: (any, boolean) => Promise<any>
      }
    }
  }
  var redis: RedisClientType
  var logger: logger
}
