<template>
  <el-card>
    <el-collapse v-model="activeNames" class="text-2xl" @change="handleChange">
      <el-collapse-item title="信息" name="1">
        <el-descriptions border title="Server" :column="getColumn(5)">
          <el-descriptions-item label="Redis 版本">{{
            redisInfo?.redis_version
          }}</el-descriptions-item>
          <el-descriptions-item label="os">
            {{ redisInfo?.os }}
          </el-descriptions-item>
          <el-descriptions-item label="监听端口">
            {{ redisInfo?.tcp_port }}
          </el-descriptions-item>
          <el-descriptions-item label="已运行时间">{{
            redisInfo?.uptime_formatted
          }}</el-descriptions-item>
          <el-descriptions-item
            v-if="redisInfo?.config_file"
            label="配置文件路径"
            >{{ redisInfo?.config_file }}</el-descriptions-item
          >
        </el-descriptions>
        <el-descriptions
          border
          title="Memory"
          :column="getColumn(5)"
          class="mt-4"
        >
          <el-descriptions-item label="当前内存占用">{{
            redisInfo?.used_memory_human
          }}</el-descriptions-item>
          <el-descriptions-item label="最大内存占用">{{
            redisInfo?.used_memory_peak_human
          }}</el-descriptions-item>
          <el-descriptions-item label="内存分配器">
            {{ redisInfo?.mem_allocator }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
          border
          title="Stats"
          :column="getColumn(6)"
          class="mt-4"
        >
          <el-descriptions-item label="接受连接总数">{{
            redisInfo?.total_connections_received
          }}</el-descriptions-item>
          <el-descriptions-item label="处理命令总数">{{
            redisInfo?.total_commands_processed
          }}</el-descriptions-item>
          <el-descriptions-item label="每秒处理命令数">
            {{ redisInfo?.instantaneous_ops_per_sec }}
          </el-descriptions-item>
          <el-descriptions-item label="过期key总数">
            {{ redisInfo?.expired_keys }}
          </el-descriptions-item>
          <el-descriptions-item label="查找key成功次数">
            {{ redisInfo?.keyspace_hits }}
          </el-descriptions-item>
          <el-descriptions-item label="查找key失败次数">
            {{ redisInfo?.keyspace_misses }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions border title="Cpu" :column="getColumn(5)" class="mt-4">
          <el-descriptions-item label="系统cpu使用率">{{
            redisInfo?.used_cpu_sys
          }}</el-descriptions-item>
          <el-descriptions-item label="用户cpu使用率">{{
            redisInfo?.used_cpu_user
          }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions
          v-for="(val, i) in keyspace"
          :key="i"
          border
          :title="i as string"
          :column="getColumn(5)"
          class="mt-4"
        >
          <el-descriptions-item label="key数量">{{
            val.keys
          }}</el-descriptions-item>
          <el-descriptions-item label="过期key数量">{{
            val.expires
          }}</el-descriptions-item>
        </el-descriptions>
      </el-collapse-item>
      <el-collapse-item title="数据" name="2">
        <div>Ciallo～(∠・ω< )⌒☆</div>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  getRedisInfo,
  type getRedisInfoResult,
  type dbInfo
} from "@/api/database";

defineOptions({
  name: "Redis"
});

const getColumn = (num: number) => {
  if (window.innerWidth < 992) {
    return Math.floor(num / 2);
  } else {
    return num;
  }
};

const redisInfo = ref<getRedisInfoResult["data"]>();
const keyspace = ref<{ [key: string]: dbInfo }>({});

getRedisInfo().then(res => {
  redisInfo.value = res.data;
  for (let i = 0; i < 16; i++) {
    if (redisInfo.value[`db${i}`]) {
      const db = {};
      redisInfo.value[`db${i}`].split(",").forEach(i => {
        const [key, value] = i.split("=");
        db[key.trim()] = value.trim();
      });
      keyspace.value[`db${i}`] = db as dbInfo;
    }
  }
});
const activeNames = ref(["1"]);
const handleChange = (val: string[]) => {
  console.log(val);
};
</script>

<style scoped>
* {
  font-size: 20px;
}
</style>
