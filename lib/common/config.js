import YAML from 'yaml';
import fs from 'node:fs';
import chokidar from 'chokidar';
import * as version from './version.js';
class Config {
    config = {};
    /** 监听文件 */
    watcher = {};
    constructor() {
        this.initCfg();
    }
    /** 初始化配置 */
    initCfg() {
        const path = `${version.pluginPath}/config/config/`;
        if (!fs.existsSync(path))
            fs.mkdirSync(path);
        const pathDef = `${version.pluginPath}/config/default_config/`;
        const files = fs.readdirSync(pathDef).filter(file => file.endsWith('.yaml'));
        for (const file of files) {
            if (!fs.existsSync(`${path}${file}`)) {
                fs.copyFileSync(`${pathDef}${file}`, `${path}${file}`);
            }
            else {
                const config = YAML.parse(fs.readFileSync(`${path}${file}`, 'utf8'));
                const defaultConfig = YAML.parse(fs.readFileSync(`${pathDef}${file}`, 'utf8'));
                const configKey = Object.keys(config);
                const defaultConfigKey = Object.keys(defaultConfig);
                let isChange = false;
                for (const key of defaultConfigKey) {
                    if (!configKey.includes(key)) {
                        isChange = true;
                    }
                    else {
                        defaultConfig[key] = config[key];
                    }
                }
                if (isChange) {
                    fs.copyFileSync(`${pathDef}${file}`, `${path}${file}`);
                    for (const key of defaultConfigKey) {
                        this.modify(file.replace('.yaml', ''), key, defaultConfig[key]);
                    }
                }
            }
            this.watch(`${path}${file}`, file.replace('.yaml', ''), 'config');
        }
    }
    /** 服务配置 */
    get server() {
        return this.getDefOrConfig('server');
    }
    /** 默认配置和用户配置 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getDefOrConfig(name) {
        const def = this.getdefSet(name);
        const config = this.getConfig(name);
        return { ...def, ...config };
    }
    /** 默认配置 */
    getdefSet(name) {
        return this.getYaml('default_config', name);
    }
    /** 用户配置 */
    getConfig(name) {
        return this.getYaml('config', name);
    }
    /**
     * 获取配置yaml
     * @param type 默认跑配置-defSet，用户配置-config
     * @param name 名称
     */
    getYaml(type, name) {
        const file = `${version.pluginPath}/config/${type}/${name}.yaml`;
        const key = `${type}.${name}`;
        if (this.config[key])
            return this.config[key];
        this.config[key] = YAML.parse(fs.readFileSync(file, 'utf8'));
        this.watch(file, name, type);
        return this.config[key];
    }
    /** 监听配置文件 */
    watch(file, name, type = 'default_config') {
        const key = `${type}.${name}`;
        if (this.watcher[key])
            return;
        const watcher = chokidar.watch(file);
        watcher.on('change', async () => {
            delete this.config[key];
            logger.mark(`[${version.pluginName}][修改配置文件][${type}][${name}]`);
        });
        this.watcher[key] = watcher;
    }
    /**
     * 修改设置
     * @param name 文件名
     * @param key 修改的key值
     * @param value 修改的value值
     * @param type 配置文件或默认
     */
    modify(name, key, value, type = 'config') {
        const path = `${version.pluginPath}/config/${type}/${name}.yaml`;
        new YamlReader(path).set(key, value);
        delete this.config[`${type}.${name}`];
    }
}
class YamlReader {
    filePath;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    document;
    /**
       * 创建一个YamlReader实例。
       * @param filePath - 文件路径
       */
    constructor(filePath) {
        this.filePath = filePath;
        this.document = this.parseDocument();
    }
    /**
       * 解析YAML文件并返回Document对象，保留注释。
       * @returns {Document} 包含YAML数据和注释的Document对象
       */
    parseDocument() {
        const fileContent = fs.readFileSync(this.filePath, 'utf8');
        return YAML.parseDocument(fileContent);
    }
    /**
     * 修改指定参数的值。
     * @param key - 参数键名
     * @param value - 新的参数值
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set(key, value) {
        this.document.set(key, value);
        this.write();
    }
    /**
     * 从YAML文件中删除指定参数。
     * @param key - 要删除的参数键名
     */
    rm(key) {
        this.document.delete(key);
        this.write();
    }
    /**
       * 将更新后的Document对象写入YAML文件中。
       */
    write() {
        fs.writeFileSync(this.filePath, this.document.toString(), 'utf8');
    }
}
export default new Config();
