import { http } from "@/utils/http";

export type ChartData = {
  name: string;
  value: number;
}[];

export type getRankDataResult = {
  success: boolean;
  data: {
    pluginUse: ChartData | false;
    pluginSent: ChartData | false;
    userSent: ChartData | false;
    userRecv: ChartData | false;
    groupRecv: ChartData | false;
    groupSent: ChartData | false;
    sentType: ChartData | false;
  };
};

export type getCountChartDataResult = {
  success: boolean;
  data: {
    sent: number[];
    recv: number[];
    plugin: number[];
    time: string[];
  };
};

/** 数量统计表 */
export const getCountChartData = () => {
  return http.request<getCountChartDataResult>("get", "/get-stats-count-data");
};

export const getRankChartData = (time: string) => {
  return http.request<getRankDataResult>("get", "/get-stats-rank-data", {
    params: {
      time
    }
  });
};
