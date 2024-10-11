import fs from 'fs';
import os from 'os';
import { join, resolve } from 'path';
import { spawn } from 'child_process';
import iconv from 'iconv-lite';
function executeCommand(command, args, ws, workingDirectory = './') {
    const isWindows = os.platform() === 'win32';
    const shell = isWindows ? 'powershell.exe' : true;
    if (isWindows) {
        // 第一次使用会清空cmd, 无法输出日志
        // exec('chcp 65001')
    }
    // 处理目录移动
    if (command === 'cd') {
        const directory = join(workingDirectory, args[0] || '');
        if (fs.existsSync(directory)) {
            ws.send(JSON.stringify({ type: 'directory', content: resolve(directory), origin: { command, args } }));
            ws.send(JSON.stringify({ type: 'close', content: '进程退出码: 0', origin: { command, args } }));
            return null;
        }
    }
    const res = spawn(command, args, {
        cwd: workingDirectory,
        shell
    });
    if (res?.stdout && res?.stderr) {
        res.stdout.on('data', (data) => {
            ws.send(JSON.stringify({ type: 'output', content: iconv.decode(data, 'gbk'), origin: { command, args } }));
        });
        res.stderr.on('data', (data) => {
            ws.send(JSON.stringify({ type: 'error', content: iconv.decode(data, 'gbk'), origin: { command, args } }));
        });
        res.on('error', (error) => {
            ws.send(JSON.stringify({ type: 'error', content: `Error: ${error.message}`, origin: { command, args } }));
        });
        res.on('close', (code) => {
            ws.send(JSON.stringify({ type: 'close', content: `进程退出码: ${code}`, origin: { command, args } }));
        });
    }
    return res;
}
export default [
    {
        url: '/terminal',
        method: 'get',
        handler: () => 'Ciallo～(∠・ω< )⌒☆',
        wsHandler: (connection) => {
            let childProcess = null;
            connection.send(JSON.stringify({ type: 'directory', content: process.cwd() }));
            // 第一次的ls有异常, 不知道别的会不会
            executeCommand('ls', [], { send: () => { } });
            connection.on('message', message => {
                let data;
                try {
                    data = JSON.parse(message.toString());
                }
                catch {
                    connection.send(JSON.stringify({ type: 'error', success: false, content: 'Invalid message format' }));
                    return;
                }
                const { command, args, action, workingDirectory } = data;
                switch (action) {
                    case 'execute':
                        if (childProcess) {
                            childProcess.kill('SIGINT');
                        }
                        childProcess = executeCommand(command, args, connection, workingDirectory);
                        break;
                    // 中断命令
                    case 'terminate':
                        if (childProcess) {
                            childProcess.kill('SIGINT'); // 发送中断信号
                            childProcess = null; // 清除子进程引用
                            connection.send(JSON.stringify({ type: 'terminated', content: '命令已中断' }));
                        }
                        break;
                    // 心跳
                    case 'ping':
                        connection.send(JSON.stringify({ type: 'ping', content: 'pong' }));
                        break;
                    default:
                        break;
                }
            });
            connection.on('close', () => {
                if (childProcess) {
                    childProcess.kill('SIGINT');
                    childProcess = null;
                }
            });
            connection.on('error', () => {
                if (childProcess) {
                    childProcess.kill('SIGINT');
                    childProcess = null;
                }
            });
        }
    }
];
