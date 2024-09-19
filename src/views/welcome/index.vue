<template>
  <div>
    <el-row :gutter="24" justify="space-around">
      <re-col
        v-for="(item, index) in chartData"
        :key="index"
        v-motion
        class="mb-[18px]"
        :value="4"
        :md="12"
        :sm="12"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 80 * (index + 1)
          }
        }"
      >
        <el-card class="line-card" shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">
              {{ item.name }}
            </span>
            <div
              class="w-8 h-8 flex justify-center items-center rounded-md"
              :style="{
                backgroundColor: isDark ? 'transparent' : item.bgColor
              }"
            >
              <!-- <IconifyIconOffline
                :icon="item.icon"
                :color="item.color"
                width="18"
              /> -->
              <span v-if="item.total">总计</span>
            </div>
          </div>
          <div class="flex justify-between items-end mt-3">
            <div class="w-1/2">
              <ReNormalCountTo
                :duration="2000"
                :fontSize="'1.6em'"
                :startVal="100"
                :endVal="item.value"
              />
              <!-- <p class="font-medium text-green-500">{{ item.percent }}</p> -->
            </div>
            <div>{{ item.total }}</div>
            <!-- <ChartLine
              v-if="item.data.length > 1"
              class="!w-1/2"
              :color="item.color"
              :data="item.data"
            />
            <ChartRound v-else class="!w-1/2" /> -->
          </div>
        </el-card>
      </re-col>

      <re-col
        v-motion
        class="mb-[18px]"
        :value="16"
        :xs="24"
        :sm="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400
          }
        }"
      >
        <el-card class="bar-card" shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">最近用户量</span>
            <Segmented v-model="curWeek" :options="optionsBasis" />
          </div>
          <div class="flex justify-between items-start mt-3">
            <ChartBar
              :userData="weekChartData[curWeek]?.userData"
              :groupData="weekChartData[curWeek]?.groupData"
              :weekData="weekChartData[curWeek]?.weekData"
              :receiveMsgData="weekChartData[curWeek]?.receiveMsgData"
              :sendMsgData="weekChartData[curWeek]?.sendMsgData"
            />
          </div>
        </el-card>
      </re-col>

      <re-col
        v-motion
        class="mb-[18px]"
        :value="8"
        :xs="24"
        :sm="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 480
          }
        }"
      >
        <el-card shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">调用统计</span>
          </div>
          <div class="flex justify-between items-start mt-3">
            <ChartPie :chartData="callStat" />
          </div>
        </el-card>
      </re-col>

      <re-col
        v-motion
        class="mb-[18px]"
        :value="10"
        :xs="24"
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
        <!-- <el-card shadow="never" class="h-[580px]">
          <div class="flex justify-between">
            <span class="text-md font-medium">数据统计</span>
          </div>
          <WelcomeTable class="mt-3" />
        </el-card> -->
        <el-card v-if="systemInfo" class="bar-card" shadow="never">
          <div class="flex justify-around">
            <div>
              <el-progress
                type="circle"
                :percentage="systemInfo.cpu.currentLoad"
                :stroke-width="15"
                :color="systemInfo.cpu.color"
              />
              <div class="flex justify-center items-center">CPU</div>
              <div class="flex justify-center items-center">
                {{ systemInfo.cpu.manufacturer }}&nbsp;{{
                  systemInfo.cpu.cores
                }}核&nbsp; {{ systemInfo.cpu.speed }}GHz
              </div>
              <div class="flex justify-center items-center">
                CPU满载率 {{ systemInfo.cpu.fullLoad }}%
              </div>
            </div>
            <div>
              <el-progress
                type="circle"
                :percentage="systemInfo.ram.currentLoad"
                :stroke-width="15"
                :color="systemInfo.ram.color"
              />
              <div class="flex justify-center items-center">RAM</div>
              <div class="flex justify-center items-center">
                {{ systemInfo.ram.active }} / {{ systemInfo.ram.total }}
              </div>
            </div>
            <div>
              <el-progress
                type="circle"
                :percentage="systemInfo.swap.currentLoad"
                :stroke-width="15"
                :color="systemInfo.swap.color"
              />
              <div class="flex justify-center items-center">SWAP</div>
              <div class="flex justify-center items-center">
                {{ systemInfo.swap.used }} / {{ systemInfo.swap.total }}
              </div>
            </div>
            <div v-if="systemInfo.gpu">
              <el-progress
                type="circle"
                :percentage="systemInfo.gpu.utilizationGpu"
                :stroke-width="15"
                :color="systemInfo.gpu.color"
              />
              <div class="flex justify-center items-center">GPU</div>
              <div class="flex justify-center items-center">
                {{ systemInfo.gpu.memoryUsed }}GB /
                {{ systemInfo.gpu.memoryTotal }}GB
              </div>
              <div class="flex justify-center items-center">
                {{ systemInfo.gpu.vendor }}
                {{ systemInfo.gpu.temperatureGpu }}°C
              </div>
            </div>
          </div>
        </el-card>
      </re-col>

      <re-col
        v-motion
        class="mb-[18px]"
        :value="14"
        :xs="24"
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
        <!-- <el-card shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">最新动态</span>
          </div>
          <el-scrollbar max-height="504" class="mt-3">
            <el-timeline>
              <el-timeline-item
                v-for="(item, index) in latestNewsData"
                :key="index"
                center
                placement="top"
                :icon="
                  markRaw(
                    useRenderFlicker({
                      background: randomGradient({
                        randomizeHue: true
                      })
                    })
                  )
                "
                :timestamp="item.date"
              >
                <p class="text-text_color_regular text-sm">
                  {{
                    `新增 ${item.requiredNumber} 条问题，${item.resolveNumber} 条已解决`
                  }}
                </p>
              </el-timeline-item>
            </el-timeline>
          </el-scrollbar>
        </el-card> -->
      </re-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from "vue";
import ReCol from "@/components/ReCol";
import { useDark, randomGradient } from "./utils";
import WelcomeTable from "./components/table/index.vue";
import { ReNormalCountTo } from "@/components/ReCountTo";
import { useRenderFlicker } from "@/components/ReFlicker";
import { ChartBar, ChartLine, ChartRound, ChartPie } from "./components/charts";
import Segmented, { type OptionsType } from "@/components/ReSegmented";
import { getChartData } from "./data";
import { getSystemInfo, getSystemInfoResult } from "@/api/home";

const chartData = ref([]);
const weekChartData = ref<
  {
    userData: number[];
    groupData: number[];
    weekData: string[];
    receiveMsgData: number[];
    sendMsgData: number[];
  }[]
>([]);
const callStat = ref([]);
const systemInfo = ref<getSystemInfoResult["data"]>();

getChartData().then(res => {
  chartData.value = res.chartData;
  weekChartData.value = res.weekData;
  callStat.value = res.callStat;
});

getSystemInfo().then(res => {
  if (res.success) {
    systemInfo.value = res.data;
  }
});

defineOptions({
  name: "Welcome"
});

const { isDark } = useDark();

let curWeek = ref(0); // 0: 7天、1: 30天
const optionsBasis: Array<OptionsType> = [
  {
    label: "7天"
  },
  {
    label: "30天"
  }
];
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
</style>
