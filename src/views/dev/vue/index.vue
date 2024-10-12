<template>
  <div>
    <el-row :gutter="24">
      <el-col :xl="12" :xs="24" :lg="24">
        <el-card class="h-[80vh]">
          <codemirror
            v-model="code"
            placeholder="please input your code..."
            :style="{ height: '75vh', fontSize: '16px' }"
            :autofocus="true"
            :indent-with-tab="true"
            :tab-size="2"
            :extensions="extensions"
            @ready="updateWidget"
            @change="updateWidget"
          />
        </el-card>
      </el-col>
      <el-col :xl="12" :xs="24" :lg="24">
        <el-result
          v-if="widgetErr"
          icon="error"
          style="height: 70vh"
          title="加载错误"
          :sub-title="widgetErr"
        />
        <el-result
          v-else-if="widgetLoad"
          style="height: 70vh"
          icon="info"
          title="加载中"
        />
        <component
          :is="widget"
          v-else
          :request="request"
          :baseUrl="getBaseUrlApi()"
          pluginName="Dev"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { loadModule } from "vue3-sfc-loader";
import { Codemirror } from "vue-codemirror";
import { vue as langVue } from "@codemirror/lang-vue";
import { oneDark } from "@codemirror/theme-one-dark";
import { nextTick, onErrorCaptured, ref } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import * as Vue from "vue";
import * as plusProComponents from "plus-pro-components";
import * as ElementPlus from "element-plus";
import { AxiosRequestConfig } from "axios";
import { PureHttpRequestConfig, RequestMethods } from "@/utils/http/types";
import { getBaseUrlApi } from "@/api/utils";
import { http } from "@/utils/http";
import * as utils from "@pureadmin/utils";
import * as echarts from "echarts";
import { IconifyIconOnline } from "@/components/ReIcon";
defineOptions({
  name: "vue"
});

const request = (
  method: RequestMethods,
  url: string,
  param: AxiosRequestConfig,
  axiosConfig: PureHttpRequestConfig
) => http.request(method, url, param, axiosConfig);

const code = ref(`<template>
  <el-card> Ciallo～(∠・ω< )⌒☆ </el-card>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { ElCard } from "element-plus";
import * as echarts from "echarts";
// https://icon-sets.iconify.design/
// 使用: <iconify icon="mdi:home" :width="24" :height="24" />
import iconify from "iconify"
// https://pure-admin-utils.netlify.app/
import * as utils from "@pureadmin/utils"
// Too more please pr or issue...

const props = defineProps({
  // method, url, param, axiosConfig
  // 如果需要访问其他api, 可以设置param.baseURL
  request: Function,
  // 登录时填写的url
  baseUrl: String,
  // 插件名 如果有的话
  pluginName: String
})

</${"script"}>`);
const widget = ref();
const widgetErr = ref("");
const widgetLoad = ref(true);
const extensions = [langVue(), oneDark];

const updateWidget = () => {
  widgetLoad.value = true;
  widgetErr.value = "";
  nextTick(() => {
    const options = {
      getFile: () => code.value,
      moduleCache: {
        vue: Vue,
        "plus-pro-components": plusProComponents,
        "element-plus": ElementPlus,
        echarts: echarts,
        "@message": message,
        "@addDialog": addDialog,
        "@pureadmin/utils": utils,
        iconify: IconifyIconOnline
      },
      addStyle(textContent) {
        let style = document.getElementById("dev-vue-styles");
        if (!style) {
          style = Object.assign(document.createElement("style"), {
            id: "dev-vue-styles",
            textContent
          });
          const ref = document.head.getElementsByTagName("style")[0] || null;
          document.head.insertBefore(style, ref);
        } else {
          style.textContent = textContent;
        }
      }
    };
    loadModule("edit.vue", options)
      .then(component => {
        widget.value = component;
        widgetLoad.value = false;
      })
      .catch(err => {
        widgetErr.value = err.toString();
      });
  });
};

onErrorCaptured((err, vm, info) => {
  const componentName = vm.$options.__name;
  if (componentName === "edit") {
    widgetErr.value = err.toString();
  }
  return false;
});
</script>
