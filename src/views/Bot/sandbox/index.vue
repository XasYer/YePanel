<template>
  <el-card v-if="loading" class="h-[700px] flex-c">
    <el-result icon="info" title="加载中..." />
  </el-card>
  <el-card v-else class="h-[700px] p-0" body-style="padding: 0;">
    <el-container>
      <el-aside :width="isCollapse ? '60px' : '200px'">
        <el-menu
          :collapse="isCollapse"
          default-active="Alice"
          @select="handleSelectMenu"
        >
          <el-menu-item @click="addUser">
            <iconify
              icon="gridicons:add"
              :heigth="40"
              :width="40"
              class="mx-[5px]"
            />
            <template #title>添加用户</template>
          </el-menu-item>
          <el-scrollbar height="630px">
            <el-menu-item
              v-for="item in userList"
              :key="item.userId"
              :index="item.userId"
            >
              <el-avatar :size="40" class="mx-[5px]">
                {{ item.name.slice(0, 1) }}
              </el-avatar>
              <template #title>{{ item.name }}</template>
            </el-menu-item>
          </el-scrollbar>
        </el-menu>
      </el-aside>

      <el-container>
        <el-main>
          <el-tabs v-if="selectUser" v-model="activeName">
            <el-scrollbar ref="messageScrollbarRef" height="520px">
              <el-tab-pane
                v-for="item in [
                  { name: 'private', label: '私聊' },
                  { name: 'group', label: '群聊' }
                ]"
                :key="item.name"
                :label="item.label"
                :name="item.name"
              >
                <div
                  v-for="msg in item.name === 'private'
                    ? msgData[item.name][selectUser]
                    : msgData[item.name]"
                  :key="msg.message"
                  class="flex mb-[10px]"
                >
                  <div>
                    <el-avatar :src="msg.avatar" :size="40">
                      {{ msg.name.slice(0, 1) }}
                    </el-avatar>
                  </div>
                  <div class="ml-[20px]">
                    <div>
                      <el-text tag="b"> {{ msg.name }} </el-text>
                    </div>
                    <component :is="msg.message" />
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="设置" name="setting">
                <PlusForm
                  v-model="state"
                  :columns="columns"
                  inline-message
                  label-position="right"
                  class="mt-5"
                  labelWidth="100px"
                  :col-props="{ span: 13, lg: 13, sm: 24, xs: 24 }"
                  :hasFooter="false"
                />
              </el-tab-pane>
            </el-scrollbar>
          </el-tabs>
          <div v-else class="flex-c w-full h-[90%]">
            <el-result
              icon="warning"
              title="请选择用户"
              sub-title="请在左侧选择用户"
            />
          </div>
        </el-main>

        <el-footer
          v-show="activeName !== 'setting' && selectUser"
          height="80px"
          class="flex w-full items-center"
        >
          <el-scrollbar style="width: 100%">
            <el-input
              v-model="msg"
              type="textarea"
              placeholder="请输入消息内容"
              :rows="3"
              resize="none"
              @keydown="handleKeyDown"
            />
          </el-scrollbar>
        </el-footer>
      </el-container>
    </el-container>
  </el-card>
</template>

<script setup lang="ts">
import { ElImage, ElMenu, ElScrollbar, ElText } from "element-plus";
import {
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  defineComponent,
  DefineComponent,
  toRaw
} from "vue";
import { IconifyIconOnline as iconify } from "@/components/ReIcon";
import {
  type FieldValues,
  FieldValueType,
  PlusColumn,
  PlusForm,
  PlusFormGroupRow
} from "plus-pro-components";
import { useUserStoreHook } from "@/store/modules/user";
import { message } from "@/utils/message";
import { createWS } from "@/api/utils";

defineOptions({
  name: "sandbox"
});

const userStore = useUserStoreHook();
// 左侧用户列表
const isCollapse = ref(window.innerWidth < 992);
const updateWidth = () => {
  isCollapse.value = window.innerWidth < 992;
};

/** 可添加的用户 */
const nameList = [
  "Ben",
  "Chris",
  "David",
  "Emma",
  "Frank",
  "Grace",
  "Henry",
  "Isabel",
  "Jack",
  "Kevin",
  "Lucy",
  "Michael",
  "Nancy",
  "Olivia",
  "Paul",
  "Quinn",
  "Ryan",
  "Sarah",
  "Tom",
  "Ursula",
  "Victor",
  "William",
  "Xavier",
  "Yvonne",
  "Zoe"
];
/** tabs选中的 */
const activeName = ref("private");
/** 当前选中的用户 */
const selectUser = ref("Alice");
/** 左侧用户列表 */
const userList = ref([
  {
    name: "Alice",
    selfId: userStore.uin,
    userId: "Alice"
  }
]);
// 切换tabs和用户时,滚动到底部
watch([activeName, selectUser], () => {
  nextTick(() => {
    const bottom = messageScrollbarRef.value.wrapRef.scrollHeight - 520;
    messageScrollbarRef.value.setScrollTop(bottom);
  });
});
/** 添加用户 */
const addUser = () => {
  const userId = nameList.shift();
  if (!userId) {
    message("没有更多用户了", {
      type: "warning",
      customClass: "el"
    });
    return;
  }
  userList.value.push({
    name: userId,
    selfId: userStore.uin,
    userId
  });
  permission.value[userId] = "user";
  msgData.value.private[userId] = [];
};
/** 发送方式, 全部用户生效 */
const sendType = ref(0);
/** 用户权限 */
const permission = ref<{
  [key: string]: "owner" | "admin" | "user" | "master";
}>({
  Alice: "master"
});
// 选中的用户
const handleSelectMenu = (index: string) => {
  selectUser.value = index;
  state.value = {
    sendType: sendType.value,
    permission: permission.value[index] || "user"
  };
};

const msgData = ref<{
  private: {
    [key: string]: {
      name: string;
      avatar?: string;
      message: DefineComponent;
    }[];
  };
  group: { name: string; avatar?: string; message: DefineComponent }[];
}>({
  private: {
    Alice: []
  },
  group: []
});

const messageScrollbarRef = ref<InstanceType<typeof ElScrollbar>>(null);
const msg = ref("");

/**
 * 从后端接收到消息时
 * 方案1: 对应用户出现徽章,点击用户之后翻到最底或出现固钉,点击固钉可以翻到最低,还要实时刷新徽章数量,比如手动往下翻
 * 方案2: 如果是当前用户则翻到最底,不是当前用户就不管
 *
 * 先用第二种
 */
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    event.preventDefault();
    if (
      (state.value.sendType === 1 && event.ctrlKey) ||
      (state.value.sendType === 0 && !event.ctrlKey)
    ) {
      socket.value.send(
        JSON.stringify({
          type: "message",
          uin: userStore.uin,
          userId: selectUser.value,
          groupId: activeName.value === "group" ? "sandbox.group" : undefined,
          content: msg.value,
          permission: permission.value[selectUser.value]
        })
      );
      const target =
        activeName.value === "private"
          ? msgData.value.private[selectUser.value]
          : msgData.value.group;
      const input = msg.value
        .replace(/\n|\r/g, "<br>")
        .replace(/\s|\t/g, "&nbsp;");
      target.push({
        name: selectUser.value,
        message: defineComponent({
          render() {
            return h("div", { class: "message" }, input);
          }
        })
      });
      msg.value = "";
      nextTick(() => {
        const bottom = messageScrollbarRef.value.wrapRef.scrollHeight - 520;
        messageScrollbarRef.value.setScrollTop(bottom);
      });
    } else {
      const textarea = event.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      msg.value =
        msg.value.substring(0, start) + "\n" + msg.value.substring(end);
      textarea.setSelectionRange(start, start);
    }
  }
};

const state = ref({
  sendType: sendType.value,
  permission: "master"
});

const columns: PlusColumn[] = [
  {
    // 群主只能有一个
    label: "用户权限",
    prop: "permission",
    valueType: "radio",
    options: [
      {
        label: "群主",
        value: "owner"
      },
      {
        label: "管理员",
        value: "admin"
      },
      {
        label: "普通用户",
        value: "user"
      },
      {
        label: "主人",
        value: "master"
      }
    ]
  },
  {
    label: "发送方式",
    prop: "sendType",
    valueType: "radio",
    options: [
      {
        label: "enter",
        value: 0
      },
      {
        label: "ctrl+enter",
        value: 1
      }
    ]
  }
];
const loading = ref(true);
const socket = ref<WebSocket>(null);
onMounted(() => {
  window.addEventListener("resize", updateWidth);
  socket.value = createWS("sandbox", {
    onopen(ev) {
      socket.value.send(
        JSON.stringify({
          type: "create",
          uin: userStore.uin,
          nickname: userStore.nickname,
          avatar: userStore.avatar
        })
      );
      loading.value = false;
    },
    onmessage(event) {
      const data = JSON.parse(event.data);
      const { type, id, content } = data;
      const message = [];
      for (const i of Array.isArray(content) ? content : [content]) {
        switch (i.type) {
          case "text":
            message.push(
              h("div", {
                innerHTML: i.text
                  .replace(/\n|\r/g, "<br>")
                  .replace(/\s|\t/g, "&nbsp;")
              })
            );
            break;
          case "image":
            message.push(
              h(ElImage, {
                src: i.file,
                fit: "contain",
                previewSrcList: [i.file],
                style: "height: 400px"
              })
            );
            break;
          default:
            message.push(h("div", { innerHTML: "[暂不支持本消息类型]" }));
        }
      }
      const value: { name: string; avatar?: string; message: DefineComponent } =
        {
          name: userStore.nickname,
          avatar: userStore.avatar,
          message: defineComponent({
            render() {
              return h("div", { class: "message" }, message);
            }
          })
        };
      switch (type) {
        case "friend":
          msgData.value.private[id].push(value);
          break;
        case "group":
          msgData.value.group.push(value);
          break;
      }
      if (type === "group" || id === selectUser.value) {
        nextTick(() => {
          const bottom = messageScrollbarRef.value.wrapRef.scrollHeight - 520;
          messageScrollbarRef.value.setScrollTop(bottom);
        });
      }
    },
    onclose() {
      if (!loading.value) {
        message("连接已关闭", {
          type: "error",
          customClass: "el"
        });
        loading.value = true;
      }
    }
  });
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateWidth);
  loading.value = true;
  socket.value.close?.();
});
</script>

<style scoped>
.message {
  position: relative;
  padding: 10px;
  width: fit-content;
  border-radius: 10px;
  background-color: #dcdcdc;
  word-break: break-all;
}

.message::before {
  content: "";
  position: absolute;
  right: 100%;
  top: 12px;
  width: 10px;
  height: 12px;
  border: 0 solid transparent;
  border-bottom-width: 8px;
  border-bottom-color: currentColor;
  border-radius: 0 0 0 20px;
  color: #dcdcdc;
}

.is-active {
  background-color: #f2f2f2 !important;
}

.el-menu-item:hover {
  background-color: #c5e1ff !important;
}

.el-menu-item {
  height: 70px !important;
  line-height: 70px !important;
}
</style>
