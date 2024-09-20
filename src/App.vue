<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <ReDialog />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ElConfigProvider } from "element-plus";
import { ReDialog } from "@/components/ReDialog";
import zhCn from "element-plus/es/locale/lang/zh-cn";

let OriginTitile = document.title;
let titleTime;
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    OriginTitile = document.title;
    document.title = "我才不是柚子厨呢";
    clearTimeout(titleTime);
  } else {
    document.title = "Ciallo～(∠・ω< )⌒☆";
    titleTime = setTimeout(() => {
      document.title = OriginTitile;
    }, 2000);
  }
});

export default defineComponent({
  name: "app",
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    ReDialog
  },
  computed: {
    currentLocale() {
      return zhCn;
    }
  }
});
</script>
