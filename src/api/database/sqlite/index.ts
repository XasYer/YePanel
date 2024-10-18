/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs'
import { join } from 'path'
import { Sequelize } from 'sequelize'
import { RouteOptions } from 'fastify'

type tableInfo = {
  pk: 0 | 1,
  notnull: 0 | 1 | null,
  dflt_value: string | null,
  type: string,
  name: string,
  autoincrement: boolean,
}

const sequelizeCache: { [key: string]: { 
  timer: NodeJS.Timeout, 
  instance: Sequelize, 
  total: {
    [key: string]: number
  }, 
  tableInfo: {
    [key: string]: tableInfo
  }
} } = {}

function findSqlitePath (directory: string): string[] {
  const dbPath = []
  const items = fs.readdirSync(directory)

  for (const item of items) {
    if (['node_modules', '.git', '.vscode'].includes(item)) {
      continue
    }
    const fullPath = join(directory, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      dbPath.push(...findSqlitePath(fullPath))
    } else if (stat.isFile() && item.endsWith('.db')) {
      if (/SQLite format 3/.test(fs.readFileSync(fullPath).subarray(0, 16).toString())) {
        dbPath.push(fullPath.replace(/\\/g, '/'))
      }
    }
  }
  return dbPath
}

function getSequelize (path: string)  {
  if (!sequelizeCache[path]) {
    sequelizeCache[path] = {
      timer: setTimeout(() => {
        delete sequelizeCache[path]
      }, 1000 * 60 * 10),
      instance: new Sequelize({
        dialect: 'sqlite',
        storage: path
      }),
      total: {},
      tableInfo: {}
    }
  }
  clearTimeout(sequelizeCache[path].timer)
  sequelizeCache[path].timer = setTimeout(() => {
    delete sequelizeCache[path]
  }, 1000 * 60 * 10)
  return sequelizeCache[path]
}

function getFormattedDate () {
  const now = new Date()
  const datePart = now.toISOString().slice(0, 23)
  const timeZoneOffset = now.getTimezoneOffset()
  const offsetHours = String(Math.abs(Math.floor(timeZoneOffset / 60))).padStart(2, '0')
  const offsetMinutes = String(Math.abs(timeZoneOffset % 60)).padStart(2, '0')
  const sign = timeZoneOffset > 0 ? '-' : '+'

  return `${datePart.replace('T', ' ')} ${sign}${offsetHours}:${offsetMinutes}`
}

export default [
  {
    url: '/get-sqlite-path',
    method: 'post',
    handler: () => {
      return {
        success: true,
        data: findSqlitePath('./')
      }
    }
  },
  {
    url: '/get-sqlite-table',
    method: 'post',
    handler: async ({ body }) => {
      const { path } = body as { path: string }
      const sequelize = getSequelize(path).instance
      const [results] = await sequelize.query('SELECT name FROM sqlite_master WHERE type=\'table\';') as [{ name: string }[], unknown]
      return {
        success: true,
        data: results.map(item => (item.name)).filter(item => item !== 'sqlite_sequence')
      }
    }
  },
  {
    url: '/get-sqlite-table-data',
    method: 'post',
    handler: async ({ body }) => {
      const { path, table, pageSize, pageNum, search } = body as { path: string, table: string, pageSize: number, pageNum: number, search: string }
      const offset = (pageNum * pageSize) - pageSize
      const { instance: sequelize, total, tableInfo } = getSequelize(path)
      if (!total[table]) {
        const [totalResults] = await sequelize.query(`SELECT COUNT(*) AS total FROM ${table};`) as [{ total: number }[], unknown]
        total[table] = totalResults[0].total
      }
      let count = total[table]
      if (!tableInfo[table]) {
        const [tableInfoResults] = await sequelize.query(`PRAGMA table_info(${table});`) as [tableInfo[], unknown]
        const info: any = {}
        for (const item of tableInfoResults) {
          if (item.pk) {
              const [results] = await sequelize.query(`SELECT sql FROM sqlite_master WHERE type = 'table' AND name = '${table}';`) as [{ sql: string }[], unknown]
              item.autoincrement = /AUTOINCREMENT/.test(results[0].sql)
          }
          info[item.name] = item
        }
        tableInfo[table] = info
      }
      const sql = `SELECT * FROM ${table} ${search ? `WHERE ${search}` : ''} LIMIT ${pageSize} OFFSET ${offset};`
      const [results] = await sequelize.query(sql) as [{ [key: string]: any }[], unknown]
      if (search) {
        const [searchResults] = await sequelize.query(`SELECT COUNT(*) AS total FROM ${table} WHERE ${search};`) as [{ total: number }[], unknown]
        count = searchResults[0].total
      }
      return {
        success: true,
        data: results,
        total: count,
        tableInfo: tableInfo[table]
      }
    }
  },
  {
    url: '/set-sqlite-table-data',
    method: 'post',
    handler: async ({ body }) => {
      const { path, table, data } = body as { path: string, table: string, data: { [key: string]: string | number | boolean } }
      const { instance: sequelize, tableInfo, total } = getSequelize(path)
      const type = data.createdAt ? 'update' : 'insert'
      delete data.createdAt
      delete data.updatedAt
      const keys = Object.keys(data)
      const values = Object.values(data)
      const updatedAt = getFormattedDate()
      const pk = keys.find(key=> (tableInfo[table] as any)[key].pk) || 'createdAt'
      // 如果有创建时间就是修改
      const sql =  type === 'update' ? 
        `UPDATE ${table} SET ${keys.map((key) => `${key} = ?`).join(', ')}, updatedAt = ? WHERE ${pk} = ?` :
        `INSERT INTO ${table} (${keys.join(', ')}, createdAt, updatedAt) VALUES (${keys.map(() => '?').join(', ')}, ?, ?)`
      try {
        const [results, metadata] = await sequelize.query(
          sql,
          {
            replacements: type === 'update' ? [...values, updatedAt, data[pk] ] : [...values, updatedAt, updatedAt]
          }
        )
        const [totalResults] = await sequelize.query(`SELECT COUNT(*) AS total FROM ${table};`) as [{ total: number }[], unknown]
        total[table] = totalResults[0].total
        return {
          success: true,
          results,
          metadata
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
    url: '/delete-sqlite-table-data',
    method: 'post',
    handler: async ({ body }) => {
      const { path, table, data } = body as { path: string, table: string, data: { [key: string]: string | number | boolean } }
      const { instance: sequelize, tableInfo, total } = getSequelize(path)
      const keys = Object.keys(data)
      const pk = keys.find(key=> (tableInfo[table] as any)[key].pk) || 'createdAt'
      try {
        const [results, metadata] = await sequelize.query(
          `DELETE FROM ${table} WHERE ${pk} = ?`,
          {
            replacements: [data[pk]]
          }
        )
        const [totalResults] = await sequelize.query(`SELECT COUNT(*) AS total FROM ${table};`) as [{ total: number }[], unknown]
        total[table] = totalResults[0].total
        return {
          success: true,
          results,
          metadata
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