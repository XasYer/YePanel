<template>
  <div class="mb-[10px]">
    <div class="flex">
      <div class="prepend">key:</div>
      <el-input
        v-model="data.key"
        placeholder="key"
        @input="isRandom = false"
      />
      <el-button class="ml-[10px]" @click="checkExists">
        <iconify
          icon="material-symbols:frame-inspect"
          :width="20"
          :height="20"
        />
      </el-button>
      <el-button v-if="isRandom" @click="resetRandomKey">
        <iconify icon="carbon:reset" :width="20" :height="20" />
      </el-button>
      <el-button v-else @click="randomKey">
        <iconify icon="mingcute:random-fill" :width="20" :height="20" />
      </el-button>
    </div>
    <el-text style="color: #909399">会覆盖旧的值</el-text>
  </div>
  <div class="mb-[10px]">
    <div class="flex">
      <div class="prepend">过期时间:</div>
      <el-input-number v-model="data.expire" placeholder="key" />
    </div>
    <el-text style="color: #909399">-1为不过期,单位秒</el-text>
  </div>
  <codemirror
    v-model="data.value"
    placeholder="请输入数据..."
    :style="{ maxHeight: '500px', marginBottom: '20px' }"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="extensions"
  />
</template>

<script setup lang="ts">
import { h, ref } from "vue";
import { Codemirror } from "vue-codemirror";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { message } from "@/utils/message";
import { IconifyIconOnline as iconify } from "@/components/ReIcon";
import { buildUUID } from "@pureadmin/utils";
import { getRedisValue } from "@/api/database";

const extensions = [json(), oneDark];

export interface CodeProps {
  data: {
    key: string;
    value: string;
    expire: number;
    db: string;
  };
}

const props = withDefaults(defineProps<CodeProps>(), {
  data: () => ({ key: "", value: "", expire: -1, db: "0" })
});

const data = ref<CodeProps["data"]>(props.data);

const checkExists = () => {
  if (data.value.key) {
    getRedisValue(data.value.key, data.value.db).then(res => {
      if (res.success) {
        if (res.data.expire === -2) {
          message("该key可用", {
            customClass: "el",
            type: "success"
          });
        } else {
          message("该key已存在", {
            customClass: "el",
            type: "warning"
          });
        }
      } else {
        message(`查询失败: ${res.message}`, {
          customClass: "el",
          type: "error"
        });
      }
    });
  }
};

const isRandom = ref(false);

const randomKey = () => {
  data.value.key += buildUUID();
  isRandom.value = true;
};

const resetRandomKey = () => {
  data.value.key = data.value.key.slice(0, -32);
  isRandom.value = false;
};

const checkCode = () => {
  if (data.value.value.startsWith("{") || data.value.value.startsWith("[")) {
    try {
      JSON.parse(data.value.value);
    } catch (error) {
      message(error.message, { customClass: "el", type: "error" });
      return false;
    }
  }
  if (!data.value.key) {
    message("请输入key", { customClass: "el", type: "error" });
    return false;
  }
  return true;
};

const getData = () => {
  return {
    key: data.value.key,
    value: data.value.value,
    expire: data.value.expire
  };
};

defineExpose({ getData, checkCode });
</script>

<style scoped>
.prepend {
  width: 90px;
  align-content: center;
  text-align: center;
  border-width: 1px;
  background-color: #f5f7fa;
  color: #909399;
  border-color: #dcdfe6;
  height: 32px;
  border-radius: 0.25rem;
}
</style>
