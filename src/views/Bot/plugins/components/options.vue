<template>
  <el-tabs v-model="activeName" class="mb-[20px]" @tab-change="handleTabChange">
    <el-tab-pane label="详情" name="info">
      <el-descriptions border :column="1">
        <el-descriptions-item label="标题">
          {{ data.info.title }}
        </el-descriptions-item>
        <el-descriptions-item label="名称">
          {{ data.info.name }}
        </el-descriptions-item>
        <el-descriptions-item label="链接">
          <el-link
            :underline="false"
            :href="data.info.link"
            target="_blank"
            type="primary"
          >
            {{ data.info.link }}
          </el-link>
        </el-descriptions-item>
        <el-descriptions-item label="作者">
          <el-link
            v-for="item in data.info.authors"
            :key="item.link"
            :underline="false"
            :href="item.link"
            target="_blank"
            :type="item.link ? 'primary' : 'default'"
            class="mr-[10px]"
          >
            {{ item.name }}
          </el-link>
        </el-descriptions-item>
        <el-descriptions-item label="描述">
          {{ data.info.desc }}
        </el-descriptions-item>
        <el-descriptions-item label="操作">
          <el-button
            v-if="!data.installed"
            type="success"
            :loading="installLoading"
            @click="install"
          >
            安装
          </el-button>
          <el-button
            v-else
            type="danger"
            :loading="uninstallLoading"
            @click="uninstall"
          >
            卸载
          </el-button>
        </el-descriptions-item>
      </el-descriptions>
    </el-tab-pane>
    <el-tab-pane label="README" name="readme" class="flex-c">
      <el-scrollbar>
        <el-result v-if="readmeLoading" icon="info" title="加载中..." />
        <el-result v-else-if="readmeError" icon="error" :title="readmeError" />
        <v-md-preview :text="readme" />
      </el-scrollbar>
    </el-tab-pane>
    <!-- <el-tab-pane v-if="data.installed" label="配置" name="setting">
      <el-scrollbar>
        <plusForm :plugin-name="data.info.name" />
      </el-scrollbar>
    </el-tab-pane> -->
    <el-tab-pane
      v-if="data.installed"
      label="更新日志"
      name="updateLog"
      class="flex-c"
    >
      <el-result v-if="updateLogLoading" icon="info" title="加载中..." />
      <el-result v-else-if="updateLogError" icon="error" :title="readmeError" />
      <timeline v-else :log="updateLog" :link="data.info.link" />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import {
  getPluginReadme,
  installPlugin,
  PluginInfo,
  uninstallPlugin
} from "@/api/Bot";
import { h, ref } from "vue";
import { getBaseUrlApi } from "@/api/utils";
import { getToken } from "@/utils/auth";
import { getUpdateLog } from "@/api/home";
import timeline from "@/views/welcome/components/timeline.vue";
import { message } from "@/utils/message";
import plusForm from "@/views/plugins/setting/components/plusForm.vue";

export interface DataProps {
  data: {
    info: PluginInfo;
    installed: boolean;
  };
  addInstall: (plugin: string) => void;
  removeInstall: (plugin: string) => void;
}

const props = withDefaults(defineProps<DataProps>(), {
  data: () => ({
    info: {
      title: "",
      desc: "",
      authors: [],
      link: "",
      name: ""
    },
    installed: false
  }),
  addInstall: () => {},
  removeInstall: () => {}
});

const data = ref<DataProps["data"]>(props.data);

const activeName = ref("info");

const readme = ref<string>("");
const readmeLoading = ref(true);
const readmeError = ref<string>("");

const updateLog = ref<string[]>([]);
const updateLogLoading = ref(true);
const updateLogError = ref<string>("");

const handleTabChange = (name: string) => {
  switch (name) {
    case "readme":
      if (!readme.value) {
        getPluginReadme(data.value.info.link).then(res => {
          readmeLoading.value = false;
          if (res.success) {
            readme.value = res.data.replace(
              /YePanel\/api\/transit\?/g,
              `${getBaseUrlApi().replace(/\/$/, "")}/api/transit?accessToken=${getToken().accessToken}&`
            );
          } else {
            readmeError.value = res.message;
          }
        });
      }
      break;
    case "updateLog":
      if (!updateLog.value.length) {
        getUpdateLog(data.value.info.name).then(res => {
          updateLogLoading.value = false;
          if (res.success) {
            updateLog.value = res.data.log;
          } else {
            updateLogError.value = res.message;
          }
        });
      }
      break;
  }
};

const installLoading = ref(false);
const uninstallLoading = ref(false);

const install = () => {
  installLoading.value = true;
  installPlugin(data.value.info.link).then(res => {
    installLoading.value = false;
    if (res.success) {
      message("安装成功~Ciallo～(∠・ω< )⌒☆", {
        type: "success",
        customClass: "el"
      });
      props.addInstall(data.value.info.name);
      data.value.installed = true;
    } else {
      message(res.message, {
        type: "error",
        customClass: "el"
      });
    }
  });
};
const uninstall = () => {
  uninstallLoading.value = true;
  uninstallPlugin(data.value.info.name).then(res => {
    uninstallLoading.value = false;
    if (res.success) {
      props.removeInstall(data.value.info.name);
      data.value.installed = false;
      message("卸载成功~Ciallo～(∠・ω< )⌒☆", {
        type: "success",
        customClass: "el"
      });
    } else {
      message("卸载失败..." + res.message, {
        type: "error",
        customClass: "el"
      });
    }
  });
};
</script>

<style scoped>
.el-tab-pane {
  height: 600px;
}
</style>
