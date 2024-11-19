<template>
  <el-form
    ref="formRef"
    :model="data"
    label-position="right"
    label-width="100px"
    :rules="rules"
  >
    <el-form-item label="host" prop="host">
      <el-input
        v-model="data.host"
        placeholder="请输入host"
        style="width: 90%"
      />
    </el-form-item>
    <el-form-item label="port" prop="port">
      <el-input-number v-model="data.port" placeholder="port" />
    </el-form-item>
    <el-form-item label="database" prop="database">
      <el-input-number v-model="data.database" placeholder="默认db" />
    </el-form-item>
    <el-form-item label="username" prop="username">
      <el-input
        v-model="data.username"
        placeholder="请输入username"
        style="width: 90%"
      />
    </el-form-item>
    <el-form-item label="password" prop="password">
      <el-input
        v-model="data.password"
        placeholder="请输入password"
        style="width: 90%"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { ElForm, FormRules } from "element-plus";

export interface CodeProps {
  data: {
    host: string;
    port: number;
    database: number;
    username: string;
    password: string;
  };
}

const formRef = ref<InstanceType<typeof ElForm>>();

const rules = ref<FormRules>({
  host: [{ required: true, message: "请输入host", trigger: "blur" }],
  port: [{ required: true, message: "请输入port", trigger: "blur" }],
  database: [{ required: true, message: "请输入database", trigger: "blur" }]
});

const props = withDefaults(defineProps<CodeProps>(), {
  data: () => ({
    host: "",
    port: 6379,
    database: 0,
    username: "",
    password: ""
  })
});

const data = ref<CodeProps["data"]>(props.data);

const getData = () => {
  return {
    ...data.value
  };
};

const getRef = () => formRef.value;

defineExpose({ getData, getRef });
</script>
