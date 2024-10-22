<template>
  <div v-loading="loading">
    <el-row :gutter="24">
      <el-col v-motion class="mb-[18px]" :span="24">
        <el-card class="bar-card" shadow="never">
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
        :key="item"
        class="mb-[18px]"
        :xl="8"
        :xs="24"
        :md="24"
        :sm="24"
      >
        <el-card shadow="never">
          <div>
            <div class="flex justify-between">
              <span class="text-md font-medium">{{
                rankTimeData[item].name
              }}</span>
              <el-select
                v-model="rankTimeData[item].select"
                style="width: 150px"
              >
                <el-option
                  v-for="i in rankTimeData[item].data"
                  :key="i"
                  :label="i"
                  :value="i"
                />
              </el-select>
            </div>
            <div class="flex justify-between items-start mt-3">
              <rank-chart
                v-show="rankTimeData[item].select"
                :data="rankChartData[item][rankTimeData[item].select]"
                :time="rankTimeData[item].select"
                :name="rankTimeData[item].name"
              />
              <div
                v-if="!rankTimeData[item].select"
                class="flex-c w-full h-[300px]"
              >
                <el-result
                  icon="info"
                  :title="`未开启${rankTimeData[item].name}统计`"
                >
                  <template #sub-title>
                    <p>如果需要此统计, 请在stats.yaml中设置 {{ item }}: true</p>
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
  getRankGroupRecv,
  getRankGroupSent,
  getRankPluginSent,
  getRankPluginUse,
  getRankUserRecv,
  getRankUserSent,
  getStatsDataResult
} from "@/api/Bot";
import { ref } from "vue";
import CountChart from "./components/CountChart.vue";
import RankChart from "./components/RankChart.vue";

const loading = ref(true);

const countChartData = ref<getStatsDataResult["data"]["countChart"]>({
  sent: [],
  recv: [],
  plugin: [],
  time: []
});

const sortKeys = [
  "pluginUse",
  "userSent",
  "groupSent",
  "pluginSent",
  "userRecv",
  "groupRecv"
];

const rankChartData = ref<getStatsDataResult["data"]["rankChart"]>({
  pluginUse: {},
  userSent: {},
  groupSent: {},
  pluginSent: {},
  userRecv: {},
  groupRecv: {}
});

const rankTimeData = ref({
  pluginUse: {
    name: "插件调用排行",
    select: "",
    data: []
  },
  pluginSent: {
    name: "插件发送消息排行",
    select: "",
    data: []
  },
  userSent: {
    name: "用户发送消息排行",
    select: "",
    data: []
  },
  userRecv: {
    name: "用户接收消息排行",
    select: "",
    data: []
  },
  groupRecv: {
    name: "群组接收消息排行",
    select: "",
    data: []
  },
  groupSent: {
    name: "群组发送消息排行",
    select: "",
    data: []
  }
});

getCountChartData().then(res => {
  if (res.success) {
    countChartData.value = res.data;
  }
  loading.value = false;
});

getRankPluginUse().then(res => {
  if (res.success) {
    rankChartData.value.pluginUse = res.data;
    const keys = Object.keys(res.data);
    rankTimeData.value.pluginUse.data = keys;
    rankTimeData.value.pluginUse.select = keys[0];
  }
  loading.value = false;
});

getRankPluginSent().then(res => {
  if (res.success) {
    rankChartData.value.pluginSent = res.data;
    const keys = Object.keys(res.data);
    rankTimeData.value.pluginSent.data = keys;
    rankTimeData.value.pluginSent.select = keys[0];
  }
  loading.value = false;
});

getRankGroupRecv().then(res => {
  if (res.success) {
    rankChartData.value.groupRecv = res.data;
    const keys = Object.keys(res.data);
    rankTimeData.value.groupRecv.data = keys;
    rankTimeData.value.groupRecv.select = keys[0];
  }
  loading.value = false;
});

getRankGroupSent().then(res => {
  if (res.success) {
    rankChartData.value.groupSent = res.data;
    const keys = Object.keys(res.data);
    rankTimeData.value.groupSent.data = keys;
    rankTimeData.value.groupSent.select = keys[0];
  }
  loading.value = false;
});

getRankUserRecv().then(res => {
  if (res.success) {
    rankChartData.value.userRecv = res.data;
    const keys = Object.keys(res.data);
    rankTimeData.value.userRecv.data = keys;
    rankTimeData.value.userRecv.select = keys[0];
  }
  loading.value = false;
});

getRankUserSent().then(res => {
  if (res.success) {
    rankChartData.value.userSent = res.data;
    const keys = Object.keys(res.data);
    rankTimeData.value.userSent.data = keys;
    rankTimeData.value.userSent.select = keys[0];
  }
  loading.value = false;
});

const curWeek = ref(1);
</script>
