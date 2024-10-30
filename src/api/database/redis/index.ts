import { RouteOptions } from 'fastify'
import { utils } from '@/common'
import { createClient } from 'redis'
// @ts-ignore
import cfg from '../../../../../../lib/config/config.js'

type treeNode = {
  label: string
  key: string
  children: treeNode[]
}

const clients: {[key: string]: { client: ReturnType<typeof createClient>, timer: NodeJS.Timeout}} = {}

const getRedissClient = async (db: string) => {
  if (clients[db]) {
    return clients[db].client
  }
  const client = await createClient({
    socket: {
      host: cfg.redis.host,
      port: cfg.redis.port
    },
    database: Number(db)
  }).connect()
  clients[db] = {
    client,
    timer: setTimeout(() => {
      client.disconnect()
      delete clients[db]
    }, 1000 * 60 * 30) // 缓存30分钟
  }
  return client
}

export async function getRedisKeys (sep = ':', db: string, lazy = false) {
  const redis = await getRedissClient(db)
  function addKeyToTree (tree: treeNode[], parts: string[], fullKey: string) {
    if (parts.length === 0) return

    const [firstPart, ...restParts] = parts
    let node = tree.find((item) => item.label === firstPart)

    const currentKey = fullKey ? `${fullKey}:${firstPart}` : firstPart

    if (!node) {
      node = {
        label: firstPart,
        key: currentKey,
        children: []
      }
      tree.push(node)
    }

    addKeyToTree(node.children, restParts, currentKey)
  }
  const keysTree: treeNode[] = []
  let cursor = 0
  do {
    const MATCH = !lazy ? '*' : sep ? `${sep}:*` : '*'
    const res = await redis.scan(cursor, { MATCH, COUNT: 10000 })
    cursor = res.cursor
    const keys = res.keys

    keys.forEach((key: string) => {
      if (lazy) {
        if (sep) {
          if (key.startsWith(sep + ':')) {
            const remaining = key.substring(sep.length + 1)
            const nextPart = remaining.split(':')[0]
            if (nextPart && !keysTree.some(i => i.label === nextPart)) {
              keysTree.push({
                label: nextPart,
                key: `${sep}:${nextPart}`,
                children: []
              })
            }
          }
        } else {
          if (key.includes(':')) {
            const firstPart = key.split(':')[0]
            if (!keysTree.some(i => i.label === firstPart)) {
              keysTree.push({
                label: firstPart,
                key: firstPart,
                children: []
              })
            }
          } else if (!keysTree.some(i => i.label === key)) {
            keysTree.push({
              label: key,
              key,
              children: []
            })
          }
        }
      } else {
        const parts = key.split(sep)
        addKeyToTree(keysTree, parts, '')
      }
    })
  } while (cursor != 0)

  return keysTree
}

export default [
  {
    url: '/get-redis-info',
    method: 'get',
    handler: async () => {
      const data = await redis.info()
      const redisInfo: { [key: string]: string } = {}
      data.split('\n').forEach((line: string) => {
        if (line && !line.startsWith('#') && line.includes(':')) {
          const index = line.indexOf(':')
          const key = line.substring(0, index)
          const value = line.substring(index + 1)
          redisInfo[key.trim()] = value.trim()
        }
      })
      redisInfo.uptime_formatted = utils.formatDuration(Number(redisInfo.uptime_in_seconds))
      redisInfo.slelct_database = cfg.redis.db
      const [, databases] = await redis.sendCommand(['CONFIG', 'GET', 'databases']) as [string, string]
      redisInfo.databases = databases
      return {
        success: true,
        data: redisInfo
      }
    }
  },
  {
    url: '/get-redis-keys',
    method: 'get',
    handler: async ({ query }) => {
      const { sep, db, lazy } = query as { sep: string, db: string, lazy: boolean }
      const keys = await getRedisKeys(sep, db, lazy)
      return {
        success: true,
        data: keys
      }
    }
  },
  {
    url: '/get-redis-value',
    method: 'get',
    handler: async ({ query }) => {
      const { key, db } = query as { key: string, db: string }
      const redis = await getRedissClient(db)
      try {
        const value = await redis.get(key)
        const expire = await redis.ttl(key)
        return {
          success: true,
          data: {
            key,
            value,
            expire
          }
        }
      } catch {
        const type = await redis.type(key)
        return {
          success: false,
          message: `暂未支持${type}类型,目前仅支持查看和修改string类型`
        }
      }
    }
  },
  {
    url: '/set-redis-value',
    method: 'post',
    handler: async ({ body }) => {
      const { key: oldKey, value, db, expire, newKey } = body as { key: string, value: string, db: string, expire: number, newKey: string }
      const redis = await getRedissClient(db)
      const key = newKey || oldKey
      if (newKey) {
        await redis.rename(oldKey, newKey)
      }
      if (expire === -2) {
        await redis.sendCommand(['GETSET', key, value])
      } else if (expire === -1) {
        await redis.set(key, value)
      } else {
        await redis.set(key, value, { EX: expire })
      }
      return {
        success: true,
        data: {
          key,
          value
        }
      }
    }
  },
  {
    url: '/delete-redis-keys',
    method: 'post',
    handler: async ({ body }) => {
      const { keys, db } = body as { keys: string[], db: string }
      const errorKeys = []
      const successKeys = []
      const redis = await getRedissClient(db)
      for (const key of keys) {
        try {
          await redis.del(key)
          successKeys.push(key)
        } catch {
          errorKeys.push(key)
        }
      }
      return {
        success: true,
        data: {
          errorKeys,
          successKeys
        }
      }
    }
  }
] as RouteOptions[]
