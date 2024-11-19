import fs from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname, basename } from 'path';
/** 是否是dev环境 */
const isDev = process.env.npm_lifecycle_event === 'dev';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/** 插件的路径 */
const pluginPath = join(__dirname, '../..').replace(/\\/g, '/');
/** 自己的package.json */
const pluginPackage = JSON.parse(fs.readFileSync(join(pluginPath, 'package.json'), 'utf8'));
const pluginName = basename(pluginPath);
const pluginVersion = pluginPackage.version;
/** 运行环境的路径, 如果是dev环境, 则是自身的路径 */
const BotPath = isDev ? pluginPath : join(pluginPath, '../..');
/** Bot的package.json */
const BotPackageJson = JSON.parse(fs.readFileSync(join(BotPath, 'package.json'), 'utf8'));
const BotVersion = BotPackageJson.version;
const BotName = (() => {
    if (Array.isArray(global.Bot?.uin)) {
        return 'TRSS';
    }
    else {
        return 'Miao';
    }
})();
export { pluginVersion, pluginName, pluginPath, BotVersion, BotPath, BotName, isDev };
