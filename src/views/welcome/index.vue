<script setup lang="ts">
import { useUserStore } from "@/store/modules/user";
const userStore = useUserStore();
defineOptions({
  name: "Welcome"
});
</script>

<template>
  <h1>Hello, {{ userStore.nickname }}</h1>
</template>
