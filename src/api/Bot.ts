import { http } from "@/utils/http";

export type ChartData = {
  name: string;
  value: number;
};
export type RankData = {
  [key: string]: ChartData[];
};

export type getStatsDataResult = {
  success: boolean;
  data: {
    countChart: {
      sent: number[];
      recv: number[];
      plugin: number[];
      time: string[];
    };
    rankChart: {
      pluginUse: RankData;
      pluginSent: RankData;
      userSent: RankData;
      userRecv: RankData;
      groupRecv: RankData;
      groupSent: RankData;
    };
  };
};

export const getStatsData = () => {
  return http.request<getStatsDataResult>("post", "/get-stats-data");
};
