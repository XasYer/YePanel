import { http } from "@/utils/http";
import { getToken } from "@/utils/auth";

export type homeDataResult = {
  success: boolean;
  // TODO: 补充返回数据类型
  data: any;
};

/** 获取主页数据 */
export const getHomeData = () => {
  return http.request<homeDataResult>("post", "/get-home-data", {
    data: { token: getToken().accessToken }
  });
};

export type getSystemInfoResult = {
  success: boolean;
  data: {
    title: string;
    value: number;
    color: string;
    status?: "success" | "exception" | "warning";
    info: string[];
  }[];
};

/** 获取系统信息 */
export const getSystemInfo = () => {
  return http.request<getSystemInfoResult>("post", "/get-system-info", {
    data: { token: getToken().accessToken }
  });
};
