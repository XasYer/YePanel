<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :xs="24" :lg="5" class="mb-[10px]">
        <div class="flex-c">
          <el-text class="w-[60px]">数据源</el-text>
          <el-select v-model="selectLog" placeholder="" @change="handleSelect">
            <el-option
              v-for="item in logList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
      </el-col>
      <el-col v-loading="loading" :span="24">
        <el-scrollbar height="600px">
          <el-timeline class="pl-[10px]">
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :color="activity.color"
              :timestamp="activity.timestamp"
            >
              <div v-html="activity.content" />
            </el-timeline-item>
          </el-timeline>
        </el-scrollbar>
      </el-col>
    </el-row>
  </el-card>
</template>

<script lang="ts" setup>
import { getLogContent, getLogList } from "@/api/system";
import { message } from "@/utils/message";
import dayjs from "dayjs";
import { ref } from "vue";
import Convert from "ansi-to-html";

const convert = new Convert();

const activities = ref<{ timestamp: string; color: string; content: string }[]>(
  []
);

const color = {
  MARK: "#999999",
  WARN: "#ffaa00",
  ERRO: "#ff0000"
};

const handleSelect = (value: string) => {
  console.log(value);
  getLogData();
};

const loading = ref(false);

const logList = ref<string[]>([]);
const selectLog = ref("");
// select选择事件如果选中error.log弹出tip和二次确认
getLogList().then(res => {
  logList.value = res.data.reverse();
});

const getLogData = () => {
  loading.value = true;
  getLogContent(selectLog.value).then(res => {
    if (res.success) {
      let line = "";
      const lines = res.data.split("\n").reduce((acc, cur) => {
        if (cur.startsWith("[")) {
          if (line) {
            acc.push(getLineInfo(line));
          }
          line = cur;
        } else if (line) {
          line += "\n" + cur;
        } else {
          line = cur;
        }
        return acc;
      }, []);
      if (line) {
        lines.push(getLineInfo(line));
      }
      activities.value = lines;
    } else {
      message("获取日志失败: " + res.message, {
        type: "error",
        customClass: "el"
      });
    }
    loading.value = false;
  });
};

const getLineInfo = (line: string) => {
  const reg = /^\[(.*?)\]\[(.*?)\]([\s\S]*)/;
  const match = line.match(reg);
  if (match) {
    return {
      timestamp: match[1],
      color: color[match[2]],
      content: convert
        .toHtml(
          match[3]
            .replace(/\r$/, "")
            .replace(/\n|\r/g, "<br/>")
            .replace(/\s|\t/g, "&nbsp;&nbsp;")
        )
        .replace(/#00A/g, "#4169e1")
        .replace(/#FFF/g, "#606266")
        .replace("<br/><br/>", "<br/>")
    };
  } else {
    return {};
  }
};
</script>
