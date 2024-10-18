<template>
  <el-result
    v-if="loadErr"
    icon="error"
    style="height: 70vh"
    title="加载错误"
    :sub-title="loadErr"
  />
  <el-result
    v-else-if="loading"
    style="height: 70vh"
    icon="info"
    title="加载中"
  />
  <component
    :is="comp"
    v-else
    :baseUrl="getBaseUrlApi"
    :pluginName="pluginName"
    :request="request"
    :accessToken="accessToken"
  />
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { loadModule } from "vue3-sfc-loader";
import { useCodeStoreHook } from "@/store/modules/code";
import * as Vue from "vue";
import * as plusProComponents from "plus-pro-components";
import * as ElementPlus from "element-plus";
import { onErrorCaptured, ref, watch } from "vue";
import { getBaseUrlApi } from "@/api/utils";
import { http } from "@/utils/http";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import * as utils from "@pureadmin/utils";
import * as echarts from "echarts";
import { PureHttpRequestConfig, RequestMethods } from "@/utils/http/types";
import { AxiosRequestConfig } from "axios";
import { IconifyIconOnline } from "@/components/ReIcon";
import { getToken } from "@/utils/auth";

const codeStore = useCodeStoreHook();
const route = useRoute();

const pluginName = route.path.split("/")[1];
defineOptions({
  name: "plugins"
});

const request = (
  method: RequestMethods,
  url: string,
  param: AxiosRequestConfig,
  axiosConfig: PureHttpRequestConfig
) => {
  param = {
    baseURL: getBaseUrlApi() + "/" + pluginName,
    ...param
  };
  return http.request(method, url, param, axiosConfig);
};

const accessToken = getToken().accessToken;

const loadErr = ref("");
const loading = ref(true);

const moduleCache = {
  vue: Vue,
  "plus-pro-components": plusProComponents,
  "element-plus": ElementPlus,
  echarts: echarts,
  "@message": message,
  "@addDialog": addDialog,
  "@pureadmin/utils": utils,
  iconify: IconifyIconOnline
};

const componentCount = Object.keys(
  codeStore.code[pluginName].components
).length;
const loadedComponentCount = ref(0);

const loadModuleAsync = (fileName: string, target: "components" | "main") => {
  return new Promise((resolve, reject) => {
    loadModule(fileName, {
      getFile: (name: string) => {
        return codeStore.code[pluginName][target][name.replace(/.vue$/, "")];
      },
      moduleCache,
      addStyle(textContent: string) {
        const id = `${pluginName}-vue-styles`;
        let style = document.getElementById(id);
        if (!style) {
          style = Object.assign(document.createElement("style"), {
            id,
            textContent
          });
          const ref = document.head.getElementsByTagName("style")[0] || null;
          document.head.insertBefore(style, ref);
        } else {
          style.textContent = textContent;
        }
      }
    })
      .then(component => {
        console.log("loadModuleSuccess: ", fileName);
        loadedComponentCount.value++;
        resolve(component);
      })
      .catch(err => {
        console.log("err", err);
        loadErr.value = `${fileName} 加载失败: ${err.message}`;
        if (comp.value) {
          message(`${fileName} 出现错误: ${err.message}`, {
            type: "error",
            customClass: "el"
          });
        }
        reject(err);
      });
  });
};

const loadModulesInSequence = async () => {
  for (const key in codeStore.code[pluginName].components) {
    console.log("key", key);
    try {
      await loadModuleAsync(`${key}.vue`, "components");
    } catch (error) {
      console.log("???");
      return;
    }
  }
};

loadModulesInSequence();

const comp = ref(null);

watch(loadedComponentCount, () => {
  console.log("watch");
  console.log("loadedComponentCount.value", loadedComponentCount.value);
  console.log("componentCount", componentCount);
  if (loadedComponentCount.value === componentCount) {
    console.log("moduleCache", moduleCache);
    loadModuleAsync(`${route.name.toString().split("/")[1]}.vue`, "main").then(
      component => {
        console.log("compSuccess");
        loading.value = false;
        comp.value = component;
      }
    );
  }
});

// loadModule(`${pluginName}.vue`, options)
//   .then(component => {
//     comp.value = component;
//   })
//   .catch(err => {});

onErrorCaptured((err, vm, info) => {
  const componentName = vm.$options.__name;
  console.log("ErrcomponentName", err);
  // if (componentName === "edit") {
  //   loadErr.value = err.toString();
  // }
  return false;
});

console.log("code", codeStore.code[pluginName]);
</script>
