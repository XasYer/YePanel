<script setup lang="ts">
import { useDark, useECharts } from "@pureadmin/utils";
import { type PropType, ref, computed, watch, nextTick } from "vue";

const props = defineProps({
  userData: {
    type: Array as PropType<Array<number>>,
    default: () => []
  },
  groupData: {
    type: Array as PropType<Array<number>>,
    default: () => []
  },
  receiveMsgData: {
    type: Array as PropType<Array<number>>,
    default: () => []
  },
  sendMsgData: {
    type: Array as PropType<Array<number>>,
    default: () => []
  },
  weekData: {
    type: Array as PropType<Array<string>>
  }
});

const { isDark } = useDark();

const theme = computed(() => (isDark.value ? "dark" : "light"));

const chartRef = ref();
const { setOptions } = useECharts(chartRef, {
  theme
});

watch(
  () => props,
  async () => {
    await nextTick(); // 确保DOM更新完成后再执行
    setOptions({
      container: ".bar-card",
      color: ["#41b6ff", "#e85f33"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "none"
        }
      },
      grid: {
        top: "20px",
        left: "50px",
        right: "80px"
      },
      legend: {
        data: ["上行人数", "上行群数", "上行消息", "下行消息"],
        textStyle: {
          color: "#606266",
          fontSize: "0.875rem"
        },
        bottom: 0
      },
      xAxis: [
        {
          type: "category",
          data: props.weekData,
          axisLabel: {
            fontSize: "0.875rem"
          },
          axisPointer: {
            type: "shadow"
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            fontSize: "0.875rem"
          },
          splitLine: {
            show: false // 去网格线
          }
        },
        {
          type: "value",
          position: "right",
          alignTicks: true,
          axisLabel: {
            fontSize: "0.875rem"
          },
          splitLine: {
            show: false // 去网格线
          }
        }
      ],
      series: [
        {
          name: "上行人数",
          type: "bar",
          barWidth: 10,
          itemStyle: {
            color: "#41b6ff",
            borderRadius: [10, 10, 0, 0]
          },
          data: props.userData,
          markPoint: {
            data: [{ type: "average", name: "平均值" }]
          }
        },
        {
          name: "上行群数",
          type: "bar",
          barWidth: 10,
          itemStyle: {
            color: "#e86033ce",
            borderRadius: [10, 10, 0, 0]
          },
          data: props.groupData,
          markPoint: {
            data: [{ type: "average", name: "平均值" }]
          }
        },
        {
          name: "上行消息",
          type: "line",
          yAxisIndex: 1,
          itemStyle: {
            color: "#8B864E"
          },
          data: props.receiveMsgData,
          markPoint: {
            data: [{ type: "average", name: "平均值" }]
          }
        },
        {
          name: "下行消息",
          type: "line",
          yAxisIndex: 1,
          itemStyle: {
            color: "#FFC125"
          },
          data: props.sendMsgData,
          markPoint: {
            data: [{ type: "average", name: "平均值" }]
          }
        }
      ]
    });
  },
  {
    deep: true,
    immediate: true
  }
);
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 365px" />
</template>
