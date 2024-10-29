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

export type PluginInfo = {
  title: string;
  name: string;
  link: string;
  desc: string;
  authors: {
    name: string;
    link: string;
  }[];
};

export type getPluginDataResult = {
  success: boolean;
  data: {
    main: PluginInfo[];
    function: PluginInfo[];
    game: PluginInfo[];
    wordgame: PluginInfo[];
    install: string[];
  };
};

export const getPluginList = () => {
  return http.request<getPluginDataResult>("get", "/get-plugin-index-list");
};

export type getPluginReadmeResult = {
  success: boolean;
  data: string;
  message: string;
};

export const getPluginReadme = (link: string) => {
  return http.request<getPluginReadmeResult>("get", "/get-plugin-readme", {
    params: {
      link
    }
  });
};

export const installPlugin = (link: string, name?: string, branch?: string) => {
  return http.request<{ success: boolean; message?: string }>(
    "post",
    "/install-plugin",
    {
      data: {
        link,
        name,
        branch
      }
    }
  );
};

export const uninstallPlugin = (name: string) => {
  return http.request<{ success: boolean; message?: string }>(
    "post",
    "/uninstall-plugin",
    {
      data: {
        name
      }
    }
  );
};
