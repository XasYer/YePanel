<template>
  <el-form
    ref="formRef"
    :model="data"
    label-position="right"
    label-width="100px"
    :rules="rules"
  >
    <el-form-item label="用户名" prop="name">
      <el-input
        v-model="data.name"
        placeholder="请输入用户名"
        style="width: 90%"
      />
    </el-form-item>
    <el-form-item label="用户id" prop="userId">
      <el-input
        v-model="data.userId"
        placeholder="请输入用户id"
        style="width: 90%"
      />
    </el-form-item>
    <el-form-item label="头像链接" prop="avatar">
      <el-input
        v-model="data.avatar"
        placeholder="请输入用户头像链接(可选)"
        style="width: 90%"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { ElForm, FormRules } from "element-plus";

export interface UserProps {
  data: {
    name: string;
    userId: string;
    avatar: string;
  };
}

const formRef = ref<InstanceType<typeof ElForm>>();

const rules = ref<FormRules>({
  name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  userId: [{ required: true, message: "请输入用户id", trigger: "blur" }]
});

const props = withDefaults(defineProps<UserProps>(), {
  data: () => ({
    name: "",
    userId: "",
    avatar: ""
  })
});

const data = ref<UserProps["data"]>(props.data);

const getData = () => {
  return {
    ...data.value
  };
};

const getRef = () => formRef.value;

defineExpose({ getData, getRef });
</script>
