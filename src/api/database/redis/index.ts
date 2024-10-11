import { RouteOptions } from 'fastify'
import { utils } from '@/common'

type treeNode = {
  label: string
  key: string
  children: treeNode[]
}

export async function getRedisKeys (sep = ':', lazy = false) {
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
    method: 'post',
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
      return {
        success: true,
        data: redisInfo
      }
    }
  },
  {
    url: '/get-redis-keys',
    method: 'post',
    handler: async ({ body }) => {
      const { sep, lazy } = body as { sep: string, lazy: boolean }
      const keys = await getRedisKeys(sep, lazy)
      return {
        success: true,
        data: keys
      }
    }
  },
  {
    url: '/get-redis-value',
    method: 'post',
    handler: async ({ body }) => {
      const { key } = body as { key: string }
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
    }
  },
  {
    url: '/set-redis-value',
    method: 'post',
    handler: async ({ body }) => {
      const { key: oldKey, value, expire, newKey } = body as { key: string, value: string, expire: number, newKey: string }
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
      const { keys } = body as { keys: string[] }
      const errorKeys = []
      const successKeys = []
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
