import { version } from '../common/index.js';
if (version.isDev) {
    global.plugin = class {
    };
    global.redis = {
        // @ts-ignore
        get: () => { },
        // @ts-ignore
        set: () => { },
        // @ts-ignore
        mGet: () => ([]),
    };
    // @ts-ignore
    global.logger = new Proxy({}, {
        get(target, p) {
            return (...args) => console.log(p, ...args);
        }
    });
    // @ts-ignore
    global.Bot = {
        uin: [],
        on: () => { },
    };
}
