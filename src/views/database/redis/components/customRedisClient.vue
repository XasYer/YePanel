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
  };
}

const formRef = ref<InstanceType<typeof ElForm>>();

const rules = ref<FormRules>({
  host: [{ required: true, message: "请输入host", trigger: "blur" }],
  port: [{ required: true, message: "请输入port", trigger: "blur" }],
  database: [{ required: true, message: "请输入database", trigger: "blur" }]
});

const props = withDefaults(defineProps<CodeProps>(), {
  data: () => ({ host: "", port: 6379, database: 0 })
});

const data = ref<CodeProps["data"]>(props.data);

const getData = () => {
  return {
    host: data.value.host,
    port: data.value.port,
    database: data.value.database
  };
};

const getRef = () => formRef.value;

defineExpose({ getData, getRef });
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
