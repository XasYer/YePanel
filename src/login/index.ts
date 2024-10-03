import { randomUUID } from 'crypto'
// @ts-ignore
import { config } from '../../../QQBot-Plugin/Model/index.js'
import { httpRoute } from '@/types/route'

const token: { [uin: string]: string } = {}

export const getToken = (uin: string) => token[uin]

export default {
  http: [
    {
      url: '/login',
      method: 'post',
      response: ({ body }) => {
        const { username: uin, password } = body
        const bot = Bot[uin]
        if (!bot) {
          return {
            message: 'Bot不存在'
          }
        }
        if (bot.adapter.name !== 'QQBot') {
          return {
            message: '不是 QQBot 适配器'
          }
        }
        const p = config.web.password[uin] || config.web.password.default
        if (p !== password) {
          return {
            message: '密码错误'
          }
        }
        token[uin] = randomUUID()
        return {
          success: true,
          data: {
            avatar: bot.avatar,
            username: 'admin',
            nickname: bot.nickname,
            roles: ['admin'],
            accessToken: token[uin] + '.' + uin,
            refreshToken: token[uin] + ':refreshToken.' + uin,
            expires: '2030/10/30 00:00:00',
            uin: Number(uin)
          }
        }
      }
    },
    {
      url: '/get-async-routes',
      method: 'get',
      response: () => {
        return {
          success: true,
          data: []
        }
      }
    }
  ]
} as { http: httpRoute[] }
