import lodash from 'lodash'
import { config } from './lib/common/index.js'

export function supportGuoba () {
  return {
    pluginInfo: {
      name: 'YePanel',
      title: 'YePanel',
      author: '@XasYer',
      authorLink: 'https://github.com/XasYer',
      link: 'https://github.com/XasYer/YePanel',
      isV3: true,
      isV2: false,
      description: '适用于Yunzai的web管理面板',
      iconColor: 'bx:abacus'
    },
    configInfo: {
      schemas: [
        {
          component: 'Divider',
          label: '面板设置'
        },
        {
          field: 'server.port',
          label: '面板端口',
          bottomHelpMessage: '启动面板时占用的端口号,不要与其他端口重复',
          component: 'InputNumber',
          componentProps: {
            placeholder: '请输入端口号'
          }
        },
        {
          field: 'server.host',
          label: '域名',
          bottomHelpMessage: '若为auto，则自动获取当前服务器的ip',
          component: 'Input'
        },
        {
          field: 'server.splicePath',
          label: '域名拼接',
          bottomHelpMessage: '自定义域名时是否拼接 /YePanel/#/login',
          component: 'Switch'
        },
        {
          field: 'server.showPublic',
          label: '显示公共面板地址',
          bottomHelpMessage: 'yp登录 存在本地web时是否显示公共面板地址',
          component: 'Switch'
        },
        {
          field: 'server.logs',
          label: '请求日志输出',
          bottomHelpMessage: 'api请求日志输出 可选request上的参数 或 false 关闭日志输出',
          component: 'GTags'
        },
        {
          component: 'Divider',
          label: '统计设置'
        },
        {
          field: 'stats.alone',
          label: '额外单独Bot统计',
          bottomHelpMessage: '是否单独统计每个Bot的数据',
          component: 'Switch'
        },
        {
          component: 'Divider',
          label: '总计统计'
        },
        {
          field: 'stats.totalStats.sent',
          label: '发送消息次数',
          bottomHelpMessage: '总计发送消息次数',
          component: 'Switch'
        },
        {
          field: 'stats.totalStats.recv',
          label: '接收消息次数',
          bottomHelpMessage: '总计接收消息次数',
          component: 'Switch'
        },
        {
          field: 'stats.totalStats.plugin',
          label: '插件触发次数',
          bottomHelpMessage: '总计触发插件次数',
          component: 'Switch'
        },
        {
          component: 'Divider',
          label: '数量统计图表, 在一个图表中'
        },
        {
          field: 'stats.countChart.sent',
          label: '发送消息次数',
          component: 'Switch'
        },
        {
          field: 'stats.countChart.recv',
          label: '接收消息次数',
          component: 'Switch'
        },
        {
          field: 'stats.countChart.plugin',
          label: '插件触发次数',
          component: 'Switch'
        },
        {
          component: 'Divider',
          label: '排行榜统计图表, 每一项为一个图表'
        },
        {
          field: 'stats.rankChart.sentType',
          label: '发送消息类型',
          component: 'Switch'
        },
        {
          field: 'stats.rankChart.pluginUse',
          label: '插件触发次数',
          component: 'Switch'
        },
        {
          field: 'stats.rankChart.pluginSent',
          label: '插件发送消息',
          component: 'Switch'
        },
        {
          field: 'stats.rankChart.groupRecv',
          label: '群聊接收消息',
          component: 'Switch'
        },
        {
          field: 'stats.rankChart.groupSent',
          label: '群聊发送消息',
          component: 'Switch'
        },
        {
          field: 'stats.rankChart.userRecv',
          label: '用户接收消息',
          component: 'Switch'
        },
        {
          field: 'stats.rankChart.userSent',
          label: '用户发送消息',
          component: 'Switch'
        }
      ],
      getConfigData () {
        return {
          server: config.getConfig('server'),
          stats: config.getConfig('stats')
        }
      },
      setConfigData (data, { Result }) {
        const configs = {
          server: config.getConfig('server'),
          stats: config.getConfig('stats')
        }

        const updateConfig = (keyPath, value) => {
          const [rootKey, ...subKeys] = keyPath.split('.')
          const targetConfig = configs[rootKey]

          if (!targetConfig) return

          let currentConfig = targetConfig
          let isDifferent = false

          for (const key of subKeys.slice(0, -1)) {
            if (currentConfig[key] !== undefined) {
              currentConfig = currentConfig[key]
            } else {
              isDifferent = true
              break
            }
          }
          const lastKey = subKeys[subKeys.length - 1]
          if (
            isDifferent ||
            !lodash.isEqual(currentConfig[lastKey], value)
          ) {
            config.modify(rootKey, subKeys.join('.'), value)
          }
        }

        for (const [key, value] of Object.entries(data)) {
          updateConfig(key, value)
        }

        return Result.ok({}, '𝑪𝒊𝒂𝒍𝒍𝒐～(∠・ω< )⌒★')
      }

    }
  }
}
