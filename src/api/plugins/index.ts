/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpRoute } from '@/types/route'

/** 缓存每个插件的修改设置方法 */
const guobaSetConfigDataCache: {
  [key: string]: (data: any, cb: { Result: { ok: (data: any, msg: string) => void, error: (data: any, msg: string) => void }}) => any
} = {}

export const setConfigDataCache = (plugin: string, fnc: any) => {
  guobaSetConfigDataCache[plugin] = fnc
}

export default {
  http: [
    {
      url: '/get-group-list',
      method: 'post',
      token: true,
      response: () => {
        return {
          success: true,
          data: Array.from(Bot.gl.values()).map(i=> ({...i, label: `${i.group_name || ''}(${i.group_id})`, value: i.group_id}))
        }
      }
    },
    {
      url: '/get-friend-list',
      method: 'post',
      token: true,
      response:  () => {
          return {
            success: true,
            data: Array.from(Bot.fl.values()).map(i=> ({...i, label: `${i.user_name || ''}(${i.user_id})`, value: i.user_id}))
          }
      }
    },
    {
      url: '/setting/:plugin',
      method: 'post',
      response: async (req) => {
        const plugin = req.params.plugin
        let message = '未找到方法'
        if (guobaSetConfigDataCache[plugin]) {
          await guobaSetConfigDataCache[plugin](req.body, {
            Result: {
              ok: (_, msg) => message = msg, 
              error: (_, msg) => message = msg 
            }
          })
        }
        return { success: true, message}
      }
    }
  ]
} as { http: httpRoute[] }
