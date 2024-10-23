import YAML from 'yaml'
import fs from 'node:fs'
import chokidar, { FSWatcher } from 'chokidar'
import * as version from './version.js'
import { FastifyRequest } from 'fastify'

class Config {
  config: {
    [key: string]: object
  } = {}

  /** 监听文件 */
  watcher: {
    [key: string]: FSWatcher
  } = { }

  constructor () {
    this.initCfg()
  }

  /** 初始化配置 */
  initCfg () {
    const path = `${version.pluginPath}/config/config/`
    if (!fs.existsSync(path)) fs.mkdirSync(path)
    const pathDef = `${version.pluginPath}/config/default_config/`
    const files = fs.readdirSync(pathDef).filter(file => file.endsWith('.yaml'))
    const ignore = ['server.password']
    for (const file of files) {
      if (!fs.existsSync(`${path}${file}`)) {
        fs.copyFileSync(`${pathDef}${file}`, `${path}${file}`)
      } else {
        const config = YAML.parse(fs.readFileSync(`${path}${file}`, 'utf8'))
        const defaultConfig = YAML.parse(fs.readFileSync(`${pathDef}${file}`, 'utf8'))
        let isChange = false
        const saveKeys: string[] = []
        const merge = (defValue: any, value: any, prefix: string = '') => {
          const defKeys = Object.keys(defValue)
          const configKeys = Object.keys(value)
          for (const key of defKeys) {
            switch (typeof defValue[key]) {
              case 'object':
                if (!Array.isArray(defValue[key]) && !ignore.includes(`${file.replace('.yaml', '')}.${key}`)) {
                  defValue[key] = merge(defValue[key], value[key], key + '.')
                  break
                }
              // eslint-disable-next-line no-fallthrough
              default:
                if (!configKeys.includes(key)) {
                  isChange = true
                } else {
                  defValue[key] = value[key]
                }
                saveKeys.push(`${prefix}${key}`)
            }
          }
          return defValue
        }
        const value = merge(defaultConfig, config)
        if (isChange) {
          fs.copyFileSync(`${pathDef}${file}`, `${path}${file}`)
          for (const key of saveKeys) {
            this.modify(file.replace('.yaml', ''), key, key.split('.').reduce((obj: any, key: string) => obj[key], value))
          }
        }
      }
      this.watch(`${path}${file}`, file.replace('.yaml', ''), 'config')
    }
  }

  /** 服务配置 */
  get server (): {
    port: number
    logs: Array<keyof FastifyRequest>
    password: {
      [key: string]: {
        password: string
        nickname: string
        avatarUrl: string
        enable: boolean
      }
    }
    } {
    return this.getDefOrConfig('server')
  }

  get stats (): {
    countChart: {
      sent: boolean
      recv: boolean
      plugin: boolean
    },
    rankChart: {
      sentType: boolean
      groupSent: boolean
      groupRecv: boolean
      userSent: boolean
      userRecv: boolean
      pluginUse: boolean
      pluginSent: boolean
    }
    } {
    return this.getDefOrConfig('stats')
  }

  /** 默认配置和用户配置 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDefOrConfig (name: string): any {
    const def = this.getdefSet(name)
    const config = this.getConfig(name)
    return { ...def, ...config }
  }

  /** 默认配置 */
  getdefSet (name: string) {
    return this.getYaml('default_config', name)
  }

  /** 用户配置 */
  getConfig (name: string) {
    return this.getYaml('config', name)
  }

  /**
   * 获取配置yaml
   * @param type 默认跑配置-defSet，用户配置-config
   * @param name 名称
   */
  getYaml (type: string, name: string) {
    const file = `${version.pluginPath}/config/${type}/${name}.yaml`
    const key = `${type}.${name}`

    if (this.config[key]) return this.config[key]

    this.config[key] = YAML.parse(
      fs.readFileSync(file, 'utf8')
    )

    this.watch(file, name, type)

    return this.config[key]
  }

  /** 监听配置文件 */
  watch (file: string, name: string, type = 'default_config') {
    const key = `${type}.${name}`
    if (this.watcher[key]) return

    const watcher = chokidar.watch(file)
    watcher.on('change', async () => {
      delete this.config[key]
      logger.mark(`[${version.pluginName}][修改配置文件][${type}][${name}]`)
    })

    this.watcher[key] = watcher
  }

  /**
   * 修改设置
   * @param name 文件名
   * @param key 修改的key值
   * @param value 修改的value值
   * @param type 配置文件或默认
   */
  modify (name: string, key: string, value: string | number, type: 'default_config' | 'config' = 'config') {
    const path = `${version.pluginPath}/config/${type}/${name}.yaml`
    new YamlReader(path).set(key, value)
    delete this.config[`${type}.${name}`]
  }
}

class YamlReader {
  filePath: string
  document: YAML.Document
  /**
   * 创建一个YamlReader实例。
   * @param filePath - 文件路径
   */
  constructor (filePath: string) {
    this.filePath = filePath
    this.document = this.parseDocument()
  }

  /**
   * 解析YAML文件并返回Document对象，保留注释。
   */
  parseDocument () {
    const fileContent = fs.readFileSync(this.filePath, 'utf8')
    return YAML.parseDocument(fileContent)
  }

  /**
   * 修改指定参数的值。
   * @param key - 参数键名
   * @param value - 新的参数值
   */
  set (key: string, value: any) {
    const keys = key.split('.')
    let current = this.document

    // 遍历嵌套键名，直到找到最后一个键
    for (const key of keys) {
      if (!current.has(key)) {
        current.set(key, new YAML.YAMLMap())
      }
      current = current.get(key) as YAML.Document
    }

    // 设置最后一个键的值
    current.set(keys[keys.length - 1], value)
    this.write()
  }

  /**
   * 从YAML文件中删除指定参数。
   * @param key - 要删除的参数键名
   */
  rm (key: string) {
    const keys = key.split('.')
    let current = this.document

    // 遍历嵌套键名，直到找到最后一个键
    for (const key of keys) {
      if (current.has(key)) {
        current = current.get(key) as YAML.Document
      } else {
        return // 如果键不存在，直接返回
      }
    }

    // 删除最后一个键
    current.delete(keys[keys.length - 1])
    this.write()
  }

  /**
   * 将更新后的Document对象写入YAML文件中。
   */
  write () {
    fs.writeFileSync(this.filePath, this.document.toString(), 'utf8')
  }
}

export default new Config()
