import { getPlugins } from '../../../api/welcome/index.js';
import { exec } from 'child_process';
import { existsSync, rmSync } from 'fs';
// From Guoba-Plugin
function parseReadmeLink(text, baseUrl) {
    const linkReg = /\[.*]\((.*)\)/g;
    const imgReg = /<img.*src="([^"]*)".*>/g;
    const checkUrl = (url) => {
        // 因为gitee的防盗链机制，所以只有gitee的链接才需要替换
        if (/gitee\.com/i.test(url)) {
            return /\.(png|jpeg|jpg|gif|bmp|svg|ico|icon|webp|webm|mp4)$/i.test(url);
        }
        return false;
    };
    const fn = ($0, $1) => {
        let url = '';
        if (checkUrl($1)) {
            url = `YePanel/api/transit?url=${encodeURIComponent($1)}`;
            return $0.replace($1, url);
        }
        if (/^https?/i.test($1)) {
            return $0;
        }
        url = `${baseUrl}/${$1.replace(/^\//, '')}`;
        if (checkUrl(url)) {
            url = `YePanel/api/transit?url=${encodeURIComponent(url)}`;
        }
        return $0.replace($1, url);
    };
    text = text.replace(linkReg, fn);
    return text.replace(imgReg, fn);
}
const output = {};
const executeCommand = (command) => {
    return new Promise((resolve, reject) => {
        output[command] = { running: true, error: null, stdout: '', stderr: '' };
        let timeout = false;
        const timer = setTimeout(() => {
            timeout = true;
            reject(new Error('还在异步执行中，可再次点击安装查看结果'));
        }, 1000 * 9);
        exec(command, (error, stdout, stderr) => {
            clearTimeout(timer);
            if (timeout) {
                output[command] = { running: false, error, stdout, stderr };
                return;
            }
            if (error) {
                reject(error);
            }
            else {
                resolve(stdout);
            }
        });
    });
};
const installPackage = (name) => {
    if (existsSync(`plugins/${name}/package.json`)) {
        exec(`cd plugins/${name} && pnpm install`);
    }
};
export default [
    {
        url: '/get-plugin-index-list',
        method: 'GET',
        handler: async () => {
            const pluginList = {
                main: [],
                function: [],
                game: [],
                wordgame: [],
                install: []
            };
            const fileName = [
                {
                    name: 'README.md',
                    id: 'main'
                }, {
                    name: 'Function-Plugin.md',
                    id: 'function'
                }, {
                    name: 'Game-Plugin.md',
                    id: 'game'
                }, {
                    name: 'WordGame-Plugin.md',
                    id: 'wordgame'
                }
            ];
            const reg = /\[(.+?)\]\((.+?)\)/;
            for (const i of fileName) {
                const res = await fetch(`https://gitee.com/yhArcadia/Yunzai-Bot-plugins-index/raw/main/${i.name}`)
                    .then(res => res.text());
                const lines = res.split('\n');
                for (const line of lines) {
                    if (/^\|(.*)\|$/.test(line) && !line.includes('☞') && line.includes('http')) {
                        const [nameText, authorText, desc] = line.split('|').filter(Boolean);
                        if (!nameText || !authorText || !desc)
                            continue;
                        const [, name, link] = reg.exec?.(nameText) || [];
                        if (!name || !link)
                            continue;
                        const authorList = authorText.match(new RegExp(reg, 'g')) || [];
                        if (!authorList.length)
                            continue;
                        const authors = authorList.map(i => {
                            const [, name, link] = reg.exec(i) || [];
                            return {
                                name,
                                link
                            };
                        }).filter(i => i.name && i.link);
                        if (!authors.length)
                            continue;
                        const [, title, pluginName] = /^(.*)\s*[(（]([^()]*)[）)]$/.exec(name) || [];
                        pluginList[i.id].push({
                            title: title || name,
                            name: pluginName || name,
                            link,
                            authors,
                            desc: desc.trim()
                        });
                    }
                }
            }
            pluginList.install = getPlugins(true).plugins.filter(i => i.hasGit).map(i => i.name);
            return {
                success: true,
                data: pluginList
            };
        }
    },
    {
        url: '/get-plugin-readme',
        method: 'GET',
        handler: async ({ query }) => {
            const { link: pluginLink } = query;
            const branchs = ['main', 'master'];
            const [owner, repo] = pluginLink.split('/').slice(-2);
            const link = pluginLink.includes('github') ? `https://cdn.jsdelivr.net/gh/${owner}/${repo}@` : `https://gitee.com/${owner}/${repo}/raw/`;
            for (const branch of branchs) {
                const baseUrl = `${link}${branch}`;
                const url = `${baseUrl}/README.md`;
                try {
                    const res = await fetch(url);
                    if (res.status === 200) {
                        const text = await res.text();
                        return {
                            success: true,
                            data: parseReadmeLink(text, baseUrl)
                        };
                    }
                }
                catch { }
            }
            return {
                success: false,
                message: 'main分支或master分支上不存在README.md文件'
            };
        }
    },
    {
        url: '/install-plugin',
        method: 'POST',
        handler: async ({ body }) => {
            const { link, name, branch } = body;
            const pluginName = name || link.split('/').pop()?.replace(/\.git$/, '');
            const path = `plugins/${pluginName}`;
            const cmd = `git clone --depth=1 --single-branch ${branch ? `-b ${branch}` : ''} ${link} "${path}"`;
            if (output[cmd]) {
                for (let i = 0; i < 9; i++) {
                    const sync = output[cmd];
                    if (!sync.running) {
                        delete output[cmd];
                        if (sync.error) {
                            return {
                                success: false,
                                message: sync.error.message
                            };
                        }
                        else {
                            installPackage(pluginName);
                            return {
                                success: true,
                                data: sync.stdout
                            };
                        }
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                return {
                    success: false,
                    message: '还在异步执行中，可再次点击安装查看结果'
                };
            }
            if (existsSync(path)) {
                return {
                    success: true
                };
            }
            try {
                const result = await executeCommand(cmd);
                installPackage(pluginName);
                return {
                    success: true,
                    data: result
                };
            }
            catch (error) {
                return {
                    success: false,
                    message: error.message
                };
            }
        }
    },
    {
        url: '/uninstall-plugin',
        method: 'POST',
        handler: async ({ body }) => {
            const { name } = body;
            try {
                rmSync(`plugins/${name}`, { recursive: true, force: true });
                return {
                    success: true
                };
            }
            catch (error) {
                return {
                    success: false,
                    message: error.message
                };
            }
        }
    }
];
