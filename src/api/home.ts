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
  };
};

/** 获取系统信息 */
export const getSystemInfo = () => {
  return http.request<getSystemInfoResult>("post", "/get-system-info");
};
