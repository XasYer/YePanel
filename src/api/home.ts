import { http } from "@/utils/http";

export type homeDataResult = {
  success: boolean;
  // TODO: 补充返回数据类型
  data: any;
};

/** 获取主页数据 */
export const getHomeData = () => {
  return http.request<homeDataResult>("post", "/get-home-data");
};

export type getSystemInfoResult = {
  success: boolean;
  data: {
    visual: {
      title: string;
      value: number;
      color: string;
      status?: "success" | "exception" | "warning";
      info: string[];
    }[];
    fsSize: {
      fs: string;
      type: string;
      size: string;
      used: string;
      available: number;
      use: number;
      mount: string;
      rw: boolean;
      color: string;
    }[];
    info: {
      key: string;
      value: string;
    }[];
    plugins: {
      name: string;
      hasPackage: boolean;
      hasGit: boolean;
    }[];
    BotName: string;
  };
};

/** 获取系统信息 */
export const getSystemInfo = () => {
  return http.request<getSystemInfoResult>("post", "/get-system-info");
};

export type getBotInfoResult = {
  success: boolean;
  data: {
    uin: string;
    avatar: string;
    nickname: string;
    version: string;
    platform: string;
    sent: number;
    recv: number;
    screenshot: number;
    time: string;
    friend: number;
    group: number;
    member: number;
  }[];
};

export const getBotInfo = () => {
  return http.request<getBotInfoResult>("post", "/get-bot-info");
};

export type getMessageInfoResult = {
  success: boolean;
  data: {
    sent: number[];
    recv: number[];
    time: string[];
  };
};

export const getMessageInfo = () => {
  return http.request<getMessageInfoResult>("post", "/get-message-info");
};

export type getUpdateLogResult = {
  success: boolean;
  data: {
    log: string[];
    url: string;
  };
  message?: string;
};

export const getUpdateLog = (plugin: string) => {
  return http.request<getUpdateLogResult>("post", "/get-update-log", {
    data: {
      plugin
    }
  });
};
