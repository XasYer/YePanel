import { http } from "@/utils/http";

export type dbInfo = {
  keys: string;
  expires: string;
  avg_ttl: string;
  subexpiry?: string;
};

export type getRedisInfoResult = {
  success: boolean;
  data: {
    redis_version: string;
    os: string;
    tcp_port: string;
    uptime_formatted: string;
    used_memory_human: string;
    used_memory_peak_human: string;
    total_connections_received: string;
    total_commands_processed: string;
    instantaneous_ops_per_sec: string;
    keyspace_hits: string;
    keyspace_misses: string;
    used_cpu_sys: string;
    used_cpu_user: string;
    slelct_database: string;
    databases: string;
    db0?: dbInfo;
    db1?: dbInfo;
    db2?: dbInfo;
    db3?: dbInfo;
    db4?: dbInfo;
    db5?: dbInfo;
    db6?: dbInfo;
    db7?: dbInfo;
    db8?: dbInfo;
    db9?: dbInfo;
    db10?: dbInfo;
    db11?: dbInfo;
    db12?: dbInfo;
    db13?: dbInfo;
    db14?: dbInfo;
    db15?: dbInfo;
  };
};

export type getRedisKeysData = {
  label: string;
  key: string;
  children?: Array<getRedisKeysData>;
};

export type getRedisKeysResult = {
  success: boolean;
  data: getRedisKeysData[];
};

export type getRedisValueResult = {
  success: boolean;
  message?: string;
  data: {
    key: string;
    value: string;
    expire: number;
  };
};

export type setRedisValueResult = {
  success: boolean;
  data: {
    key: string;
    value: string;
  };
};

export type deleteRedisKeysResult = {
  success: boolean;
  data: {
    errorKeys: string[];
    successKeys: string[];
  };
};

/** 获取redis数据 */
export const getRedisInfo = () => {
  return http.request<getRedisInfoResult>("get", "/get-redis-info");
};

/** 获取redis所有key */
export const getRedisKeys = (sep: string, db: string, lazy?: boolean) => {
  return http.request<getRedisKeysResult>("get", "/get-redis-keys", {
    params: { sep, db, lazy }
  });
};

/** 获取redis指定key的值 */
export const getRedisValue = (key: string, db: string) => {
  return http.request<getRedisValueResult>("get", "/get-redis-value", {
    params: { key, db }
  });
};

/** 设置redis指定key的值 */
export const setRedisValue = (
  key: string,
  value: string,
  db: string,
  expire?: number,
  newKey?: string
) => {
  return http.request<setRedisValueResult>("post", "/set-redis-value", {
    data: { key, value, db, expire, newKey }
  });
};

/** 删除redis指定key的值 */
export const deleteRedisKeys = (keys: string[], db: string) => {
  return http.request<deleteRedisKeysResult>("post", "/delete-redis-keys", {
    data: { keys, db }
  });
};

export type getSqlitePathResult = {
  success: boolean;
  data: string[];
};

/** 获取sqlite的db文件路径 */
export const getSqlitePath = () => {
  return http.request<getSqlitePathResult>("get", "/get-sqlite-path");
};

/** 获取指定路径的sqlite的所有表名 */
export const getSqliteTable = (path: string) => {
  return http.request<getSqlitePathResult>("get", "/get-sqlite-table", {
    params: { path }
  });
};

export type getSqliteTableDataResult = {
  success: boolean;
  data: {
    [key: string]: any;
  }[];
  total: number;
  tableInfo: {
    [key: string]: {
      pk: 0 | 1;
      name: string;
      type: string;
      notnull: 0 | 1;
      dflt_value: string;
      autoincrement: boolean;
    };
  };
};

/** 获取指定路径的sqlite的指定表的数据 */
export const getSqliteTableData = (
  path: string,
  table: string,
  pageNum: number,
  pageSize: number,
  search: string
) => {
  return http.request<getSqliteTableDataResult>(
    "get",
    "/get-sqlite-table-data",
    {
      params: { path, table, pageSize, pageNum, search }
    }
  );
};

export type setSqliteTableDataResult = {
  success: boolean;
  data: any;
  message?: string;
};

/** 设置或添加表的数据 */
export const setSqliteTableData = (
  path: string,
  table: string,
  data: { [key: string]: any }
) => {
  return http.request<setSqliteTableDataResult>(
    "post",
    "/set-sqlite-table-data",
    {
      data: { path, table, data }
    }
  );
};

export type deleteSqliteTableDataResult = {
  success: boolean;
  data: any;
  message?: string;
};

/** 删除指定路径的sqlite的指定表的数据 */
export const deleteSqliteTableData = (
  path: string,
  table: string,
  data: { [key: string]: any }
) => {
  return http.request<deleteSqliteTableDataResult>(
    "post",
    "/delete-sqlite-table-data",
    {
      data: { path, table, data }
    }
  );
};
