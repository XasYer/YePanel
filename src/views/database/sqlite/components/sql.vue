<template>
  <codemirror
    v-model="sql"
    placeholder="请输入sql语句..."
    :style="{ maxHeight: '500px', marginBottom: '10px', height: '200px' }"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="extensions"
  />
  <div class="mb-[10px] flex justify-end">
    <el-button type="success" @click="handleExecuteSql"> 执行 </el-button>
  </div>

  <codemirror
    v-model="data"
    placeholder="结果展示框"
    :style="{ maxHeight: '500px' }"
    :autofocus="true"
    :disabled="true"
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
import { executeSql, getRedisValue } from "@/api/database";

const props = defineProps({
  path: {
    type: String,
    required: true
  }
});

const extensions = [json(), oneDark];

const sql = ref("");

const data = ref("");

const handleExecuteSql = () => {
  if (!sql.value) {
    return;
  }
  executeSql(props.path, sql.value).then(res => {
    if (res.success) {
      data.value = JSON.stringify(res.data, null, 2);
    } else {
      message(res.message, {
        type: "error",
        customClass: "el"
      });
    }
  });
};
</script>
