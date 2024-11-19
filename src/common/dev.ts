import { version } from '@/common'

if (version.isDev) {
  global.plugin = class {}
  global.redis = {
    // @ts-ignore
    get: () => {},
    // @ts-ignore
    set: () => {},
    // @ts-ignore
    mGet: () => ([]),
  }
  // @ts-ignore
  global.logger = new Proxy({}, {
    get (target, p) {
      return (...args: any[]) => console.log(p, ...args)
    }
  })
  // @ts-ignore
  global.Bot = {
    uin: [],
    on: () => {},
  }
}
