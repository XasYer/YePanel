<template>
  <el-tag v-if="multiple" class="cursor-pointer" @click="handleClick">
    已配置 0 项
  </el-tag>
  <div v-else class="flex justify-between items-center">
    <el-descriptions :border="true" :column="1">
      <el-descriptions-item label="Username">kooriookami</el-descriptions-item>
    </el-descriptions>
    <el-button type="danger" :icon="Delete" circle class="ml-5" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Delete } from "@element-plus/icons-vue";

const multiple = ref(false);

const handleClick = () => {
};
</script>
