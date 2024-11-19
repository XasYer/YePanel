import { createLoginKey } from './api/login/index.js';
import { config, server } from './common/index.js';
import { execSync } from 'child_process';
import fs from 'fs';
import './common/dev.js';
server.startServer();
let run = false;
export class YePanel extends plugin {
    constructor() {
        super({
            name: 'YePanel',
            dsc: 'YePanel',
            event: 'message',
            priority: 1,
            rule: [
                {
                    reg: /^#?(小叶|YePanel|YP)(面板)?(登[录入陆]|login|signin|dl)$/i,
                    fnc: 'login'
                },
                {
                    reg: /^#?(小叶|YePanel|YP)(面板)?(gitee)?安装web$/i,
                    fnc: 'installWeb'
                }
            ]
        });
    }
    async login(e) {
        if (!e.isMaster || e.group_id)
            return e.reply('Ciallo～(∠・ω< )⌒☆');
        const message = ['Ciallo～(∠・ω< )⌒☆'];
        const key = createLoginKey(e.self_id);
        const suffix = `YePanel/#/login?key=${key}`;
        const { local, remote, custom } = await server.getIps();
        if (server.hasWeb) {
            if (custom) {
                message.push(`自定义地址: \n${custom.replace(/\/$/, '')}${config.server.splicePath ? '/' + suffix : '?key=' + key}`);
            }
            message.push(`内网网址: \n${local.map(i => `http://${i}:${config.server.port}/${suffix}`).join('\n')}`);
            if (remote) {
                message.push(`外网网址: \nhttp://${remote}:${config.server.port}/${suffix}`);
            }
            message.push('-'.repeat(20));
        }
        if (!server.hasWeb || config.server.showPublic) {
            if (custom) {
                message.push(`公共地址(自定义): \nhttp://gh.xasyer.icu/${suffix}&api=${custom}`);
            }
            message.push(`公共地址(内网): \n${local.map(i => `http://gh.xasyer.icu/${suffix}&api=${i}:${config.server.port}`).join('\n')}`);
            if (remote) {
                message.push(`公共地址(外网): \nhttp://gh.xasyer.icu/${suffix}&api=${remote}:${config.server.port}`);
            }
            if (message.length <= 3) {
                message.push('如公共地址出现异常情况, 可以发送 #小叶面板安装web 将web服务克隆到本地运行');
            }
        }
        message.push('请在浏览器中打开以上网址登录面板, 五分钟之内有效');
        message.push('祝你使用愉快！');
        const fordmsg = e.friend.makeForwardMsg(message.map(i => ({ message: i })));
        return e.reply(fordmsg);
    }
    async installWeb(e) {
        if (!e.isMaster)
            return e.reply('Ciallo～(∠・ω< )⌒☆');
        if (server.hasWeb) {
            e.reply('已安装web服务, 无需重复安装');
            return;
        }
        if (run) {
            return e.reply('web服务正在安装中, 请稍等...');
        }
        run = true;
        e.reply('开始安装web服务, 请稍等...');
        const isProxy = ['gitee'].some(i => e.msg.includes(i));
        const cmd = `git clone --depth=1 -b gh-pages ${isProxy ? 'https://gitee.com/xiaoye12123/YePanel.git' : 'https://github.com/XasYer/YePanel.git'} ./plugins/YePanel-Web/`;
        try {
            execSync(cmd);
        }
        catch (error) {
            e.reply(`安装web服务失败: ${error.message}, 请检查网络或${isProxy ? '手动克隆仓库到plugins目录下' : '发送#小叶面板gitee安装web 使用gitee仓库进行安装'}, 安装命令: \n${cmd}`);
            run = false;
            return;
        }
        if (fs.existsSync(server.webPath)) {
            e.reply('Ciallo～(∠・ω< )⌒☆\n安装web服务成功, 请重启机器人后生效');
        }
        else {
            e.reply('安装web服务失败...');
        }
        run = false;
        return true;
    }
}
