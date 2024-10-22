import moment from 'moment'
import { config, version } from '@/common'
// @ts-ignore
import PluginLoader from '../../../../../../lib/plugins/loader.js'
import { RouteOptions } from 'fastify'

if (version.BotName === 'Miao') {
  Bot.on('message', (e) => {
    const day = moment().format('YYYY:MM:DD')
    // 接收消息数量
    incr(`YePanel:recv:${day}`)

    // 接收群消息数量
    if (e.group_id && config.stats.rankChart.groupRecv) {
      incr(`YePanel:recv:group:${e.group_id}:${day}`)
    }

    // 接收用户消息数量
    if (e.user_id && config.stats.rankChart.userRecv) {
      incr(`YePanel:recv:user:${e.user_id}:${day}`)
    }
  })
}

// 插件调用统计
if (config.stats.rankChart.pluginUse || config.stats.countChart.plugin) {
  // 代理PluginLoader的 filtPermission 函数, 每次触发插件都会调用, 判断logFnc
  PluginLoader.filtPermission = new Proxy(PluginLoader.filtPermission, {
    apply (target, thisArg, args) {
      const res = target.apply(thisArg, args)
      if (res) {
        const day = moment().format('YYYY:MM:DD')
        // 插件总调用数量
        if (config.stats.countChart.plugin) {
          incr(`YePanel:plugin:total:${day}`)
        }
        // 插件调用排行榜
        if (config.stats.rankChart.pluginUse) {
          const [e] = args
          const { name, fnc } = getLog(e?.logFnc)
          if (name && fnc) {
            incr(`YePanel:plugin:use:${day}:${name}(${fnc})`)
          }
        }
      }
      return res
    }
  })
}

// 发送统计
if (
  // Miao 并且开启了任意发送统计
  (version.BotName === 'Miao' && (config.stats.rankChart.groupSent || config.stats.rankChart.userSent || config.stats.rankChart.pluginSent)) ||
  // TRSS 只需要统计插件发送
  (version.BotName === 'TRSS' && config.stats.rankChart.pluginSent)
) {
  // 代理 count 每次发送消息都会调用
  PluginLoader.count = new Proxy(PluginLoader.count, {
    apply (target, thisArg, args) {
      const [e] = args
      // 群消息发送数量
      if (version.BotName === 'Miao' && e?.group_id && config.stats.rankChart.groupSent) {
        incr(`YePanel:sent:group:${e.group_id}:${moment().format('YYYY:MM:DD')}`)
      }
      // 用户消息发送数量
      if (version.BotName === 'Miao' && e?.user_id && config.stats.rankChart.userSent) {
        incr(`YePanel:sent:user:${e.user_id}:${moment().format('YYYY:MM:DD')}`)
      }
      // 插件发送消息排行
      if (e?.logFnc && config.stats.rankChart.pluginSent) {
        const { name, fnc } = getLog(e.logFnc)
        if (name && fnc) {
          incr(`YePanel:plugin:sent:${moment().format('YYYY:MM:DD')}:${name}(${fnc})`)
        }
      }
      return target.apply(thisArg, args)
    }
  })
}

function getLog (log: string) {
  const info = {
    name: '',
    fnc: ''
  }
  if (log) {
    const reg = version.BotName === 'Miao' ? /\[(.+?)\]\[(.+?)\]/ : /\[(.+?)\((.+?)\)\]/
    try {
      const [, name, fnc] = reg.exec(log) || []
      if (name && fnc) {
        return { name: name.replace('34m[', ''), fnc }
      }
    } catch { }
  }
  return info
}

function getName (id: string, type: 'group' | 'user'): string {
  try {
    const info = Bot[type === 'group' ? 'pickGroup' : 'pickUser'](id)
    const name = info?.name || info?.nickname
    if (name) {
      return `${name}(${id})`
    }
  } catch { }
  return id
}

function incr (key: string) {
  redis.incr(key).then(i => {
    if (i === 1) {
      redis.expire(key, 60 * 60 * 24 * 31).catch(() => {})
    }
  }).catch(() => {})
}

type ChartData = {
  name: string,
  value: number
}[]
/** @param key 日期 */
type RankData = {
  [key: string]: ChartData
}

function sort (data: ChartData) {
  data.sort((a, b) => b.value - a.value)
  if (data.length > 10) {
    data.pop()
  }
}

async function scan (MATCH: string, getName: (key: string) => string) {
  const ChartData: ChartData = []
  let cursor = 0
  do {
    const res = await redis.scan(cursor, { MATCH, COUNT: 10000 })
    cursor = res.cursor
    for (const key of res.keys) {
      const name = getName(key)
      if (!name) continue
      const value = Number(await redis.get(key))
      ChartData.push({ name, value })
      sort(ChartData)
    }
  } while (cursor !== 0)
  return ChartData
}

export default [
  {
    url: '/get-stats-data',
    method: 'post',
    handler: async () => {
      const data: {
        countChart: {
          sent: number[],
          recv: number[],
          plugin: number[],
          time: string[]
        },
        rankChart: {
          pluginUse: RankData,
          pluginSent: RankData,
          userSent: RankData,
          userRecv: RankData,
          groupRecv: RankData,
          groupSent: RankData,
        }
      } = {
        countChart: {
          sent: [],
          recv: [],
          plugin: [],
          time: []
        },
        rankChart: {
          pluginUse: {},
          pluginSent: {},
          userSent: {},
          userRecv: {},
          groupRecv: {},
          groupSent: {}
        }
      }
      const countConfig = config.stats.countChart
      const date = moment()
      for (let i = 0; i < 30; i++) {
        const time = date.format('YYYY:MM:DD')
        const timeKey = time.replace(/:/g, '-')

        const tasks: Promise<string | null | false>[] = []
        // 发送消息数量
        if (countConfig.sent) {
          if (version.BotName === 'Miao') {
            tasks.push(redis.get(`Yz:count:sendMsg:day:${date.format('MMDD')}:${time}`))
          } else if (version.BotName === 'TRSS') {
            tasks.push(redis.get(`Yz:count:send:msg:total:${time}`))
          }
        } else {
          tasks.push(Promise.resolve(false))
        }

        // 接收消息数量
        if (countConfig.recv) {
          if (version.BotName === 'Miao') {
            tasks.push(redis.get(`YePanel:recv:${time}`))
          } else if (version.BotName === 'TRSS') {
            tasks.push(redis.get(`Yz:count:receive:msg:total:${time}`))
          }
        } else {
          tasks.push(Promise.resolve(false))
        }

        // 插件总调用数量
        if (countConfig.plugin) {
          tasks.push(redis.get(`YePanel:plugin:total:${time}`))
        } else {
          tasks.push(Promise.resolve(false))
        }

        const values = await Promise.all(tasks)

        if (values.some(v => v !== false)) {
          data.countChart.time.unshift(timeKey)
          if (values[0] !== false) {
            data.countChart.sent.unshift(Number(values[0]))
          }
          if (values[1] !== false) {
            data.countChart.recv.unshift(Number(values[1]))
          }
          if (values[2] !== false) {
            data.countChart.plugin.unshift(Number(values[2]))
          }
        }

        // 插件触发次数排行
        if (config.stats.rankChart.pluginUse) {
          const rkey = `YePanel:plugin:use:${time}:`
          const value = await scan(rkey + '*', (key) => key.replace(rkey, ''))
          if (value.length) {
            data.rankChart.pluginUse[timeKey] = value
          }
        }

        // 插件发送消息排行
        if (config.stats.rankChart.pluginSent) {
          const rkey = `YePanel:plugin:sent:${time}:`
          const value = await scan(rkey + '*', (key) => key.replace(rkey, ''))
          if (value.length) {
            data.rankChart.pluginSent[timeKey] = value
          }
        }

        // 群聊接收消息排行
        if (config.stats.rankChart.groupRecv) {
          const MATCH = (() => {
            switch (version.BotName) {
              case 'TRSS':
                return `Yz:count:receive:msg:group:*:${time}`
              case 'Miao':
                return `YePanel:recv:group:*:${time}`
            }
          })()
          const reg = new RegExp(MATCH.replace('*', '(.+?)'))
          const value = await scan(MATCH, (key) => reg.exec(key)?.[1] || '')
          if (value.length) {
            data.rankChart.groupRecv[timeKey] = value.map(v => ({ ...v, name: getName(v.name, 'group') }))
          }
        }

        // 群聊发送消息排行
        if (config.stats.rankChart.groupSent) {
          const MATCH = (() => {
            switch (version.BotName) {
              case 'TRSS':
                return `Yz:count:send:msg:group:*:${time}`
              case 'Miao':
                return `YePanel:recv:group:*:${time}`
            }
          })()
          const reg = new RegExp(MATCH.replace('*', '(.+?)'))
          const value = await scan(MATCH, (key) => reg.exec(key)?.[1] || '')
          if (value.length) {
            data.rankChart.groupSent[timeKey] = value.map(v => ({ ...v, name: getName(v.name, 'group') }))
          }
        }

        // 用户接收消息排行
        if (config.stats.rankChart.userRecv) {
          const MATCH = (() => {
            switch (version.BotName) {
              case 'TRSS':
                return `Yz:count:receive:msg:user:*:${time}`
              case 'Miao':
                return `YePanel:recv:user:*:${time}`
            }
          })()
          const reg = new RegExp(MATCH.replace('*', '(.+?)'))
          const value = await scan(MATCH, (key) => reg.exec(key)?.[1] || '')
          if (value.length) {
            data.rankChart.userRecv[timeKey] = value.map(v => ({ ...v, name: getName(v.name, 'user') }))
          }
        }

        // 用户发送消息排行
        if (config.stats.rankChart.groupSent) {
          const MATCH = (() => {
            switch (version.BotName) {
              case 'TRSS':
                return `Yz:count:send:msg:user:*:${time}`
              case 'Miao':
                return `YePanel:recv:user:*:${time}`
            }
          })()
          const reg = new RegExp(MATCH.replace('*', '(.+?)'))
          const value = await scan(MATCH, (key) => reg.exec(key)?.[1] || '')
          if (value.length) {
            data.rankChart.userSent[timeKey] = value.map(v => ({ ...v, name: getName(v.name, 'user') }))
          }
        }

        date.add(-1, 'days')
      }
      return {
        success: true,
        data
      }
    }
  }
] as RouteOptions[]
