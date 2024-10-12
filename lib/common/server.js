import Fastify from 'fastify';
import fastifyAuth from '@fastify/auth';
import fastifyCors from '@fastify/cors';
import fastifyWebSocket from '@fastify/websocket';
import fastifyMultipart from '@fastify/multipart';
import fs from 'fs';
import { join } from 'path';
import { version, config } from '../common/index.js';
import { tokenAuth } from '../api/login/index.js';
export async function startServer() {
    const fastify = Fastify();
    await fastify.register(fastifyCors, {
        origin: ['*'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        credentials: true
    });
    await fastify.register(fastifyAuth);
    await fastify.register(fastifyWebSocket);
    await fastify.register(fastifyMultipart);
    function verifyToken(request, reply, done) {
        const token = request.headers['authorization'] || request.headers['sec-websocket-protocol'] || request.query?.accessToken || '';
        if (tokenAuth(token.replace('Bearer ', ''))) {
            done();
        }
        else {
            done(new Error('Unauthorized'));
        }
    }
    async function loadRoutes(directory) {
        const items = fs.readdirSync(directory);
        for (const item of items) {
            const fullPath = join(directory, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                await loadRoutes(fullPath);
            }
            else if (stat.isFile() && item === `index.${(version.isDev ? 'ts' : 'js')}`) {
                try {
                    const route = (await import(`file://${fullPath}`)).default;
                    for (const i of route) {
                        if (!i.preHandler) {
                            i.preHandler = fastify.auth([verifyToken]);
                        }
                        else {
                            delete i.preHandler;
                        }
                        fastify.route(i);
                    }
                }
                catch { /* empty */ }
            }
        }
    }
    const srcPath = version.isDev ? 'src' : 'lib';
    await loadRoutes(join(version.pluginPath, srcPath, 'api'));
    // 加载插件的路由
    const pluginList = fs.readdirSync(`${version.BotPath}/plugins`);
    for (const plugin of pluginList) {
        const pluginPath = join(version.BotPath, 'plugins', plugin);
        const YePanelPath = join(pluginPath, 'YePanel');
        if (fs.statSync(pluginPath).isDirectory() && fs.existsSync(YePanelPath)) {
            try {
                const option = (await import(`file://${join(YePanelPath, 'index.js')}?t=${Date.now()}`)).default;
                if (option.api?.length) {
                    for (const i of option.api) {
                        i.url = `/${plugin}${i.url}`;
                        if (!i.preHandler) {
                            i.preHandler = fastify.auth([verifyToken]);
                        }
                        else {
                            delete i.preHandler;
                        }
                        fastify.route(i);
                    }
                }
            }
            catch { /* empty */ }
        }
    }
    fastify.listen({ port: config.server.port, host: '::' }, (err, address) => {
        if (err) {
            logger.error(`YePanel Error starting server: ${err}`);
        }
        else {
            logger.info(`YePanel Server listening at ${address}`);
        }
    });
}
