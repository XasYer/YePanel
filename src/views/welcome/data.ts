import { dayjs, cloneDeep, getRandomIntBetween } from "./utils";
import GroupLine from "@iconify-icons/ri/group-line";
import Question from "@iconify-icons/ri/question-answer-line";
import CheckLine from "@iconify-icons/ri/chat-check-line";
import Smile from "@iconify-icons/ri/star-smile-line";
import { getHomeData } from "@/api/home";

const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

/** 需求人数、提问数量、解决数量、用户满意度 */
const chartData = [
  {
    icon: GroupLine,
    bgColor: "#effaff",
    color: "#41b6ff",
    duration: 2200,
    name: "需求人数",
    value: 36000,
    // percent: "+88%",
    data: [100, 100] // 平滑折线图数据
  },
  {
    icon: Question,
    bgColor: "#fff5f4",
    color: "#e85f33",
    duration: 1600,
    name: "提问数量",
    value: 16580,
    // percent: "+70%",
    data: [100, 100]
  },
  {
    icon: CheckLine,
    bgColor: "#eff8f4",
    color: "#26ce83",
    duration: 1500,
    name: "解决数量",
    value: 16499,
    // percent: "+99%",
    data: [100, 100]
  },
  {
    icon: Smile,
    bgColor: "#f6f4fe",
    color: "#7846e5",
    duration: 1500,
    name: "用户满意度",
    value: 100,
    // percent: "+100%",
    data: [100, 100]
  }
];

const getChartData = async () => {
  const { data } = await getHomeData();
  for (let i = 0; i < data.chartData.length; i++) {
    chartData[i].name = data.chartData[i].name;
    chartData[i].value = data.chartData[i].value;
    // chartData[i].percent = chart[i].percent
    // chartData[i].data = chart[i].data
  }
  return {
    ...data,
    chartData
  };
};

/** 数据统计 */
const tableData = Array.from({ length: 30 }).map((_, index) => {
  return {
    id: index + 1,
    requiredNumber: getRandomIntBetween(13500, 19999),
    questionNumber: getRandomIntBetween(12600, 16999),
    resolveNumber: getRandomIntBetween(13500, 17999),
    satisfaction: getRandomIntBetween(95, 100),
    date: dayjs().subtract(index, "day").format("YYYY-MM-DD")
  };
});

/** 最新动态 */
const latestNewsData = cloneDeep(tableData)
  .slice(0, 14)
  .map((item, index) => {
    return Object.assign(item, {
      date: `${dayjs().subtract(index, "day").format("YYYY-MM-DD")} ${days[dayjs().subtract(index, "day").day()]}`
    });
  });

export { getChartData, tableData, latestNewsData };
