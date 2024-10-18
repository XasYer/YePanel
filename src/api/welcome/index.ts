import fs from 'fs'
import os from 'os'
import _ from 'lodash'
import { join } from 'path'
import { utils, version } from '@/common'
import si from 'systeminformation'
import { RouteOptions } from 'fastify'
import moment from 'moment'
import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process'

function getPlugins () {
  // 获取插件数量插件包目录包含package.json或.git目录才被视为一个插件包
  const dir = './plugins'
  const dirArr = fs.readdirSync(dir, { withFileTypes: true })
  const exc = ['example']
  const plugins = dirArr.map(i => {
    let hasPackage = false, hasGit = false
    if (i.isDirectory()) {
      if (fs.existsSync(join(dir, i.name, 'package.json')) && !exc.includes(i.name)) {
        hasPackage = true
      }
      const gitPath = join(dir, i.name, '.git')
      if (fs.existsSync(gitPath) && fs.statSync(gitPath).isDirectory()) {
        hasGit = true
      }
    }
    return {
      hasPackage,
      hasGit,
      name: i.name
    }
  }).filter(i => i.hasPackage || i.hasGit)
  // 获取js插件数量，以.js结尾的文件视为一个插件
  const jsDir = join(dir, 'example')
  let js = 0
  try {
    js = fs.readdirSync(jsDir)
      ?.filter(item => item.endsWith('.js'))
      ?.length
  } catch { /* empty */ }
  return {
    info: `${plugins?.length ?? 0} plugins | ${js ?? 0} js`,
    plugins
  }
}

export default [
  {
    url: '/get-system-info',
    method: 'post',
    handler: async () => {
      const {
        currentLoad: { currentLoad: cpuCurrentLoad },
        cpu: { manufacturer, speed, cores, brand },
        fullLoad,
        mem: { total, active, swaptotal, swapused }
      } = await si.get({
        currentLoad: 'currentLoad',
        cpu: 'manufacturer,speed,cores,brand',
        fullLoad: '*',
        mem: 'total,active,swaptotal,swapused'
      })

      const getColor = (value: number) => {
        if (value >= 90) {
          return '#d56565'
        } else if (value >= 70) {
          return '#FFD700'
        } else {
          return '#73a9c6'
        }
      }
      const ramCurrentLoad = Math.round(Number((active / total).toFixed(2)) * 100)
      const visual: {
        title: string,
        value: number,
        color: string,
        status?: string,
        info: string[]
      }[] = [
        {
          title: 'CPU',
          value: Math.round(cpuCurrentLoad),
          color: getColor(cpuCurrentLoad),
          info: [
            `${manufacturer} ${cores}核 ${speed}GHz`,
            `CPU满载率 ${Math.round(fullLoad)}%`
          ]
        },
        {
          title: 'RAM',
          value: ramCurrentLoad,
          color: getColor(ramCurrentLoad),
          info: [
            `${utils.formatBytes(active)} / ${utils.formatBytes(total)}`
          ]
        }
      ]
      if (swaptotal) {
        const swapCurrentLoad = Math.round(Number((swapused / swaptotal).toFixed(2)) * 100)
        visual.push({
          title: 'SWAP',
          value: swapCurrentLoad,
          color: getColor(swapCurrentLoad),
          info: [
            `${utils.formatBytes(swapused)} / ${utils.formatBytes(swaptotal)}`
          ]
        })
      } else {
        visual.push({
          title: 'SWAP',
          value: 0,
          color: '',
          status: 'exception',
          info: ['没有获取到数据']
        })
      }

      const memory = process.memoryUsage()
      // 总共
      const rss = utils.formatBytes(memory.rss)
      // 堆
      const heapTotal = utils.formatBytes(memory.heapTotal)
      // 栈
      const heapUsed = utils.formatBytes(memory.heapUsed)
      // 占用率
      const occupy = Number((memory.rss / (os.totalmem() - os.freemem())).toFixed(2)) * 100

      visual.push({
        title: 'Node',
        value: Math.round(occupy),
        color: getColor(occupy),
        info: [
          `总 ${rss}`,
          `${heapTotal} | ${heapUsed}`
        ]
      })

      const { controllers } = await si.graphics()
      const graphics = controllers?.find(item =>
        item.memoryUsed && item.memoryFree && item.utilizationGpu
      )

      const info = []

      info.push({ key: '操作系统', value: `${os.type()} ${os.arch()}` })
      info.push({ key: '主机名称', value: os.hostname() })
      info.push({ key: '系统版本', value: os.release() })
      info.push({ key: '运行时间', value: utils.formatDuration(os.uptime()) })
      info.push({ key: 'CPU', value: manufacturer && brand && `${manufacturer} ${brand}` })

      if (graphics) {
        const {
          vendor, temperatureGpu, utilizationGpu,
          memoryTotal, memoryUsed, model
        } = graphics
        visual.push({
          title: 'GPU',
          value: Math.round(utilizationGpu as number),
          color: getColor(utilizationGpu as number),
          info: [
            `${((memoryUsed as number) / 1024).toFixed(2)}G / ${((memoryTotal as number) / 1024).toFixed(2)}G`,
            `${vendor} ${temperatureGpu}°C`
          ]
        })
        info.push({ key: 'GPU', value: model })
      } else {
        visual.push({
          title: 'GPU',
          value: 0,
          color: '',
          status: 'exception',
          info: ['没有获取到数据']
        })
      }
      const plugins = getPlugins()
      info.push({ key: '插件数量', value: plugins.info })

      try {
        const packageFile = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
        info.push({ key: `${version.BotName}-Yunzai`, value: packageFile.version })
      } catch { /* empty */ }
      const { node, v8, git } = await si.versions('node,v8,git')

      info.push({ key: 'Node', value: node })
      info.push({ key: 'V8', value: v8 })
      info.push({ key: 'Git', value: git })

      const HardDisk = _.uniqWith(await si.fsSize(),
        (a, b) =>
          a.used === b.used && a.size === b.size && a.use === b.use && a.available === b.available
      ).filter(item => item.size && item.used && item.available && item.use)
      return {
        success: true,
        data: {
          visual,
          fsSize: HardDisk.map(item => ({
            ...item,
            used: utils.formatBytes(item.used),
            size: utils.formatBytes(item.size),
            use: Math.round(item.use),
            color: getColor(item.use)
          })),
          info: info.filter(i => i.value),
          plugins: plugins.plugins,
          BotName: version.BotName
        }
      }
    }
  },
  {
    url: '/get-bot-info',
    method: 'post',
    handler: async () => {
      const botList = version.BotName === 'TRSS' ? Bot.uin : (Bot?.adapter && Bot.adapter.includes(Bot.uin)) ? Bot.adapter : [Bot.uin]
      const botInfo = []
      for (const uin of (botList as string[])) {
          
        const bot = Bot[uin]
        if (!bot) continue
        const nowDate = moment().format('MMDD')
        const keys = [
            `Yz:count:send:msg:bot:${uin}:total`,
            `Yz:count:receive:msg:bot:${uin}:total`,
            `Yz:count:send:image:bot:${uin}:total`,
            `Yz:count:screenshot:day:${nowDate}`
        ]
      
        const values = await redis.mGet(keys) || []
      
        botInfo.push({
          uin: uin,
          avatar: bot.avatar,
          nickname: bot.nickname || '未知',
          version: bot.version?.version || '未知',
          platform: bot.version?.name || '未知',
          sent: values[0] || bot.stat?.sent_msg_cnt || 0,
          recv: values[1] || bot.stat?.recv_msg_cnt || 0,
          screenshot: values[2] || values[3] || 0,
          time: utils.formatDuration(Date.now() / 1000 - bot.stat?.start_time),
          friend: bot.fl?.size || 0,
          group: bot.gl?.size || 0,
          member: Array.from(bot.gml?.values() || []).reduce((acc, curr) => acc + curr.size, 0)
        })
      }
      return {
        success: true,
        data: botInfo
      }
    }
  },
  {
    url: '/get-message-info',
    method: 'post',
    handler: async () => {
      const data: {
        sent: number[],
        recv: number[],
        time: string[]
      } = {
        sent: [],
        recv: [],
        time: []
      }
      const date = moment().subtract(1, 'days')
      for (let i = 0; i < 30; i++) {
        const time = date.format('YYYY:MM:DD')
        const keys = version.BotName === 'TRSS' ? [
          `Yz:count:send:msg:total:${time}`,
          `Yz:count:receive:msg:total:${time}`
        ] : [`Yz:count:sendMsg:day:${date.format('MMDD')}`]
        const value: Array<string | null> = await redis.mGet(keys)
        if (value.some(i => i !== null)) {
          data.sent.unshift(Number(value[0]))
          data.recv.unshift(Number(value[1]))
          data.time.unshift(time.replace(/:/g, '-'))
        }
        date.add(-1, 'days')
      }
      return {
        success: true,
        data
      }
    }
  },
  {
    url: '/get-update-log',
    method: 'post',
    handler: async ({body}) => {
      const { plugin } = body as { plugin: string }
      try {
        const arg: ExecSyncOptionsWithStringEncoding = {
          encoding: 'utf-8',
          cwd: plugin ? join(version.BotPath, 'plugins', plugin) :  undefined
        }
        const exec = (cmd: string) => execSync(cmd, arg).toString().trim()
        const log = exec('git log -100 --pretty="[%cd] %s" --date=format:"%F %T"')
        const branch = exec('git branch --show-current')
        const remote = exec(`git config branch.${branch}.remote`)
        const url = exec(`git config remote.${remote}.url`)
        return {
          success: true,
          data: {
            log: log.split('\n'),
            url: url.toString().replace(/.git$/, '')
          }
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
