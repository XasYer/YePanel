<template>
  <el-scrollbar :height="props.height" class="w-full">
    <el-timeline>
      <el-timeline-item
        v-for="item in updateLog"
        :key="item.commit"
        :timestamp="item.timestamp"
      >
        <el-link
          :underline="false"
          :href="`${props.link}/commit/${item.commit}`"
          target="_blank"
        >
          {{ item.content }}
        </el-link>
      </el-timeline-item>
    </el-timeline>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

const props = defineProps({
  log: {
    type: Array<string>,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  height: {
    type: String,
    default: "600px"
  }
});

const handleLog = (log: string[]) => {
  return log.map(i => {
    if (!i) return null;
    const [, commit, timestamp, content] =
      /(.+?)\|\|\[(.+?)\](.+)/.exec?.(i) || [];
    return {
      commit,
      timestamp,
      content
    };
  });
};

const updateLog = ref<
  Array<{ commit: string; timestamp: string; content: string }>
>(handleLog(props.log));

watch(
  () => props.log,
  () => {
    updateLog.value = handleLog(props.log);
  }
);
</script>
