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
        <div v-if="!isLoad">
          <el-row>
            <re-col :span="12" :xs="24" class="mb-[10px] mr-[10px]">
              <el-select
                v-model="selectDB"
                class="mr-[10px]"
                style="width: 100px"
                @change="getTreeData"
              >
                <el-option
                  v-for="item in databases"
                  :key="item"
                  :label="`db${item}`"
                  :value="item"
                />
              </el-select>
              <el-input
                v-model="filterText"
                style="width: 280px"
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
            v-if="treeType === '2'"
            ref="treeRefV2"
            :props="props"
            show-checkbox
            :height="650"
            :filter-method="filterNode"
            @node-click="handleNodeClick"
          />
          <el-tree
            v-else
            ref="treeRef"
            :load="loadTree"
            lazy
            node-key="key"
            show-checkbox
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
          />
        </div>
        <div v-else>
          <el-space direction="vertical" alignment="left">
            <div>
              <el-button type="success" @click="getTreeData">
                点我加载数据
              </el-button>
            </div>
            <el-text class="mx-1" type="warning" size="large"
              >请注意: 如果redis数据量过大, 可能会导致服务器卡顿,
              此时建议使用懒加载模式</el-text
            >
            <el-divider content-position="left">数据加载方式</el-divider>
            <el-radio-group v-model="treeType">
              <el-radio value="1">Tree 懒加载模式点击节点时获取数据</el-radio>
              <el-radio value="2">Tree V2 一次性加载所有数据</el-radio>
            </el-radio-group>
          </el-space>
        </div>
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
  type getRedisKeysData,
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
const databases = ref<string[]>([]);
const selectDB = ref<string>();

getRedisInfo().then(res => {
  redisInfo.value = res.data;
  selectDB.value = redisInfo.value.slelct_database.toString();
  databases.value = Array.from(
    { length: Number(redisInfo.value.databases) },
    (_, i) => String(i)
  );
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

const isLoad = ref(true);
const treeType = ref("2");
let treeV2Data = [];
const getTreeData = () => {
  isLoad.value = false;
  if (treeType.value === "2") {
    getRedisKeys(":", selectDB.value).then(res => {
      treeV2Data = res.data;
      treeRefV2.value.setData(treeV2Data);
    });
  }
};

const loadTree = (node: TreeNode, resolve: (data: any[]) => void) => {
  getRedisKeys(node.data?.key || "", selectDB.value, true).then(res =>
    resolve(res.data)
  );
  return;
};

const activeNames = ref(["1"]);

const filterText = ref("");
const treeRef = ref<InstanceType<typeof ElTree>>();
const treeRefV2 = ref<InstanceType<typeof ElTreeV2>>();

const codeMirrorRef = ref<InstanceType<typeof codeMirror>>();
const handleNodeClick = (data: getRedisKeysData, node: TreeNode) => {
  if (node.isLeaf) {
    getRedisValue(data.key as string, selectDB.value).then(res => {
      if (!res.success) {
        message(res.message, {
          type: "error",
          customClass: "el"
        });
        return;
      }
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
            const isChange = newData.key !== data.key;
            setRedisValue(
              data.key as string,
              newData.value,
              selectDB.value,
              newData.expire,
              isChange ? newData.key : undefined
            ).then(res => {
              message("保存成功~ Ciallo～(∠・ω< )⌒☆'", {
                customClass: "el",
                type: "success"
              });
              if (isChange) {
                if (treeType.value === "2") {
                  delTreeV2Key(data.key);
                  addTreeV2Key(res.data.key);
                  treeRefV2.value.setData(treeV2Data);
                } else {
                  delTreeKey(data.key);
                  addTreeKey(res.data.key);
                }
              }
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
    if (treeType.value === "2") {
      treeRefV2.value.filter("");
      treeRefV2.value.setExpandedKeys([]);
    } else {
      treeRef.value.filter("");
    }
  } else {
    const ref = treeType.value === "2" ? treeRefV2 : treeRef;
    ref.value.filter(filterText.value);
  }
};

const addTreeKey = (nodeKey: string) => {
  let keys = null;
  const arr = nodeKey.split(":");
  let index = 0;
  for (const i of arr) {
    const key = keys ? `${keys}:${i}` : i;
    if (!treeRef.value.getNode(key)) {
      treeRef.value.append(
        {
          label: i,
          key,
          children: [],
          isLeaf: index === arr.length - 1
        },
        keys
      );
    }
    if (!keys) {
      keys = i;
    } else {
      keys += `:${i}`;
    }
    index++;
  }
};

const delTreeKey = (nodeKey: string) => {
  let keys = nodeKey;
  for (const key of nodeKey.split(":").reverse()) {
    const node = treeRef.value.getNode(keys);
    if (node?.isLeaf) {
      treeRef.value.remove(node);
    }
    if (keys.includes(":")) {
      keys = keys.replace(new RegExp(`:${key}$`), "");
    }
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
        setRedisValue(
          newData.key,
          newData.value,
          selectDB.value,
          newData.expire
        ).then(res => {
          message("添加成功~ Ciallo～(∠・ω< )⌒☆'", {
            customClass: "el",
            type: "success"
          });
          if (treeType.value === "2") {
            addTreeV2Key(res.data.key);
            treeRefV2.value.setData(treeV2Data);
          } else {
            addTreeKey(res.data.key);
          }
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
  const ref = treeType.value === "2" ? treeRefV2 : treeRef;
  checkedKeys.value = ref.value
    .getCheckedNodes()
    .filter(i => ref.value.getNode(i.key)?.isLeaf)
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
  deleteRedisKeys(checkedKeys.value, selectDB.value).then(res => {
    if (res.success) {
      message("删除成功~ Ciallo～(∠・ω< )⌒☆'", {
        customClass: "el",
        type: "success"
      });
      if (treeType.value === "2") {
        for (const i of res.data.successKeys) {
          delTreeV2Key(i);
        }
        treeRefV2.value.setData(treeV2Data);
      } else {
        for (const i of res.data.successKeys) {
          delTreeKey(i);
        }
      }
    }
  });
};

const filterNode = (value: string, data: any) => {
  return data.key.includes(value);
};

const addTreeV2Key = (nodeKey: string) => {
  const keys = nodeKey.split(":");
  let current = treeV2Data;

  for (let i = 0; i < keys.length; i++) {
    const partKey = keys.slice(0, i + 1).join(":");
    let node = current.find(item => item.key === partKey);

    if (!node) {
      node = {
        label: keys[i],
        key: partKey,
        children: []
      };
      current.push(node);
    }

    current = node.children;
  }
};

const delTreeV2Key = (nodeKey: string) => {
  const path = findKeyPath(treeV2Data, nodeKey);
  if (path) {
    deleteValueByPath(treeV2Data, path);
  }
};

const findKeyPath = (data: getRedisKeysData[], key: string) => {
  for (const i in data) {
    const node = data[i];
    if (node.key === key) {
      return [i];
    }

    if (node.children && node.children.length > 0) {
      const childPath = findKeyPath(node.children, key);
      if (childPath) {
        return [i, ...childPath];
      }
    }
  }
  return null;
};

const deleteValueByPath = (data: getRedisKeysData[], path: number[]) => {
  let current = data;

  for (let i = 0; i < path.length - 1; i++) {
    current = current[path[i]].children;
  }

  current.splice(path[path.length - 1], 1);

  cleanupEmptyNodes(data, path.slice(0, -1));
};

const cleanupEmptyNodes = (data: getRedisKeysData[], path: number[]) => {
  if (path.length === 0) return;

  let current = data;

  for (let i = 0; i < path.length - 1; i++) {
    current = current[path[i]].children;
  }

  const parentIndex = path[path.length - 1];
  const parentNode = current[parentIndex];

  if (parentNode.children.length === 0) {
    current.splice(parentIndex, 1);
    cleanupEmptyNodes(data, path.slice(0, -1));
  }
};
</script>
