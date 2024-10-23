<template>
  <div>
    <el-row :gutter="24">
      <el-col
        v-motion
        v-loading="loading.countChart"
        class="mb-[18px]"
        :xl="16"
        :xs="24"
        :md="24"
        :sm="24"
        :lg="12"
      >
        <el-card class="bar-card" shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">消息统计</span>
            <div>
              <el-popover
                placement="left-start"
                title="设置"
                :width="300"
                trigger="click"
              >
                <template #reference>
                  <el-button
                    class="mr-2"
                    :icon="Setting"
                    @click="settingVisible = !settingVisible"
                  />
                </template>
                <template #default>
                  <div class="flex mb-2">
                    <el-text class="w-[80px]">饼图样式</el-text>
                    <el-select v-model="select.style">
                      <el-option
                        v-for="item in options.style"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                  <div class="flex">
                    <el-text class="w-[80px]">饼图日期</el-text>
                    <el-select v-model="select.time" @change="handleSelect">
                      <el-option
                        v-for="item in options.time"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                </template>
              </el-popover>
              <el-segmented
                v-model="curWeek"
                :options="[
                  { label: '7天', value: 0 },
                  { label: '30天', value: 1 }
                ]"
              />
            </div>
          </div>
          <div class="flex justify-between items-start mt-3">
            <count-chart
              v-if="countChartData.time.length"
              :sent="
                curWeek == 0
                  ? countChartData.sent.slice(-7)
                  : countChartData.sent
              "
              :recv="
                curWeek == 0
                  ? countChartData.recv.slice(-7)
                  : countChartData.recv
              "
              :time="
                curWeek == 0
                  ? countChartData.time.slice(-7)
                  : countChartData.time
              "
              :plugin="
                curWeek == 0
                  ? countChartData.plugin.slice(-7)
                  : countChartData.plugin
              "
            />
            <el-result
              v-else
              icon="info"
              :title="`未开启消息统计`"
              class="h-[350px] w-full"
            >
              <template #sub-title>
                <p>
                  如果需要此统计, 请在stats.yaml中设置countChart中任意一项为true
                </p>
              </template>
            </el-result>
          </div>
        </el-card>
      </el-col>

      <el-col
        v-for="item in sortKeys"
        :key="item.key"
        v-loading="loading.rankChart"
        class="mb-[18px]"
        :xl="8"
        :xs="24"
        :md="24"
        :sm="24"
        :lg="12"
      >
        <el-card shadow="never">
          <div>
            <div class="flex justify-between">
              <el-tooltip
                class="box-item"
                effect="light"
                :content="item.desc"
                placement="right-start"
              >
                <span class="text-md font-medium flex-c">
                  {{ item.name }}
                  <el-icon class="ml-2"><InfoFilled /></el-icon
                ></span>
              </el-tooltip>
            </div>
            <div class="flex justify-between items-start mt-3">
              <rank-chart
                v-show="rankChartData[item.key].length"
                :data="rankChartData[item.key]"
                :name="item.name"
                :style="select.style"
              />
              <div
                v-if="rankChartData[item.key] === false"
                class="flex-c w-full h-[300px]"
              >
                <el-result icon="info" :title="`未开启${item.name}统计`">
                  <template #sub-title>
                    <p>如果需要此统计, 请在stats.yaml中设置 {{ item }}: true</p>
                  </template>
                </el-result>
              </div>
              <div
                v-if="rankChartData[item.key].length === 0"
                class="flex-c w-full h-[300px]"
              >
                <el-result icon="info" :title="`没有当日数据`">
                  <template #sub-title>
                    <p>{{ select.time }}</p>
                  </template>
                </el-result>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {
  getCountChartData,
  getCountChartDataResult,
  getRankChartData,
  getRankDataResult
} from "@/api/Bot";
import { ref } from "vue";
import CountChart from "./components/CountChart.vue";
import RankChart from "./components/RankChart.vue";
import { Setting, InfoFilled } from "@element-plus/icons-vue";
import dayjs from "dayjs";

const loading = ref({
  countChart: true,
  rankChart: true
});
const settingVisible = ref(false);

const getLast7Days = () => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = dayjs().subtract(i, "day").format("YYYY-MM-DD");
    dates.push({ label: date, value: date });
  }
  return dates;
};

const options = {
  style: [
    { label: "基础饼图", value: "Base" },
    { label: "南丁格尔玫瑰图", value: "Nightingale" },
    { label: "环形图", value: "Doughnut" }
  ],
  time: getLast7Days()
};

const select = ref<{
  style: "Base" | "Nightingale" | "Doughnut";
  time: string;
}>({
  style: "Base",
  time: options.time[0].value
});

const countChartData = ref<getCountChartDataResult["data"]>({
  sent: [],
  recv: [],
  plugin: [],
  time: []
});

const sortKeys = [
  {
    key: "sentType",
    name: "发送消息类型统计",
    desc: "发送消息类型的次数"
  },
  {
    key: "pluginSent",
    name: "插件发送消息排行",
    desc: "插件使用reply()方法发送消息的次数"
  },
  {
    key: "userSent",
    name: "Bot向用户发送消息排行",
    desc: "Bot向用户发送消息的次数"
  },
  {
    key: "groupSent",
    name: "Bot向群发送消息排行",
    desc: "Bot向群发送消息的次数"
  },
  {
    key: "pluginUse",
    name: "插件调用次数排行",
    desc: "插件被调用的次数, 不一定会发送消息"
  },
  { key: "userRecv", name: "接收用户消息排行", desc: "来自对应用户的消息数量" },
  { key: "groupRecv", name: "接收群消息排行", desc: "来自对应群的消息数量" }
];

const rankChartData = ref<getRankDataResult["data"]>({
  pluginUse: [],
  userSent: [],
  groupSent: [],
  pluginSent: [],
  userRecv: [],
  groupRecv: [],
  sentType: []
});

getCountChartData().then(res => {
  if (res.success) {
    countChartData.value = res.data;
  }
  loading.value.countChart = false;
});

getRankChartData(select.value.time).then(res => {
  if (res.success) {
    rankChartData.value = res.data;
  }
  loading.value.rankChart = false;
});

const handleSelect = () => {
  loading.value.rankChart = true;
  getRankChartData(select.value.time).then(res => {
    if (res.success) {
      rankChartData.value = res.data;
    }
    loading.value.rankChart = false;
  });
};

const curWeek = ref(0);
</script>
