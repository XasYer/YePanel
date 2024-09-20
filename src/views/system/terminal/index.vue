<template>
  <el-card>
    <div class="h-[70vh]">
      <terminal
        ref="terminalRef"
        name="terminal"
        :context="path"
        :init-log="init_log"
        :show-header="false"
        :enable-default-command="false"
        @exec-cmd="onExecCmd"
      />
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { getBaseUrlApi } from "@/api/utils";
import { getToken } from "@/utils/auth";
import { onMounted, onUnmounted, ref } from "vue";
import Terminal, { Message, TerminalAsk } from "vue-web-terminal";
import { TerminalFlash } from "vue-web-terminal";
import "vue-web-terminal/lib/theme/dark.css";

defineOptions({
  name: "terminal"
});

const init_log: Array<Message> = [
  {
    type: "normal",
    content: "Terminal Initializing ..."
  }
];

const terminalRef = ref();

const path = ref("");

const authPass = ref(false);

const socket = ref<WebSocket>(null);
const flash = ref();

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
    const url = getBaseUrlApi()
      .replace(/^https?/, "ws")
      .replace(/qqbot$/, "qqbot-ws-terminal");
    socket.value = new WebSocket(url);
    socket.value.onopen = () => {
      socket.value.send(
        JSON.stringify({
          action: "create",
          command: getToken().accessToken
        })
      );
    };
    socket.value.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "auth") {
          if (data.success) {
            authPass.value = true;
            terminalRef.value.pushMessage({
              type: "normal",
              content: "Authentication successful.",
              class: "success"
            });
            terminalRef.value.pushMessage({
              type: "normal",
              content: `tip: 不可以实现SSH客户端, 不能处理tsab、vim等带有其他键盘、鼠标、窗口行为的 ANSI 控制码的指令`,
              class: "info"
            });
            path.value = data.path;
            success();
          } else {
            terminalRef.value.pushMessage({
              type: "error",
              content: "Authentication failed.",
              class: "error",
              tag: "error"
            });
            flash.value.finish();
            socket.value = null;
          }
          return;
        } else if (data.type === "output") {
          terminalRef.value.pushMessage({
            type: "normal",
            content: data.content
          });
        } else if (data.type === "error") {
          terminalRef.value.pushMessage({
            type: "normal",
            content: data.content,
            class: "error",
            tag: "error"
          });
        } else if (data.type === "directory") {
          path.value = data.content;
        } else if (data.type === "close") {
          flash.value.finish();
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
    };
    // 监听错误
    socket.value.onerror = function (error) {
      terminalRef.value.pushMessage({
        type: "table",
        content: error,
        class: "error",
        tag: "error"
      });
      flash.value.finish();
      socket.value = null;
    };
    // 连接关闭时触发
    socket.value.onclose = function (event) {
      terminalRef.value.pushMessage({
        type: "normal",
        content: "终端已关闭！",
        class: "error",
        tag: "error"
      });
      flash.value.finish();
      socket.value = null;
    };
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

// 定义全局按键事件的处理函数
const handleGlobalKeydown = event => {
  if (event.ctrlKey && event.keyCode === 67) {
    event.preventDefault();
    socket.value &&
      socket.value.send(
        JSON.stringify({
          action: "terminate"
        })
      );
  }
};

// 在组件挂载时添加全局事件监听器
onMounted(() => {
  terminalRef.value.execute("Ciallo～(∠・ω< )⌒☆");
  window.addEventListener("keydown", handleGlobalKeydown);
});

// 在组件卸载时移除全局事件监听器
onUnmounted(() => {
  socket.value && socket.value.close();
  window.removeEventListener("keydown", handleGlobalKeydown);
});
</script>
