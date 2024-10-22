import { http } from "@/utils/http";

export type ChartData = {
  name: string;
  value: number;
};
export type RankData = {
  [key: string]: ChartData[];
};

export type getRankDataResult = {
  success: boolean;
  data: RankData;
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
  return http.request<getCountChartDataResult>("post", "/get-stats-count-data");
};

export const getRankPluginUse = () => {
  return http.request<getRankDataResult>("post", "/get-stats-rank-plugin-use");
};

export const getRankPluginSent = () => {
  return http.request<getRankDataResult>("post", "/get-stats-rank-plugin-sent");
};

export const getRankGroupRecv = () => {
  return http.request<getRankDataResult>("post", "/get-stats-rank-group-recv");
};

export const getRankGroupSent = () => {
  return http.request<getRankDataResult>("post", "/get-stats-rank-group-sent");
};

export const getRankUserRecv = () => {
  return http.request<getRankDataResult>("post", "/get-stats-rank-user-recv");
};

export const getRankUserSent = () => {
  return http.request<getRankDataResult>("post", "/get-stats-rank-user-sent");
};
