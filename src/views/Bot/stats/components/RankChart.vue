<script setup lang="ts">
import { type PropType, ref, computed, watch, nextTick } from "vue";
import { useDark, useECharts } from "@pureadmin/utils";

const props = defineProps({
  data: {
    type: Array as PropType<{ value: number; name: string }[]>,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  style: {
    type: String as PropType<"Base" | "Nightingale" | "Doughnut">,
    default: "Nightingale"
  }
});

// 兼容dark主题
const { isDark } = useDark();
let theme = computed(() => {
  return isDark.value ? "dark" : "default";
});

// 初始化ECharts
const chartRef = ref();
const { setOptions } = useECharts(chartRef, { theme });

watch(
  () => [props.data, props.style],
  async () => {
    await nextTick(); // 确保DOM更新完成后再执行
    setOptions({
      color: [
        "#5470c6",
        "#91cc75",
        "#fac858",
        "#ee6666",
        "#73c0de",
        "#3ba272",
        "#fc8452",
        "#9a60b4",
        "#ea7ccc",
        "#87d0c6"
      ],
      tooltip: {
        trigger: "item",
        position: "top",
        // position: function (point, params, dom, rect, size) {
        //   const x = point[0]; // x 坐标
        //   const y = point[1]; // y 坐标
        //   const chartWidth = size.viewSize[0];
        //   const chartHeight = size.viewSize[1];

        //   // 判断 tooltip 水平方向
        //   let xPos: number;
        //   if (x < chartWidth / 2) {
        //     xPos = x + 20; // 左侧，向右偏移
        //   } else {
        //     if (dom instanceof HTMLDivElement) {
        //       xPos = x - dom.offsetWidth - 20; // 右侧，向左偏移
        //     } else {
        //       xPos = x - 100; // 预设宽度，向左偏移
        //     }
        //   }

        //   // 判断 tooltip 垂直方向
        //   let yPos: number;
        //   if (y < chartHeight / 2) {
        //     yPos = y + 20; // 上半区，向下偏移
        //   } else {
        //     yPos =
        //       y - (dom instanceof HTMLDivElement ? dom.offsetHeight : 50) - 20; // 下半区，向上偏移
        //   }

        //   // return [point[0] + 20, point[1] + 20];
        //   return point.map(i => i + 15);
        // },
        formatter: "{b}<br/>{c}次 ({d}%)"
      },
      series: [
        {
          name: props.name,
          type: "pie",
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2
          },
          ...(props.style === "Nightingale"
            ? {
                roseType: "area",
                radius: ["20%", "70%"]
              }
            : {
                ...(props.style === "Doughnut"
                  ? {
                      radius: ["40%", "75%"]
                    }
                  : {})
              }),
          data: props.data,
          label: {
            formatter: function (params) {
              const reg = /^(.*)\(([^()]*)\)$/;
              if (reg.test(params.name)) {
                const [, name, fun] = params.name.match(reg);
                return `${name}\n${fun}`;
              } else {
                return params.name;
              }
            }
          },
          labelLine: {
            length: 5, // 指引线的长度
            length2: 5, // 第二段线的长度
            minTurnAngle: 30, // 强制线条转向一定角度
            smooth: true // 平滑的指引线
          }
        }
      ]
    });
  }
);
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 300px" />
</template>
