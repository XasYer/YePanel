import { http } from "@/utils/http";

export type homeDataResult = {
  success: boolean;
  // TODO: 补充返回数据类型
  data: any;
};

/** 获取主页数据 */
export const getHomeData = () => {
  return http.request<homeDataResult>("get", "/get-home-data");
};

export type SystemInfo = {
  visual: {
    title: string;
    value: number;
    color: string;
    status?: "success" | "exception" | "warning";
    info: string[];
    model?: string;
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

export type getSystemInfoResult = {
  success: boolean;
  data: {
    info: SystemInfo["info"];
    plugins: SystemInfo["plugins"];
    BotName: SystemInfo["BotName"];
  };
};

/** 获取系统信息 */
export const getSystemInfo = () => {
  return http.request<getSystemInfoResult>("get", "/get-system-info");
};

export type getSystemSIResult = {
  success: boolean;
  data: SystemInfo["visual"];
};

export const getSystemCpu = () => {
  return http.request<getSystemSIResult>("get", "/get-system-cpu");
};

export const getSystemRam = () => {
  return http.request<getSystemSIResult>("get", "/get-system-ram");
};

export const getSystemNode = () => {
  return http.request<getSystemSIResult>("get", "/get-system-node");
};

export const getSystemGpu = () => {
  return http.request<getSystemSIResult>("get", "/get-system-gpu");
};

export const getSystemFs = () => {
  return http.request<{
    success: boolean;
    data: SystemInfo["fsSize"];
  }>("get", "/get-system-fs");
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
  return http.request<getBotInfoResult>("get", "/get-bot-info");
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
  return http.request<getMessageInfoResult>("get", "/get-message-info");
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
  return http.request<getUpdateLogResult>("get", "/get-update-log", {
    params: {
      plugin
    }
  });
};
