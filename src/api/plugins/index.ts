/* eslint-disable @typescript-eslint/no-explicit-any */
import { version } from '@/common'
import { RouteOptions } from 'fastify'
import { join } from 'path'
import fs from 'fs'

/** 缓存每个插件的修改设置方法 */
const guobaSetConfigDataCache: {
  [key: string]: (data: any, cb: { Result: { ok: (data: any, msg: string) => void, error: (data: any, msg: string) => void }}) => any
} = {}

export const setConfigDataCache = (plugin: string, fnc: any) => {
  guobaSetConfigDataCache[plugin] = fnc
}

const customRoutes: {[key: string]: RouteOptions[]} = {}

export const addCustomRoutes = (plugin: string, routes: RouteOptions[]) => {
  customRoutes[plugin] = routes
}

const pluginIconPath: {[key: string]: string} = {}

export const setPluginIconPath = (plugin: string, path: string) => {
  pluginIconPath[plugin] = path
}

export default [
  {
    url: '/get-group-list',
    method: 'get',
    handler: () => {
      return {
        success: true,
        data: Array.from(Bot.gl.values()).map(i => ({ ...i, label: `${i.group_name || ''}(${i.group_id})`, value: i.group_id }))
      }
    }
  },
  {
    url: '/get-friend-list',
    method: 'get',
    handler: () => {
      return {
        success: true,
        data: Array.from(Bot.fl.values()).map(i => ({ ...i, label: `${i.user_name || ''}(${i.user_id})`, value: i.user_id }))
      }
    }
  },
  {
    url: '/get-guoba-data',
    method: 'get',
    handler: async ({ query }) => {
      const { plugin } = query as { plugin: string }
      const guobaSupportPath = join(version.BotPath, 'plugins', plugin, 'guoba.support.js')
      const supportGuoba = (await import(`file://${guobaSupportPath}?t=${Date.now()}`)).supportGuoba
      const { configInfo: { getConfigData, schemas } } = supportGuoba()
      return {
        success: true,
        data: await getConfigData(),
        schemas
      }
    }
  },
  {
    url: '/setting/:plugin',
    method: 'post',
    handler: async (req) => {
      const { plugin } = req.params as { plugin: string }
      let message = '未找到方法'
      if (guobaSetConfigDataCache[plugin]) {
        await guobaSetConfigDataCache[plugin](req.body, {
          Result: {
            ok: (_, msg) => { message = msg },
            error: (_, msg) => { message = msg }
          }
        })
      }
      return { success: true, message }
    }
  },
  {
    url: '/image/:plugin',
    method: 'get',
    handler: (req, reply) => {
      const { plugin } = req.params as { plugin: string }
      const iconPath = pluginIconPath[plugin]
      if (iconPath) {
        const stream = fs.createReadStream(iconPath)
        const ext = iconPath.split('.').pop()
        reply.type(`image/${ext}`).send(stream)
      } else {
        reply.code(404).send('Not Found')
      }
    }
  }
] as RouteOptions[]
