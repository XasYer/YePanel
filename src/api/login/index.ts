import { randomUUID } from 'crypto'
import { httpRoute } from '@/types/route'
import { config, version } from '@/common'
import fs from 'fs'
import { join } from 'path'

const token: { [uin: string]: string } = {}

export const getToken = (uin: string) => token[uin]

export const tokenAuth = (accesstoken: string) => {
  if (!accesstoken) return false
  const [accessToken, ...args] = accesstoken.split('.')
  const uin = args?.join('.')
  if (!getToken(uin) || accessToken !== getToken(uin)) {
    return false
  }
  return true
}

export default {
  http: [
    {
      url: '/login',
      method: 'post',
      response: ({ body }: { body: { username: string; password: string } }) => {
        const { username: uin, password: inputPassword } = body
        const account = (()=>{
          const account = config.server.password
          if (account[uin]?.enable) {
            return account[uin]
          } else if (Bot[uin]) {
            const bot = Bot[uin]
            return {
              password: account['default'].password,
              nickname: account['default'].nickname || bot.nickname,
              avatar: account['default'].avatar || bot.avatar
            }
          } else {
            return {}
          }
        })()
        if (account.password != inputPassword) {
          return {
            message: '账号或密码错误'
          }
        }
        token[uin] = randomUUID()
        return {
          success: true,
          data: {
            avatar: account.avatar,
            username: 'admin',
            nickname: account.nickname,
            roles: ['admin'],
            accessToken: token[uin] + '.' + uin,
            refreshToken: token[uin] + ':refreshToken.' + uin,
            expires: '2030/10/30 00:00:00'
          }
        }
      }
    },
    {
      url: '/get-async-routes',
      method: 'get',
      response: async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = {
          router: [],
          code: {}
        }
        const pluginList = fs.readdirSync(`${version.BotPath}/plugins`)
        for (const plugin of pluginList) {
          const pluginPath = join(version.BotPath, 'plugins', plugin)
          const YePanelPath = join(pluginPath, 'YePanel')
          if (fs.statSync(pluginPath).isDirectory() && fs.existsSync(YePanelPath)) {
            try {
              const option = (await import(`file://${join(YePanelPath, 'index.js')}?t=${Date.now()}`)).default
              const router = option.router
              router.path = `/${plugin}`
              router.name = plugin
              for (const i of router.children) {
                i.path = `/${plugin}${i.path}`
                i.component = 'plugins/index'
              }
              data.router.push(router)
              data.code[plugin] = { main: {}, components: {} }
              fs.readdirSync(YePanelPath).forEach(file => {
                if (file.endsWith('.vue')) {
                  data.code[plugin].main[file.replace('.vue', '')] = fs.readFileSync(join(YePanelPath, file), 'utf-8')
                }
              })
              const componentPath = join(YePanelPath, 'components')
              if (fs.existsSync(componentPath) && fs.statSync(componentPath).isDirectory()) {
                fs.readdirSync(componentPath).forEach(file => {
                  data.code[plugin].components[file.replace('.vue', '')] = fs.readFileSync(join(componentPath, file), 'utf-8')
                })
              }
            } catch (error) { /* empty */
              console.log('error', error)
            }
          }
        }
        return {
          success: true,
          data
        }
      }
    }
  ]
} as { http: httpRoute[] }
