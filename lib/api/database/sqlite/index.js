/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import { join } from 'path';
import { Sequelize } from 'sequelize';
const sequelizeCache = {};
function findSqlitePath(directory) {
    const dbPath = [];
    const items = fs.readdirSync(directory);
    for (const item of items) {
        if (['node_modules', '.git', '.vscode'].includes(item)) {
            continue;
        }
        const fullPath = join(directory, item);
        let stat;
        try {
            stat = fs.statSync(fullPath);
        }
        catch {
            continue;
        }
        if (stat.isDirectory()) {
            dbPath.push(...findSqlitePath(fullPath));
        }
        else if (stat.isFile() && item.endsWith('.db')) {
            if (/SQLite format 3/.test(fs.readFileSync(fullPath).subarray(0, 16).toString())) {
                dbPath.push(fullPath.replace(/\\/g, '/'));
            }
        }
    }
    return dbPath;
}
function getSequelize(path) {
    if (!sequelizeCache[path]) {
        sequelizeCache[path] = {
            timer: setTimeout(() => {
                delete sequelizeCache[path];
            }, 1000 * 60 * 10),
            instance: new Sequelize({
                dialect: 'sqlite',
                storage: path
            }),
            total: {},
            tableInfo: {}
        };
    }
    clearTimeout(sequelizeCache[path].timer);
    sequelizeCache[path].timer = setTimeout(() => {
        delete sequelizeCache[path];
    }, 1000 * 60 * 10);
    return sequelizeCache[path];
}
function getFormattedDate() {
    const now = new Date();
    const datePart = now.toISOString().slice(0, 23);
    const timeZoneOffset = now.getTimezoneOffset();
    const offsetHours = String(Math.abs(Math.floor(timeZoneOffset / 60))).padStart(2, '0');
    const offsetMinutes = String(Math.abs(timeZoneOffset % 60)).padStart(2, '0');
    const sign = timeZoneOffset > 0 ? '-' : '+';
    return `${datePart.replace('T', ' ')} ${sign}${offsetHours}:${offsetMinutes}`;
}
export default [
    {
        url: '/get-sqlite-path',
        method: 'get',
        handler: () => {
            return {
                success: true,
                data: findSqlitePath('./')
            };
        }
    },
    {
        url: '/get-sqlite-table',
        method: 'get',
        handler: async ({ query }) => {
            const { path } = query;
            const sequelize = getSequelize(path).instance;
            const [results] = await sequelize.query('SELECT name FROM sqlite_master WHERE type=\'table\';');
            return {
                success: true,
                data: results.map(item => (item.name)).filter(item => item !== 'sqlite_sequence')
            };
        }
    },
    {
        url: '/get-sqlite-table-data',
        method: 'get',
        handler: async ({ query }) => {
            const { path, table, pageSize, pageNum, search } = query;
            const offset = (pageNum * pageSize) - pageSize;
            const { instance: sequelize, total, tableInfo } = getSequelize(path);
            if (!total[table]) {
                const [totalResults] = await sequelize.query(`SELECT COUNT(*) AS total FROM '${table}';`);
                total[table] = totalResults[0].total;
            }
            let count = total[table];
            if (!tableInfo[table]) {
                const [tableInfoResults] = await sequelize.query(`PRAGMA table_info('${table}');`);
                const info = {};
                for (const item of tableInfoResults) {
                    if (item.pk) {
                        const [results] = await sequelize.query(`SELECT sql FROM sqlite_master WHERE type = 'table' AND name = '${table}';`);
                        item.autoincrement = /AUTOINCREMENT/.test(results[0].sql);
                    }
                    info[item.name] = item;
                }
                tableInfo[table] = info;
            }
            const sql = `SELECT * FROM '${table}' ${search ? `WHERE ${search}` : ''} LIMIT ${pageSize} OFFSET ${offset};`;
            const [results] = await sequelize.query(sql);
            if (search) {
                const [searchResults] = await sequelize.query(`SELECT COUNT(*) AS total FROM '${table}' WHERE ${search};`);
                count = searchResults[0].total;
            }
            return {
                success: true,
                data: results,
                total: count,
                tableInfo: tableInfo[table]
            };
        }
    },
    {
        url: '/set-sqlite-table-data',
        method: 'post',
        handler: async ({ body }) => {
            const { path, table, data } = body;
            const { instance: sequelize, tableInfo, total } = getSequelize(path);
            const type = data.createdAt ? 'update' : 'insert';
            delete data.createdAt;
            delete data.updatedAt;
            const keys = Object.keys(data);
            const values = Object.values(data);
            const updatedAt = getFormattedDate();
            const pk = keys.find(key => tableInfo[table][key].pk) || 'createdAt';
            // 如果有创建时间就是修改
            const sql = type === 'update'
                ? `UPDATE '${table}' SET ${keys.map((key) => `${key} = ?`).join(', ')}, updatedAt = ? WHERE ${pk} = ?`
                : `INSERT INTO '${table}' (${keys.join(', ')}, createdAt, updatedAt) VALUES (${keys.map(() => '?').join(', ')}, ?, ?)`;
            try {
                const [results, metadata] = await sequelize.query(sql, {
                    replacements: type === 'update' ? [...values, updatedAt, data[pk]] : [...values, updatedAt, updatedAt]
                });
                const [totalResults] = await sequelize.query(`SELECT COUNT(*) AS total FROM '${table}';`);
                total[table] = totalResults[0].total;
                return {
                    success: true,
                    results,
                    metadata
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
        url: '/delete-sqlite-table-data',
        method: 'post',
        handler: async ({ body }) => {
            const { path, table, data } = body;
            const { instance: sequelize, tableInfo, total } = getSequelize(path);
            const keys = Object.keys(data);
            const pk = keys.find(key => tableInfo[table][key].pk) || 'createdAt';
            try {
                const [results, metadata] = await sequelize.query(`DELETE FROM '${table}' WHERE ${pk} = ?`, {
                    replacements: [data[pk]]
                });
                const [totalResults] = await sequelize.query(`SELECT COUNT(*) AS total FROM '${table}';`);
                total[table] = totalResults[0].total;
                return {
                    success: true,
                    results,
                    metadata
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
        url: '/execute-sql',
        method: 'post',
        handler: async ({ body }) => {
            const { path, sql } = body;
            const { instance: sequelize } = getSequelize(path);
            try {
                const [results, metadata] = await sequelize.query(sql);
                return {
                    success: true,
                    data: {
                        results,
                        metadata
                    }
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
