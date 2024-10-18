/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
import { RedisClientType } from 'redis'
import { Logger } from 'log4js'

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
    uin: number | string[]
    gl: Map<string, {[key: string]: any}>;
    fl: Map<string, {[key: string]: any}>;
    adapter: any[] | any
    em: (key: string, value: any) => void
    emit: (event: string, value: any) => void
    [key: string]: {
      self_id: number | string
      nickname: string
      avatar: string
      uin: number | string
      adapter: { name: string, id: string, [key: string]: any }
      avatar: string
      nickname: string
      fl: Map<string, any>
      gl: Map<string, any>
      gml: Map<string, any>
      version: {
        version: string
        name: string
        [key: string]: any
      }
      stat: {
        sent_msg_cnt?: number
        recv_msg_cnt?: number
        [key: string]: any
      }
      pickUser: (user_id: string) => any
      pickFriend: (user_id: string) => any
      pickGroup: (group_id: string) => any
      pickMember: (group_id: string, user_id: string) => any
      sendGroupMsg: (group_id: string, msg: any) => Promise<any>
      sendPrivateMsg: (user_id: string, msg: any) => Promise<any>
      getFriendList: () => Map<string, any>
      getGroupList: () => Map<string, any>
      getGroupMemberList: (group_id: string) => Map<string, Map<string, any>>
      dau?: {
        dauDB: 'redis'|'level'|false
        all_user: {[key: string]: number, total: number}
        all_group: {[key: string]: number, total: number}
        call_stats: {[key: string]: number, total: number}
        getStats: () => Promise<{user_count: number, group_count: number, receive_msg_count: number, send_msg_count: number, group_increase_count: number, group_decrease_count: number}>
        monthlyDau: (any) => Promise<any>
        callStat: (any, boolean) => Promise<any>
      }
      [key: string]: any
    }
  }
  var redis: RedisClientType
  var logger: logger
}
