<template>
  <div class="flex">
    <el-tooltip content="修改会重命名,覆盖新值" placement="right">
      <div
        class="w-[90px] content-center text-center border bg-[#f5f7fa] text-[#909399] rounded border-[#dcdfe6] h-[32px]"
      >
        key:
      </div>
    </el-tooltip>
    <el-input
      v-model="data.key"
      placeholder="key"
      class="mb-[20px]"
      style="width: 80%"
    />
  </div>
  <div class="flex">
    <el-tooltip content="-1为不过期,不动则不变,单位秒" placement="right">
      <div
        class="w-[90px] content-center text-center border bg-[#f5f7fa] text-[#909399] rounded border-[#dcdfe6] h-[32px]"
      >
        过期时间:
      </div>
    </el-tooltip>
    <el-input-number
      v-model="data.expire"
      placeholder="key"
      class="mb-[20px]"
    />
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

const extensions = [json(), oneDark];

export interface CodeProps {
  data: {
    key: string;
    value: string;
    expire: number;
  };
}

const props = withDefaults(defineProps<CodeProps>(), {
  data: () => ({ key: "", value: "", expire: -1 })
});

const data = ref<CodeProps["data"]>(props.data);

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
