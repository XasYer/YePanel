import { RouteOptions } from 'fastify'
import fs from 'fs'
import { version } from '@/common'
import { join } from 'path'

export default [
  {
    url: '/get-log-list',
    method: 'get',
    handler: () => {
      try {
        const logList = fs.readdirSync(join(version.BotPath, 'logs')).filter(file => file.endsWith('.log'))
        return {
          success: true,
          data: logList
        }
      } catch (error) {
        return {
          success: false,
          message: (error as Error).message
        }
      }
    }
  },
  {
    url: '/get-log-content',
    method: 'get',
    handler: ({ query }) => {
      const { name } = query as { name: string }
      try {
        const logContent = fs.readFileSync(join(version.BotPath, 'logs', name), 'utf-8')
        return {
          success: true,
          data: logContent
        }
      } catch (error) {
        return {
          success: false,
          message: (error as Error).message
        }
      }
    }
  }
] as RouteOptions[]
