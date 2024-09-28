<template>
  <div class="flex items-center justify-center h-[75vh]">
    <el-image
      v-if="props.type === 'image'"
      :src="data.url"
      class="h-full"
      :preview-src-list="[data.url]"
    />
    <codemirror
      v-else-if="props.type === 'code'"
      v-model="data.content"
      :style="{ width: '100%', marginBottom: '20px', height: '100%' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Codemirror } from "vue-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { message } from "@/utils/message";
import languages from "./lang-code";
import { lezer } from "@codemirror/lang-lezer";

const extMap = {
  bf: "brainfuck",
  clj: "clojure",
  coffee: "coffeescript",
  erl: "erlang",
  cjs: "javascript",
  js: "javascript",
  mjs: "javascript",
  jl: "julia",
  txt: "lezer",
  md: "markdown",
  pas: "pascal",
  pl: "perl",
  ps1: "powershell",
  py: "python",
  rb: "ruby",
  rs: "rust",
  scm: "scheme",
  sh: "shell",
  styl: "stylus",
  ts: "typescript",
  vbs: "vbscript",
  yml: "yaml"
};

const extensions = ref([]);

export interface Props {
  type: "code" | "image";
  data: {
    url?: string;
    ext?: string;
    content?: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  type: "code",
  data: () => ({})
});
const data = ref<Props["data"]>(props.data);

if (props.type === "code") {
  const ext = extMap[props.data.ext] || props.data.ext;
  Promise.all([languages[ext]?.()])
    .then(res => {
      const lang = res[0];
      extensions.value = [lang?.default?.language?.() || lezer(), oneDark];
    })
    .catch(() => {
      extensions.value = [lezer(), oneDark];
    });
}

const getData = () => {
  return {
    ...data.value
  };
};

defineExpose({ getData });
</script>
