<template>
  <el-menu
    :collapse="isCollapse"
    default-active="Alice"
    @select="handleSelectMenu"
  >
    <el-menu-item @click="addUser">
      <iconify icon="gridicons:add" :heigth="40" :width="40" class="mx-[5px]" />
      <template #title>添加用户</template>
    </el-menu-item>
    <el-menu-item @click="addCustomUser">
      <iconify icon="gridicons:add" :heigth="40" :width="40" class="mx-[5px]" />
      <template #title>添加自定义用户</template>
    </el-menu-item>
    <el-scrollbar :height="`${height}px`">
      <el-menu-item
        v-for="item in userList"
        :key="item.userId"
        :index="item.userId"
      >
        <el-avatar :size="40" class="mx-[5px]" :src="item.avatar">
          {{ item.name.slice(0, 1) }}
        </el-avatar>
        <template #title>{{ item.name }}</template>
      </el-menu-item>
    </el-scrollbar>
  </el-menu>
</template>

<script lang="ts" setup>
import { IconifyIconOnline as iconify } from "@/components/ReIcon";
import { ref } from "vue";

interface Props {
  isCollapse: boolean;
  userList: { userId: string; name: string; avatar?: string }[];
  handleSelectMenu: (key: string) => void;
  addUser: () => void;
  addCustomUser: () => void;
  height: number;
}
defineProps<Props>();
</script>

<style scoped>
.is-active {
  background-color: #f2f2f2 !important;
}

.el-menu-item:hover {
  background-color: #c5e1ff !important;
}

.el-menu-item {
  height: 70px !important;
  line-height: 70px !important;
}
</style>
