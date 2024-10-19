import Fastify, { FastifyReply, FastifyRequest, RouteOptions } from 'fastify'
import fastifyAuth from '@fastify/auth'
import fastifyCors from '@fastify/cors'
import fastifyWebSocket from '@fastify/websocket'
import fastifyStatic from '@fastify/static'
import fastifyMultipart from '@fastify/multipart'
import fs from 'fs'
import os from 'os'
// @ts-ignore
import chalk from 'chalk'
import { join } from 'path'
import { version, config } from '@/common'
import { tokenAuth } from '@/api/login'

export async function startServer () {
  const start = Date.now()
  const fastify = Fastify()

  await fastify.register(fastifyCors, {
    origin: ['*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
  })
  await fastify.register(fastifyAuth)
  await fastify.register(fastifyWebSocket)
  await fastify.register(fastifyMultipart)

  const webPath =  join(version.BotPath, 'plugins', 'YePanel-Web')
  if (fs.existsSync(webPath)) {
    await fastify.register(fastifyStatic, {
      root: webPath,
      prefix: '/YePanel/'
    })
  }

  fastify.addHook('onResponse', (request, reply, done) => {
    const keys = config.server.logs
    if (keys) {
      const logs = ['[YePanel Server]']
      for (const i of keys) {
        const value = i.split('.').reduce((prev, curr) => prev && (prev as any)?.[curr], request)
        if (value) {
          logs.push(`${i}:`, objectToString(value))
        }
      }
      logger.mark(chalk.rgb(255, 105, 180)(...logs))
      logger.mark(chalk.rgb(255, 105, 180)('-'.repeat(30)))
    }
    done()
  })
  
  function verifyToken(request: FastifyRequest, reply: FastifyReply, done: (error?: Error | undefined) => void) {
    const token = request.headers['authorization'] || request.headers['sec-websocket-protocol'] || (request.query as {accessToken?: string})?.accessToken || ''
  
    if (tokenAuth(token.replace('Bearer ', ''))) {
      done()
    } else {
      done(new Error('Unauthorized'))
    }
  }
  
  async function loadRoutes (directory: string) {
    const items = fs.readdirSync(directory)
  
    for (const item of items) {
      const fullPath = join(directory, item)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        await loadRoutes(fullPath)
      } else if (stat.isFile() && item === `index.${(version.isDev ? 'ts' : 'js')}`) {
        try {
          const route = ((await import(`file://${fullPath}`)).default as RouteOptions[])
          for (const i of route) {
            if (!i.preHandler) {
              i.preHandler = fastify.auth([verifyToken])
            } else {
              delete i.preHandler
            }
            fastify.route(i)
          }
        } catch { /* empty */ }
      }
    }
  }
  
  const srcPath = version.isDev ? 'src' : 'lib'
  
  await loadRoutes(join(version.pluginPath, srcPath, 'api'))

  // 加载插件的路由
  const pluginList = fs.readdirSync(`${version.BotPath}/plugins`)
  for (const plugin of pluginList) {
    const pluginPath = join(version.BotPath, 'plugins', plugin)
    const YePanelPath = join(pluginPath, 'YePanel')
    if (fs.statSync(pluginPath).isDirectory() && fs.existsSync(YePanelPath)) {
      try {
        const option = (await import(`file://${join(YePanelPath, 'index.js')}?t=${Date.now()}`)).default
        if (option.api?.length) {
          for (const i of option.api) {
            i.url = `/${plugin}${i.url}`
            if (!i.preHandler) {
              i.preHandler = fastify.auth([verifyToken])
            } else {
              delete i.preHandler
            }
            fastify.route(i)
          }
        }
      } catch { /* empty */ }
    }
  }
  
  fastify.listen({port: config.server.port, host: '::'}, (err) => {
    if (err) {
      logger.error(`YePanel Error starting server: ${err}`)
    } else {
      getIps().then(res => {
        const end = Date.now()
        const logs = [
          '-'.repeat(30),
          `YePanel v${version.pluginVersion} Server running successfully on ${end - start}ms`,
          '内网地址:',
          ...res.local.map(i => `  - http://${i}:${config.server.port}`), 
          ...res.remote ? [
            '外网地址:',
            `  - http://${res.remote}:${config.server.port}`
          ] : [],
          '-'.repeat(30)
        ]
        logs.forEach(i => {
          logger.info(chalk.rgb(255, 105, 180)(i))
        })
      })
    }
  })
}

async function getIps () {
  const networkInterfaces = os.networkInterfaces()
  const local = Object.values(networkInterfaces).flat().filter(i => i?.family === 'IPv4' && !i.internal).map(i => i?.address).filter(Boolean) as string[]
  const url = [
    {
      api: 'https://v4.ip.zxinc.org/info.php?type=json',
      key: 'data.myip'
    }, 
    {
      api: 'https://ipinfo.io/json',
      key: 'ip'
    }
  ]
  const redisKey = 'YePanel-public-ip'
  const remote = await redis.get(redisKey) as string | null
  if (remote) {
    return {
      local,
      remote
    }
  }
  for (const i of url) {
    try {
      const info = await fetch(i.api).then(res => res.json()).then(res => {
        const remote = i.key.split('.').reduce((prev, curr) => prev && prev[curr], res) as string
        if (remote) {
          redis.set(redisKey, remote, { EX: 60 * 60 * 24 * 3})
          return {
            local,
            remote
          }
        } else {
          return {
            local,
            remote: ''
          }
        }
      })
      if (info.remote) {
        return info
      }
    } catch { /* empty */ }
  }
  return {
    local,
    remote: '',
  }
}

const objectToString = (obj: any): string => {
  if (Array.isArray(obj)) {
    return '[ ' + obj.map(objectToString).join(' ') + ' ]'
  }
  if (typeof obj === 'object') {
    try {
      return `{ ${Object.entries(obj)
        .map(([key, value]) => {
          const formattedValue =
            typeof value === 'string' ? `'${value}'` : value
          return `${key}: ${formattedValue}`
        })
        .join(', ')} }`
    } catch  {
      return String(obj)
    }
  }
  return obj
}