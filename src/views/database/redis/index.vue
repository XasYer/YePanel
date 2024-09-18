<template>
  <el-card>
    <el-collapse v-model="activeNames" class="text-2xl">
      <el-collapse-item title="信息" name="1">
        <el-descriptions
          :border="infoBorder"
          :direction="infoDirection"
          title="Server"
          :column="getColumn(5)"
        >
          <template #extra>
            <el-tooltip
              effect="light"
              content="Top Left prompts info"
              placement="left"
              trigger="click"
            >
              <template #content>
                <div class="flex items-center">
                  <div class="mr-3">排列方向:</div>
                  <el-radio-group v-model="infoDirection">
                    <el-radio-button value="vertical" size="small"
                      >垂直</el-radio-button
                    >
                    <el-radio-button value="horizontal" size="small"
                      >水平</el-radio-button
                    >
                  </el-radio-group>
                  <div class="mx-3">边框:</div>
                  <el-switch v-model="infoBorder" />
                </div>
              </template>
              <el-button size="small" type="primary" class="mr-6"
                >设置</el-button
              >
            </el-tooltip>
          </template>
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
          :border="infoBorder"
          :direction="infoDirection"
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
        </el-descriptions>
        <el-descriptions
          :border="infoBorder"
          :direction="infoDirection"
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
          <el-descriptions-item label="当前每秒处理命令数">
            {{ redisInfo?.instantaneous_ops_per_sec }}
          </el-descriptions-item>
          <el-descriptions-item label="查找key成功次数">
            {{ redisInfo?.keyspace_hits }}
          </el-descriptions-item>
          <el-descriptions-item label="查找key失败次数">
            {{ redisInfo?.keyspace_misses }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
          :border="infoBorder"
          :direction="infoDirection"
          title="Cpu"
          :column="getColumn(5)"
          class="mt-4"
        >
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
          :border="infoBorder"
          :direction="infoDirection"
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
        <el-row>
          <re-col :span="12" :xs="24" class="mb-[10px] mr-[10px]">
            <el-input
              v-model="filterText"
              style="width: 300px"
              placeholder="请输入key"
            />
          </re-col>
          <re-col :span="12" :xs="24" class="mb-[10px]">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button type="warning" @click="handleSearch(true)"
              >重置</el-button
            >
            <el-button type="success" @click="handleAdd">添加</el-button>
            <el-popconfirm
              :title="deleteKeysTitle"
              width="300px"
              @confirm="handleDeleteKeys"
            >
              <template #reference>
                <el-button type="danger" @click="changeDeleteKeysTitle"
                  >删除所选</el-button
                >
              </template>
            </el-popconfirm>
          </re-col>
        </el-row>
        <el-tree-v2
          ref="treeRef"
          :data="data"
          :props="props"
          node-key="key"
          show-checkbox
          :height="650"
          :filter-node-method="filterNode"
          :filter-method="filterNode"
          @node-click="handleNodeClick"
        />
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script setup lang="ts">
import { h, isRef, ref, toRaw } from "vue";
import {
  getRedisInfo,
  getRedisKeys,
  type getRedisInfoResult,
  type dbInfo,
  getRedisValue,
  setRedisValue,
  deleteRedisKeys
} from "@/api/database";
import {
  Tree,
  TreeNode
} from "element-plus/es/components/tree-v2/src/types.mjs";
import { ElTree, ElTreeV2 } from "element-plus";
import codeMirror from "./components/codeMirror.vue";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";

defineOptions({
  name: "Redis"
});

const props = {
  value: "key"
};

const getColumn = (num: number) => {
  if (window.innerWidth < 992) {
    return Math.floor(num / 2);
  } else {
    return num;
  }
};

const infoBorder = ref(true);
const infoDirection = ref<"vertical" | "horizontal">("horizontal");

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
const getTreeData = () => {
  getRedisKeys(":").then(res => {
    data.value = res.data;
  });
};
const activeNames = ref(["1"]);

const filterText = ref("");
const treeRef = ref<InstanceType<typeof ElTreeV2>>();

const selectNode = ref({
  key: "",
  value: "",
  expire: -1
});
const codeMirrorRef = ref<InstanceType<typeof codeMirror>>();
const handleNodeClick = (data: TreeNode) => {
  if (!data.children?.length) {
    getRedisValue(data.key as string).then(res => {
      try {
        res.data.value = JSON.stringify(JSON.parse(res.data.value), null, 2);
      } catch (error) {}
      addDialog({
        width: window.innerWidth < 992 ? "90%" : "50%",
        title: "编辑",
        contentRenderer: () => h(codeMirror, { ref: codeMirrorRef }),
        props: {
          data: {
            key: data.key as string,
            value: res.data.value,
            expire: res.data.expire
          }
        },
        closeCallBack: ({ options, args }) => {
          if (args?.command === "sure") {
            const newData = codeMirrorRef.value.getData();
            try {
              newData.value = JSON.stringify(JSON.parse(newData.value));
            } catch (error) {}
            if (newData.expire < -1) {
              newData.expire = -1;
            } else if (newData.expire === res.data.expire) {
              // 表示不变
              newData.expire = -2;
            }
            setRedisValue(
              data.key as string,
              newData.value,
              newData.expire,
              newData.key === data.key ? undefined : newData.key
            ).then(res => {
              message("保存成功~ Ciallo～(∠・ω< )⌒☆'", {
                customClass: "el",
                type: "success"
              });
              getTreeData();
            });
          }
        },
        beforeSure: (done, { options, index }) => {
          if (codeMirrorRef.value.checkCode()) {
            done();
          }
        },
        draggable: true
      });
    });
  }
};

const handleSearch = (reset: boolean | MouseEvent = false) => {
  if (reset === true) {
    filterText.value = "";
    treeRef.value.filter("");
    treeRef.value.setExpandedKeys([]);
  } else {
    treeRef.value.filter(filterText.value);
  }
};

const handleAdd = () => {
  addDialog({
    width: window.innerWidth < 992 ? "90%" : "50%",
    title: "添加",
    contentRenderer: () => h(codeMirror, { ref: codeMirrorRef }),
    props: {
      data: {
        key: "",
        value: "",
        expire: -1
      }
    },
    closeCallBack: ({ options, args }) => {
      if (args?.command === "sure") {
        const newData = codeMirrorRef.value.getData();
        try {
          newData.value = JSON.stringify(JSON.parse(newData.value));
        } catch (error) {}
        if (newData.expire < -1) {
          newData.expire = -1;
        }
        setRedisValue(newData.key, newData.value, newData.expire).then(res => {
          message("添加成功~ Ciallo～(∠・ω< )⌒☆'", {
            customClass: "el",
            type: "success"
          });
          getTreeData();
        });
      }
    },
    beforeSure: (done, { options, index }) => {
      if (codeMirrorRef.value.checkCode()) {
        done();
      }
    },
    draggable: true
  });
};

const checkedKeys = ref<string[]>([]);
const deleteKeysTitle = ref("确定要删除吗?");
const changeDeleteKeysTitle = () => {
  checkedKeys.value = treeRef.value
    .getCheckedNodes()
    .filter(i => !i.children?.length)
    .map(i => i.key);
  deleteKeysTitle.value = `已选择${checkedKeys.value.length}个key,确定要删除所选吗?`;
};
const handleDeleteKeys = () => {
  if (!checkedKeys.value.length) {
    message("请选择要删除的key~", {
      customClass: "el",
      type: "warning"
    });
    return;
  }
  deleteRedisKeys(checkedKeys.value).then(res => {
    if (res.success) {
      message("删除成功~ Ciallo～(∠・ω< )⌒☆'", {
        customClass: "el",
        type: "success"
      });
      getTreeData();
    }
  });
};

const filterNode = (value: string, data: any) => {
  return data.key.includes(value);
};

const data = ref<any[]>([]);
getTreeData();
</script>
