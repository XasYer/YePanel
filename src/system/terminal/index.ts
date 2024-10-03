import fs from 'fs'
import os from 'os'
import { join, resolve } from 'path'
import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import { getToken } from '@/login'
import { wsRoute } from '@/types/route'
import { WebSocket } from 'ws'

function executeCommand (command: string, args: string[], ws: WebSocket, workingDirectory = './') {
  const isWindows = os.platform() === 'win32'
  const shell = isWindows ? 'powershell.exe' : true
  if (isWindows) {
    // 第一次使用会清空cmd, 无法输出日志
    // exec('chcp 65001')
  }
  // 处理目录移动
  if (command === 'cd') {
    const directory = join(workingDirectory, args[0] || '')
    if (fs.existsSync(directory)) {
      ws.send(JSON.stringify({ type: 'directory', content: resolve(directory), origin: { command, args } }))
      ws.send(JSON.stringify({ type: 'close', content: '进程退出码: 0', origin: { command, args } }))
      return null
    }
  }
  const res = spawn(command, args, {
    cwd: workingDirectory,
    shell
  })
  if (res?.stdout && res?.stderr) {
    res.stdout.on('data', (data) => {
      ws.send(JSON.stringify({ type: 'output', content: data.toString(), origin: { command, args } }))
    })
    res.stderr.on('data', (data) => {
      ws.send(JSON.stringify({ type: 'error', content: data.toString(), origin: { command, args } }))
    })
    res.on('error', (error) => {
      ws.send(JSON.stringify({ type: 'error', content: `Error: ${error.message}`, origin: { command, args } }))
    })
    res.on('close', (code) => {
      ws.send(JSON.stringify({ type: 'close', content: `进程退出码: ${code}`, origin: { command, args } }))
    })
  }
  return res
}

export default {
  ws: [
    {
      url: '/terminal',
      function: (ws, req) => {
        let childProcess: ChildProcessWithoutNullStreams | null = null
        if (req.headers?.['sec-websocket-protocol']) {
          const [accessToken, uin] = req.headers['sec-websocket-protocol'].split('.')
          if (accessToken !== getToken(uin)) {
            ws.send('Authentication failed.')
            ws.close()
          } else {
            ws.send(JSON.stringify({ type: 'directory', content: process.cwd() }))
          }
        }
        ws.on('message', message => {
          let data
          try {
            data = JSON.parse(message.toString())
          } catch {
            ws.send(JSON.stringify({ type: 'error', success: false, content: 'Invalid message format' }))
            return
          }
          const { command, args, action, workingDirectory } = data
          switch (action) {
            case 'execute':
              if (childProcess) {
                childProcess.kill('SIGINT')
              }
              childProcess = executeCommand(command, args, ws, workingDirectory)
              break
              // 中断命令
            case 'terminate':
              if (childProcess) {
                childProcess.kill('SIGINT') // 发送中断信号
                childProcess = null // 清除子进程引用
                ws.send(JSON.stringify({ type: 'terminated', content: '命令已中断' }))
              }
              break
              // 心跳
            case 'ping':
              ws.send(JSON.stringify({ type: 'ping', content: 'pong' }))
              break
            default:
              break
          }
        })
        ws.on('close', () => {
          if (childProcess) {
            childProcess.kill('SIGINT')
            childProcess = null
          }
        })
        ws.on('error', () => {
          if (childProcess) {
            childProcess.kill('SIGINT')
            childProcess = null
          }
        })
      }
    }
  ]
} as { ws: wsRoute[] }
