<template>
  <el-row justify="center">
    <el-col :lg="20" :xs="24">
      <PlusForm
        ref="ruleFormRef"
        v-model="data"
        :rules="rules"
        :columns="columns"
        inline-message
        labelWidth="120px"
        label-position="right"
        :has-footer="false"
      />
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { h, ref } from "vue";
import { PlusColumn, PlusForm } from "plus-pro-components";
import { FormRules, FormItemRule } from "element-plus";

export interface DataProps {
  addInstall: (plugin: string) => void;
  removeInstall: (plugin: string) => void;
}

const rules = ref<FormRules>({
  link: [
    {
      required: true,
      message: "请输入正确的插件链接",
      pattern: /^https?:\/\//
    }
  ]
});
const columns = ref<PlusColumn[]>([
  {
    label: "插件链接",
    prop: "link",
    valueType: "input",
    fieldProps: {
      placeholder: "插件地址"
    }
  },
  {
    label: "插件名称",
    prop: "name",
    valueType: "input",
    fieldProps: {
      placeholder: "安装后的文件名(可选)"
    }
  },
  {
    label: "安装分支",
    prop: "branch",
    valueType: "input",
    fieldProps: {
      placeholder: "安装的分支(可选)"
    }
  }
]);
const data = ref<{
  link: string;
  name: string;
  branch: string;
}>({
  link: "",
  name: "",
  branch: ""
});
const ruleFormRef = ref();
function getRef() {
  return ruleFormRef.value.formInstance;
}

function getData() {
  return data.value;
}

defineExpose({ getRef, getData });
</script>
