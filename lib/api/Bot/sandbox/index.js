import { version } from '../../../common/index.js';
import fs from 'fs';
import { randomUUID } from 'crypto';
export default [
    {
        method: 'get',
        url: '/sandbox',
        handler: () => 'Ciallo～(∠・ω< )⌒☆',
        wsHandler: (connection) => {
            let uin = 'YePanel.sandbox.';
            connection.on('message', (message) => {
                let data;
                try {
                    data = JSON.parse(message.toString());
                }
                catch {
                    connection.send(JSON.stringify({ type: 'error', success: false, content: 'Invalid message format' }));
                    return;
                }
                switch (data.type) {
                    case 'create':
                        uin += data.uin;
                        createSendbox(data.uin, data.nickname, data.avatar, connection);
                        logger.mark(`${uin} 已连接`);
                        break;
                    case 'message':
                        createMessage(data.uin, data.userId, data.groupId, data.msgId, data.content, data.permission);
                        break;
                    case 'poke':
                        createPoke(data.uin, data.operatorId, data.targetId, data.userId, data.groupId, data.permission);
                        break;
                    default:
                        break;
                }
            });
            connection.on('close', () => {
                delete Bot[uin];
                if (version.BotName === 'Miao') {
                    if (Array.isArray(Bot.adapter)) {
                        const index = Bot.adapter.findIndex(i => i == uin);
                        if (index > -1) {
                            Bot.adapter.splice(index, 1);
                        }
                    }
                }
                else if (version.BotName === 'TRSS') {
                    const index = Bot.uin.findIndex(i => i == uin);
                    if (index > -1) {
                        Bot.uin.splice(index, 1);
                    }
                }
                logger.mark(`${uin} 已断开连接`);
            });
        }
    }
];
function createSendbox(id, nickname, avatar, ws) {
    const nameList = [
        'Alice',
        'Ben',
        'Chris',
        'David',
        'Emma',
        'Frank',
        'Grace',
        'Henry',
        'Isabel',
        'Jack',
        'Kevin',
        'Lucy',
        'Michael',
        'Nancy',
        'Olivia',
        'Paul',
        'Quinn',
        'Ryan',
        'Sarah',
        'Tom',
        'Ursula',
        'Victor',
        'William',
        'Xavier',
        'Yvonne',
        'Zoe'
    ];
    const key = 'YePanel.sandbox.';
    const uin = key + id;
    const bot = Bot[uin] || {};
    Bot[uin] = {
        uin,
        self_id: uin,
        nickname: key + (nickname || bot.nickname || id),
        avatar: avatar || bot.avatar || '',
        adapter: {
            id: 'sandbox',
            name: 'YePanel'
        },
        version: {
            version: version.pluginVersion,
            id: 'sandbox',
            name: 'YePanel'
        },
        stat: {
            start_time: Date.now() / 1000
        },
        pickFriend(userId) {
            const info = this.fl.get(userId) || {};
            return {
                info,
                ...info,
                sendMsg: (message) => {
                    return this.sendPrivateMsg(userId, message);
                },
                makeForwardMsg(msg) {
                    return { type: 'node', data: msg };
                },
                getInfo() {
                    return info;
                },
                poke: () => {
                    return this.sendPrivateMsg(userId, { type: 'poke', qq: userId });
                }
            };
        },
        pickUser(userId) {
            return this.pickFriend(userId);
        },
        pickGroup(groupId) {
            const info = this.gl.get(groupId) || {};
            return {
                info,
                ...info,
                sendMsg: (message) => {
                    return this.sendGroupMsg(groupId, message);
                },
                makeForwardMsg(msg) {
                    return { type: 'node', data: msg };
                },
                getInfo() {
                    return info;
                },
                pokeMember: (userId) => {
                    return this.sendGroupMsg(groupId, { type: 'poke', qq: userId });
                }
            };
        },
        pickMember(groupId, userId) {
            const info = {
                ...this.fl.get(userId) || {},
                ...this.gl.get(groupId) || {}
            };
            return {
                info,
                ...info,
                ...this.pickFriend(userId),
                poke: () => this.sendGroupMsg(groupId, { type: 'poke', qq: userId })
            };
        },
        sendPrivateMsg(userId, message) {
            const msgId = userId + '.' + randomUUID();
            ws.send?.(JSON.stringify({ type: 'friend', id: userId, content: dealMessage(message), msgId }));
            logger.info(`${logger.blue(`[${uin} => ${userId}]`)} 发送私聊消息：${JSON.stringify(message).replace(/data:image\/png;base64,.*?(,|]|")/g, 'base64://...$1')}`);
            return new Promise((resolve) => resolve({ message_id: msgId }));
        },
        sendGroupMsg(groupId, message) {
            const msgId = groupId + '.' + randomUUID();
            ws.send?.(JSON.stringify({ type: 'group', id: groupId, content: dealMessage(message), msgId }));
            logger.info(`${logger.blue(`[${uin} => ${groupId}]`)} 发送群聊消息：${JSON.stringify(message).replace(/data:image\/png;base64,.*?(,|]|")/g, 'base64://...$1')}`);
            return new Promise((resolve) => resolve({ message_id: msgId }));
        },
        getFriendList() {
            return this.fl;
        },
        getGroupList() {
            return this.gl;
        },
        getGroupMemberList(groupId) {
            return this.gml.get(groupId) || new Map();
        },
        fl: nameList.reduce((acc, cur) => {
            acc.set(cur, {
                user_id: cur,
                nickname: cur,
                bot_id: uin
            });
            return acc;
        }, new Map()),
        gl: ['sandbox.group'].reduce((acc, cur) => {
            acc.set(cur, {
                groupId: cur,
                group_name: cur,
                bot_id: uin
            });
            return acc;
        }, new Map()),
        gml: ['sandbox.group'].reduce((acc, cur) => {
            acc.set(cur, nameList.reduce((acc, cur) => {
                acc.set(cur, {
                    user_id: cur,
                    groupId: cur,
                    nickname: cur,
                    bot_id: uin
                });
                return acc;
            }, new Map()));
            return acc;
        }, new Map())
    };
    if (version.BotName === 'Miao') {
        if (!Bot.adapter) {
            Bot.adapter = [Bot.uin];
            Bot.adapter.push(uin);
        }
        else if (Array.isArray(Bot.adapter)) {
            if (!Bot.adapter.includes(uin)) {
                Bot.adapter.push(uin);
            }
        }
    }
    else if (version.BotName === 'TRSS') {
        if (!Bot.uin.includes(uin)) {
            Bot.uin.push(uin);
        }
    }
}
function createMessage(id, userId, groupId, msgId, content, permission = 'user') {
    const key = 'YePanel.sandbox.';
    const uin = key + id;
    const bot = Bot[uin];
    const e = {
        bot: Bot[uin],
        adapter: bot.version,
        message_id: msgId,
        sender: {
            user_id: userId,
            nickname: userId,
            role: permission
        },
        nickname: userId,
        user_id: userId,
        self_id: uin,
        time: Date.now(),
        message: [{ type: 'text', text: content }],
        raw_message: content,
        isMaster: permission === 'master',
        post_type: 'message',
        ...groupId
            ? {
                message_type: 'group',
                sub_type: 'normal',
                group_id: groupId,
                group_name: groupId
            }
            : {
                message_type: 'private',
                sub_type: 'friend'
            },
        friend: bot.pickFriend(userId),
        group: groupId ? bot.pickGroup(groupId) : undefined,
        member: (groupId && userId) ? bot.pickMember(groupId, userId) : undefined
    };
    let event = `${e.post_type}.${e.message_type}.${e.sub_type}`;
    logger.info(`${logger.blue(`[${e.self_id}]`)} ${groupId ? '群' : '好友'}消息：[${groupId ? groupId + ', ' : ''}${e.nickname}] ${e.raw_message}`);
    if (version.BotName === 'TRSS') {
        Bot.em(event, e);
    }
    else {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            Bot.emit(event, e);
            const i = event.lastIndexOf('.');
            if (i == -1)
                break;
            event = event.slice(0, i);
        }
    }
}
function dealMessage(message) {
    if (!Array.isArray(message))
        message = [message];
    for (const i in message) {
        if (typeof message[i] !== 'object') {
            message[i] = { type: 'text', text: message[i] };
        }
        switch (message[i].type) {
            case 'image':
                // 不加 file:// 的本地图片路径
                if (typeof message[i].file === 'string') {
                    if (fs.existsSync(message[i].file)) {
                        message[i].file = `file://${message[i].file}`;
                    }
                }
                if (message[i].file.startsWith?.('file://')) {
                    try {
                        message[i].file = fs.readFileSync(message[i].file.replace('file://', ''));
                    }
                    catch {
                        try {
                            message[i].file = fs.readFileSync(message[i].file.replace('file:///', ''));
                        }
                        catch {
                            message[i].file = '';
                        }
                    }
                }
                if (message[i].file.startsWith?.('base64://')) {
                    message[i].file = `data:image/png;base64,${message[i].file.replace('base64://', '')}`;
                }
                if (Buffer.isBuffer(message[i].file)) {
                    message[i].file = `data:image/png;base64,${message[i].file.toString('base64')}`;
                }
                break;
            case 'node':
                message = dealMessage(message[i].data.map((i) => i.message));
                break;
            default:
                break;
        }
    }
    return message;
}
function createPoke(id, operatorId, targetId, userId, groupId, permission = 'user') {
    const key = 'YePanel.sandbox.';
    const uin = key + id;
    const bot = Bot[uin];
    const e = {
        bot: Bot[uin],
        adapter: bot.version,
        user_id: groupId ? targetId : userId,
        self_id: uin,
        isMaster: permission === 'master',
        post_type: 'notice',
        operator_id: operatorId,
        target_id: targetId == id ? uin : targetId,
        ...groupId
            ? {
                notice_type: 'group',
                sub_type: 'poke',
                groupId,
                group_name: groupId
            }
            : {
                notice_type: 'friend',
                sub_type: 'poke'
            },
        friend: bot.pickFriend(userId),
        group: groupId ? bot.pickGroup(groupId) : undefined,
        member: (groupId && userId) ? bot.pickMember(groupId, userId) : undefined
    };
    let event = `${e.post_type}.${e.notice_type}.${e.sub_type}`;
    logger.info(`${logger.blue(`[${e.self_id}]`)} ${groupId ? '群' : '好友'}事件：[${groupId ? groupId + ', ' : ''}${e.operator_id}] 戳了戳 [${e.target_id}]`);
    if (version.BotName === 'TRSS') {
        Bot.em(event, e);
    }
    else {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            Bot.emit(event, e);
            const i = event.lastIndexOf('.');
            if (i == -1)
                break;
            event = event.slice(0, i);
        }
    }
}
