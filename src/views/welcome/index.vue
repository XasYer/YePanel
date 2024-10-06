<template>
  <div>
    <el-row :gutter="24">
      <el-col
        v-for="i in systemInfo.visual"
        :key="i.title"
        v-motion
        class="mb-[18px]"
        :xl="3"
        :md="12"
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

      <el-col
        v-motion
        class="mb-[18px]"
        :xl="5"
        :md="12"
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
            delay: 640
          }
        }"
      >
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
              <div
                class="h-[180px] overflow-hidden w-full"
                @mouseenter="increaseScrollbarWidth"
                @mouseleave="resetScrollbarWidth"
              >
                <div
                  v-for="i in systemInfo.fsSize"
                  :key="i.fs"
                  class="flex mb-[10px]"
                >
                  <el-text tag="b" style="margin-right: 10px">{{
                    i.mount
                  }}</el-text>
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
              </div>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
        v-motion
        class="mb-[18px]"
        :xl="4"
        :md="12"
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
            delay: 640
          }
        }"
      >
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
              <div
                class="h-[280px]"
                @mouseenter="increaseScrollbarWidth"
                @mouseleave="resetScrollbarWidth"
              >
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
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getSystemInfo, getSystemInfoResult } from "@/api/home";

const systemInfo = ref<getSystemInfoResult["data"]>({
  visual: Array.from({ length: 5 }, (_, index) => ({})) as any,
  fsSize: [],
  info: []
});

getSystemInfo().then(res => {
  if (res.success) {
    systemInfo.value = res.data;
  }
});

defineOptions({
  name: "Welcome"
});

// 滚动条 6px
const increaseScrollbarWidth = (event: any) => {
  console.log(event.target.getBoundingClientRect());
  if (systemInfo.value.fsSize.length > 6) {
    console.log(event.target.getBoundingClientRect());
    event.target.style.width = `${event.target.getBoundingClientRect().width + 6}px`;
  }
};

const resetScrollbarWidth = (event: any) => {
  event.target.style.width = `100%`;
};
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

  /* 隐藏 el-scrollbar 滚动条 */
  .el-scrollbar__bar {
    display: none;
  }

  /* el-timeline 每一项上下、左右边距 */
  .el-timeline-item {
    margin: 0 6px;
  }
}

.main-content {
  margin: 20px 20px 0 !important;
}

.overflow-hidden:hover {
  overflow: auto;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: #f0f0f0;
  border-radius: 10px;
  position: absolute;
  left: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #bec1c5;
}
</style>
