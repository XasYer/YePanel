<template>
  <div>
    <el-row :gutter="24">
      <el-col v-motion class="mb-[18px]" :lg="16" :md="24" :xs="24" :sm="24">
        <el-card class="bar-card" shadow="never">
          <el-skeleton :loading="!messageInfo.time.length" animated>
            <template #default>
              <div class="flex justify-between">
                <span class="text-md font-medium">消息统计</span>
                <el-segmented
                  v-model="curWeek"
                  :options="[
                    { label: '7天', value: 0 },
                    { label: '30天', value: 1 }
                  ]"
                />
              </div>
              <div class="flex justify-between items-start mt-3">
                <ChartBar
                  :sent="
                    curWeek == 0 ? messageInfo.sent.slice(-7) : messageInfo.sent
                  "
                  :recv="
                    curWeek == 0 ? messageInfo.recv.slice(-7) : messageInfo.recv
                  "
                  :time="
                    curWeek == 0 ? messageInfo.time.slice(-7) : messageInfo.time
                  "
                />
              </div>
            </template>
            <template #template>
              <el-skeleton-item
                variant="h1"
                class="mb-[40px]"
                style="width: 10%"
              />
              <el-skeleton-item
                variant="rect"
                class="mb-[30px]"
                style="width: 100%; height: 300px"
              />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col :lg="8" :md="24" :xs="24" :sm="24" class="mb-[18px]">
        <el-card class="w-full h-[450px]" shadow="never">
          <el-skeleton :loading="!systemInfo.plugins.length" animated :rows="5">
            <template #default>
              <div class="flex justify-between">
                <span class="text-md font-medium">更新日志</span>
              </div>
              <div class="flex justify-between mt-3 flex-wrap">
                <el-tag
                  type="primary"
                  effect="plain"
                  class="mb-[10px] cursor-pointer"
                  size="large"
                  @click="getLog('')"
                >
                  {{ systemInfo.BotName }}-Yunzai
                </el-tag>
                <el-tag
                  v-for="item in systemInfo.plugins.filter(i => i.hasGit)"
                  :key="item.name"
                  type="primary"
                  effect="plain"
                  class="mb-[10px] cursor-pointer"
                  size="large"
                  @click="getLog(item.name)"
                >
                  {{ item.name }}
                </el-tag>
              </div>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
        v-for="i in systemInfo.visual"
        :key="i.title"
        v-motion
        class="mb-[18px]"
        :xl="3"
        :md="6"
        :sm="12"
        :xs="12"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 560
          }
        }"
      >
        <el-card
          class="h-[280px]"
          shadow="never"
          :body-style="{ padding: '10px 0' }"
          :header="i.title"
        >
          <el-skeleton :loading="!i.title" animated>
            <template #template>
              <div class="w-[30%] ml-[10%] mb-[15%] mt-[10%]">
                <el-skeleton-item />
              </div>
              <div class="flex justify-center">
                <el-skeleton-item
                  variant="circle"
                  style="width: 120px; height: 120px"
                />
              </div>
              <div class="p-[20px]">
                <el-skeleton-item />
                <el-skeleton-item />
              </div>
            </template>
            <template #default>
              <div class="flex justify-center items-center mb-[10px]">
                <el-progress
                  type="circle"
                  :percentage="i.value"
                  :stroke-width="15"
                  :color="i.color"
                  :status="i.status"
                />
              </div>
              <div
                v-for="(info, index) in i.info"
                :key="index"
                class="flex justify-center items-center"
              >
                {{ info }}
              </div>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col v-motion class="mb-[18px]" :xl="5" :md="12" :sm="12" :xs="24">
        <el-card
          shadow="never"
          class="h-[280px]"
          :header="systemInfo.fsSize.length ? 'fsSize' : undefined"
          :body-style="{ padding: '10px 20px' }"
        >
          <el-skeleton :loading="!systemInfo.fsSize.length" animated>
            <template #template>
              <div class="w-[20%] mb-[10%] mt-[7%]">
                <el-skeleton-item />
              </div>
              <el-skeleton-item class="mb-[10px]" />
              <el-skeleton-item />
            </template>
            <template #default>
              <el-scrollbar class="h-[180px]" :height="170">
                <div
                  v-for="i in systemInfo.fsSize"
                  :key="i.fs"
                  class="flex mb-[10px]"
                >
                  <el-text tag="b" style="margin-right: 10px">
                    {{ i.mount }}
                  </el-text>
                  <el-progress
                    :stroke-width="15"
                    :percentage="i.use"
                    :color="i.color"
                    text-inside
                  >
                    <div class="flex">
                      <el-text tag="b" class="relative bottom-[2px]"
                        >{{ i.used }} / {{ i.size }}</el-text
                      >
                    </div>
                  </el-progress>
                  <el-text tag="b" style="margin-left: 10px"
                    >{{ i.use }}%</el-text
                  >
                </div>
              </el-scrollbar>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col v-motion class="mb-[18px]" :xl="4" :md="6" :sm="24" :xs="24">
        <el-card
          shadow="never"
          class="h-[280px]"
          :body-style="{ padding: '10px 20px' }"
        >
          <el-skeleton
            :loading="!systemInfo.info.length"
            animated
            :rows="5"
            class="pt-[20px]"
          >
            <template #default>
              <div class="h-[280px]">
                <div
                  v-for="i in systemInfo.info"
                  :key="i.key"
                  class="flex justify-between"
                >
                  <div>
                    <el-text tag="b"> {{ i.key }}: </el-text>
                  </div>
                  <div>
                    <el-text class="text-right">{{ i.value }}</el-text>
                  </div>
                </div>
              </div>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
        v-for="item in botInfo"
        :key="item.uin"
        class="mb-[18px]"
        :xl="8"
        :md="12"
        :sm="24"
        :xs="24"
      >
        <el-card shadow="never" class="h-[170px]">
          <el-container>
            <el-aside width="80px" class="flex-c flex-col">
              <el-avatar :size="80" :src="item.avatar">
                {{ item.nickname.slice(0, 1) }}
              </el-avatar>
              <el-tag class="mt-[10px]">{{ item.platform }}</el-tag>
            </el-aside>
            <el-container>
              <el-header height="20px"
                ><el-text tag="b" style="font-size: 20px">
                  {{ item.nickname }}
                </el-text></el-header
              >
              <el-main>
                <el-tag>{{ item.version }}</el-tag>
                <el-tag>
                  <div class="flex">
                    <iconify icon="mingcute:time-fill" class="mr-[5px]" />
                    {{ item.time }}
                  </div>
                </el-tag>
                <br />
                <el-tag
                  v-for="i in [
                    {
                      key: '好友数量',
                      value: item.friend,
                      icon: 'bxs:user'
                    },
                    {
                      key: '群数量',
                      value: item.group,
                      icon: 'bxs:group'
                    },
                    {
                      key: '群成员数量',
                      value: item.member,
                      icon: 'typcn:group'
                    },
                    {
                      key: '发送消息',
                      value: item.sent,
                      icon: 'mingcute:up-fill'
                    },
                    {
                      key: '接收消息',
                      value: item.recv,
                      icon: 'mingcute:down-fill'
                    },
                    {
                      key: '截图数量',
                      value: item.screenshot,
                      icon: 'bxs:image'
                    }
                  ]"
                  :key="i.key"
                >
                  <el-tooltip
                    class="box-item"
                    effect="light"
                    :content="i.key"
                    placement="bottom"
                  >
                    <div class="flex">
                      <iconify :icon="i.icon" class="mr-[5px]" />
                      {{ i.value }}
                    </div>
                  </el-tooltip>
                </el-tag>
              </el-main>
            </el-container>
          </el-container>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { h, ref } from "vue";
import {
  getSystemInfo,
  getSystemInfoResult,
  getBotInfo,
  getBotInfoResult,
  getMessageInfo,
  getMessageInfoResult,
  getUpdateLog
} from "@/api/home";
import { IconifyIconOnline as iconify } from "@/components/ReIcon";
import ChartBar from "./components/charts/ChartBar.vue";
import { message } from "@/utils/message";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { ElLink, ElScrollbar, ElTimeline, ElTimelineItem } from "element-plus";
import { openLink } from "@pureadmin/utils";
import { useHomeStoreHook } from "@/store/modules/home";

const systemInfo = ref<getSystemInfoResult["data"]>({
  visual: Array.from({ length: 5 }, (_, index) => ({})) as any,
  fsSize: [],
  info: [],
  plugins: [],
  BotName: ""
});

getSystemInfo().then(res => {
  if (res.success) {
    systemInfo.value = res.data;
  }
});

defineOptions({
  name: "Welcome"
});

const homeStore = useHomeStoreHook();

const botInfo = ref<getBotInfoResult["data"]>([]);

getBotInfo().then(res => {
  if (res.success) {
    botInfo.value = res.data;
    homeStore.setBotInfo(res.data);
  }
});

const getLog = (name: string) => {
  getUpdateLog(name).then(res => {
    if (res.success) {
      addDialog({
        title: `${name || systemInfo.value.BotName + "-Yunzai"}更新日志`,
        width: window.innerWidth < 992 ? "90%" : "50%",
        top: "10vh",
        contentRenderer: () =>
          h(
            ElScrollbar,
            { height: "60vh", class: "mx-[20px]" },
            h(
              ElTimeline,
              {},
              res.data.log.map(i => {
                if (!i) return null;
                const [, commit, timestamp, content] =
                  /(.+?)\|\|\[(.+?)\](.+)/.exec?.(i) || [];
                return h(
                  ElTimelineItem,
                  {
                    timestamp
                  },
                  h(
                    ElLink,
                    {
                      underline: false,
                      href: `${res.data.url}/commit/${commit}`,
                      target: "_blank"
                    },
                    content
                  )
                );
              })
            )
          ),
        footerButtons: [
          {
            label: "取消",
            btnClick: ({ dialog: { options, index } }) =>
              closeDialog(options, index)
          },
          {
            label: "link",
            type: "primary",
            btnClick: () => openLink(res.data.url)
          }
        ]
      });
    } else {
      message(res.message, {
        type: "error",
        customClass: "el"
      });
    }
  });
};

const curWeek = ref(0);

const messageInfo = ref<getMessageInfoResult["data"]>({
  sent: [],
  recv: [],
  time: []
});

getMessageInfo().then(res => {
  messageInfo.value = res.data;
});
</script>

<style lang="scss" scoped>
:deep(.el-card) {
  --el-card-border-color: none;

  /* 解决概率进度条宽度 */
  .el-progress--line {
    width: 85%;
  }

  /* 解决概率进度条字体大小 */
  .el-progress-bar__innerText {
    font-size: 15px;
  }

  /* el-timeline 每一项上下、左右边距 */
  .el-timeline-item {
    margin: 0 6px;
  }
}

.el-main .el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

.main-content {
  margin: 20px 20px 0 !important;
}
</style>
