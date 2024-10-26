<template>
  <el-card>
    <el-row :gutter="10" class="mb-[10px]">
      <el-col :sm="12" :lg="4" :xs="24" class="mb-[10px] mr-[10px]">
        <el-text>行高: </el-text>
        <el-input-number
          v-model="lineSpace"
          class="mx-[10px]"
          :min="1"
          :max="100"
          @change="handleLineSpace"
        />
      </el-col>
      <el-col :sm="12" :lg="6" :xs="24">
        <el-text class="w-[70px]"> 日志等级: </el-text>
        <el-select v-model="level" style="width: 150px" class="mr-[10px]">
          <el-option
            v-for="(item, index) in Object.keys(LevelNumber)"
            :key="item"
            :label="item"
            :value="index"
          />
        </el-select>
      </el-col>
    </el-row>
    <div class="h-[70vh]">
      <terminal
        ref="terminalRef"
        name="terminal"
        :context="path"
        :enable-fold="false"
        :line-space="lineSpace"
        :show-header="false"
        :enable-default-command="false"
        @exec-cmd="onExecCmd"
      />
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { createWS } from "@/api/utils";
import { onMounted, onUnmounted, ref } from "vue";
import Terminal, { Message, TerminalAsk } from "vue-web-terminal";
import { TerminalFlash } from "vue-web-terminal";
import Convert from "ansi-to-html";
import "./black.css";

defineOptions({
  name: "realtimeLog"
});

const convert = new Convert();

const color = {
  tarce: "#999999",
  debug: "#00aaff",
  info: "#00cc00",
  mark: "#999999",
  warn: "#ffaa00",
  error: "#ff0000",
  fatal: "#990000"
};

const showLevel = {
  trace: "TRCE",
  debug: "DBUG",
  info: "INFO",
  warn: "WARN",
  error: "ERRR",
  fatal: "FATL",
  mark: "MARK"
};

const LevelNumber = Object.keys(color).reduce((acc, cur) => {
  acc[cur] = Object.keys(color).indexOf(cur);
  return acc;
}, {});

const level = ref(2);

const lineSpace = ref(15);

const handleLineSpace = (value: number) => (lineSpace.value = value);

const terminalRef = ref();

const path = ref("");

const authPass = ref(false);

const socket = ref<WebSocket>(null);
const flash = ref();

const objectToString = (obj: any) => {
  if (Array.isArray(obj)) {
    return "[ " + obj.map(objectToString).join(" ") + " ]";
  }
  if (typeof obj === "object") {
    try {
      return `{${Object.entries(obj)
        .map(([key, value]) => {
          const formattedValue =
            typeof value === "string" ? `'${value}'` : value;
          return ` ${key}: ${formattedValue} `;
        })
        .join(", ")}}`;
    } catch (error) {
      return String(obj);
    }
  }
  return obj;
};

const timer = ref<NodeJS.Timeout>(null);

const onExecCmd = (
  key: string,
  command: string,
  success: (
    message?: Message | Array<Message> | string | TerminalFlash | TerminalAsk
  ) => void,
  failed: (message: string) => void,
  name: string
) => {
  if (command === "Ciallo～(∠・ω< )⌒☆" && !authPass.value) {
    terminalRef.value.pushMessage({
      type: "normal",
      content: "Authentication in progress..."
    });
    socket.value = createWS("realtimeLog", {
      onmessage: event => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "logger") {
            if (level.value <= LevelNumber[data.level]) {
              const html = `<span style="color:${color[data.level]}">[${data.timestamp}][${showLevel[data.level]}]</span>${data.logs
                .map((i: any) => {
                  if (typeof i === "string") {
                    i = convert.toHtml(i).replace(/#00A/g, "#4169e1");
                    return i;
                  } else {
                    return objectToString(i);
                  }
                })
                .join(" ")
                .replace(/\n|\r/g, "<br>")
                .replace(/(?<=^|>)([^<]*?)(?=<|$)/g, (i: string) => {
                  return i.replace(/ /g, "&nbsp;");
                })}`;
              terminalRef.value.pushMessage({
                type: "html",
                content: html
              });
            }
          } else if (data.type === "console") {
            const html = data.logs
              .map((i: any) => {
                if (typeof i === "string") {
                  return convert.toHtml(i);
                } else {
                  return objectToString(i);
                }
              })
              .join(" ")
              .replace(/\n|\r/g, "<br>")
              .replace(/(?<=^|>)([^<]*?)(?=<|$)/g, (i: string) => {
                return i.replace(/ /g, "&nbsp;");
              });
            terminalRef.value.pushMessage({
              type: "html",
              content: html
            });
          }
        } catch (error) {
          terminalRef.value.pushMessage({
            type: "table",
            content: error,
            class: "error",
            tag: "error"
          });
          flash.value.finish();
          return;
        }
      },
      onopen: () => {
        authPass.value = true;
        terminalRef.value.pushMessage({
          type: "normal",
          content: "Authentication successful.",
          class: "success"
        });
        // 心跳
        timer.value = setInterval(() => {
          socket.value.send(
            JSON.stringify({
              time: Math.floor(Date.now() / 1000),
              action: "ping"
            })
          );
        }, 30000);
      },
      onerror: error => {
        terminalRef.value.pushMessage({
          type: "table",
          content: error,
          class: "error",
          tag: "error"
        });
        flash.value.finish();
        socket.value = null;
      },
      onclose: event => {
        terminalRef.value.pushMessage({
          type: "normal",
          content: "终端已关闭！",
          class: "error",
          tag: "error"
        });
        flash.value.finish();
        socket.value = null;
        clearInterval(timer.value);
        timer.value = null;
      }
    });
  } else {
    const parts = command.split(" ");
    const args = parts.slice(1);
    const commandObject = {
      action: "execute",
      command: key,
      args: args,
      workingDirectory: path.value
    };
    if (socket.value.readyState === 1) {
      socket.value.send(JSON.stringify(commandObject));
      flash.value = new TerminalFlash();
      success(flash.value);
    } else {
      failed("终端连接异常！");
    }
  }
};

onMounted(() => {
  terminalRef.value.execute("Ciallo～(∠・ω< )⌒☆");
});

onUnmounted(() => {
  socket.value && socket.value.close();
});
</script>
