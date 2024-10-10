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
    // 测试的redis版本低, 所以这里只列出了部分数据
    redis_version: string;
    redis_git_sha1: string;
    redis_git_dirty: string;
    redis_build_id: string;
    redis_mode: string;
    os: string;
    arch_bits: string;
    multiplexing_api: string;
    process_id: string;
    run_id: string;
    tcp_port: string;
    uptime_in_seconds: string;
    uptime_in_days: string;
    uptime_formatted: string;
    hz: string;
    lru_clock: string;
    config_file: string;
    connected_clients: string;
    client_longest_output_list: string;
    client_biggest_input_buf: string;
    blocked_clients: string;
    used_memory: string;
    used_memory_human: string;
    used_memory_rss: string;
    used_memory_peak: string;
    used_memory_peak_human: string;
    used_memory_startup: string;
    used_memory_lua: string;
    mem_fragmentation_ratio: string;
    mem_allocator: string;
    loading: string;
    rdb_changes_since_last_save: string;
    rdb_bgsave_in_progress: string;
    rdb_last_save_time: string;
    rdb_last_bgsave_status: string;
    rdb_last_bgsave_time_sec: string;
    rdb_current_bgsave_time_sec: string;
    aof_enabled: string;
    aof_rewrite_in_progress: string;
    aof_rewrite_scheduled: string;
    aof_last_rewrite_time_sec: string;
    aof_current_rewrite_time_sec: string;
    aof_last_bgrewrite_status: string;
    aof_last_write_status: string;
    total_connections_received: string;
    total_commands_processed: string;
    instantaneous_ops_per_sec: string;
    total_net_input_bytes: string;
    total_net_output_bytes: string;
    instantaneous_input_kbps: string;
    instantaneous_output_kbps: string;
    rejected_connections: string;
    sync_full: string;
    sync_partial_ok: string;
    sync_partial_err: string;
    expired_keys: string;
    evicted_keys: string;
    keyspace_hits: string;
    keyspace_misses: string;
    pubsub_channels: string;
    pubsub_patterns: string;
    latest_fork_usec: string;
    migrate_cached_sockets: string;
    role: string;
    connected_slaves: string;
    master_repl_offset: string;
    repl_backlog_active: string;
    repl_backlog_size: string;
    repl_backlog_first_byte_offset: string;
    repl_backlog_histlen: string;
    used_cpu_sys: string;
    used_cpu_user: string;
    used_cpu_sys_children: string;
    used_cpu_user_children: string;
    cluster_enabled: string;
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
  return http.request<getRedisInfoResult>("post", "/get-redis-info");
};

/** 获取redis所有key */
export const getRedisKeys = (sep: string, lazy?: boolean) => {
  return http.request<getRedisKeysResult>("post", "/get-redis-keys", {
    data: { sep, lazy }
  });
};

/** 获取redis指定key的值 */
export const getRedisValue = (key: string) => {
  return http.request<getRedisValueResult>("post", "/get-redis-value", {
    data: { key }
  });
};

/** 设置redis指定key的值 */
export const setRedisValue = (
  key: string,
  value: string,
  expire?: number,
  newKey?: string
) => {
  return http.request<setRedisValueResult>("post", "/set-redis-value", {
    data: { key, value, expire, newKey }
  });
};

/** 删除redis指定key的值 */
export const deleteRedisKeys = (keys: string[]) => {
  return http.request<deleteRedisKeysResult>("post", "/delete-redis-keys", {
    data: { keys }
  });
};

export type getSqlitePathResult = {
  success: boolean;
  data: string[];
};

/** 获取sqlite的db文件路径 */
export const getSqlitePath = () => {
  return http.request<getSqlitePathResult>("post", "/get-sqlite-path");
};

/** 获取指定路径的sqlite的所有表名 */
export const getSqliteTable = (path: string) => {
  return http.request<getSqlitePathResult>("post", "/get-sqlite-table", {
    data: { path }
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
    "post",
    "/get-sqlite-table-data",
    {
      data: { path, table, pageSize, pageNum, search }
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
