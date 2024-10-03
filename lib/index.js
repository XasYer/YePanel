import fs from 'fs';
import { getToken } from './login/index.js';
import { join, dirname, basename } from 'path';
import { pluginPath } from './utils.js';
const httpPath = '/qqbot';
const wsPath = 'qqbot';
const corsOptions = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': 'X-Requested-With,content-type,authorization',
    'Access-Control-Allow-Credentials': true
};
Bot.express.use(httpPath + '/*', (req, res, next) => {
    res.set(corsOptions);
    const origin = req.headers.origin;
    if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }
    next();
});
const httpRoutes = [];
const wsRoutes = [];
async function loadRoutes(directory) {
    const items = fs.readdirSync(directory);
    for (const item of items) {
        const fullPath = join(directory, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            await loadRoutes(fullPath);
        }
        else if (stat.isFile() && item === 'index.js' && basename(dirname(fullPath)) !== 'lib') {
            try {
                const { http, ws } = (await import(`file://${fullPath}`)).default;
                if (http?.length) {
                    httpRoutes.push(...http);
                }
                if (ws?.length) {
                    wsRoutes.push(...ws);
                }
            }
            catch (error) {
                console.log('error', error);
            }
        }
    }
}
await loadRoutes(join(pluginPath, 'lib'));
if (!Array.isArray(Bot.wsf[wsPath])) {
    Bot.wsf[wsPath] = [];
}
for (const i of httpRoutes) {
    Bot.express[i.method](httpPath + i.url, (req, res, next) => {
        if (!i.token) {
            next();
            return;
        }
        const token = req.headers.authorization?.replace('Bearer ', '');
        const [accessToken, uin] = token?.split('.') || [];
        if (!getToken(uin) || accessToken !== getToken(uin)) {
            res.status(401).send('Unauthorized');
            return;
        }
        req.body.uin = String(uin);
        next();
    }, (i.handler ? i.handler : (_req, _res, next) => next()), async (req, res, next) => {
        try {
            const result = await i.response(req, res, next);
            if (!i.contentType) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(result));
            }
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    });
}
for (const i of wsRoutes) {
    Bot.wsf[wsPath].push((ws, req, socket, head) => {
        const url = req.url.replace(`/${wsPath}`, '');
        if (url === `/ws${i.url}`)
            i.function(ws, req, socket, head);
    });
}
