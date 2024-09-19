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
    cpu: {
      currentLoad: number;
      manufacturer: string;
      cores: number;
      speed: number;
      fullLoad: number;
      color: string;
    };
    ram: {
      currentLoad: number;
      total: string;
      active: string;
      color: string;
    };
    swap: {
      currentLoad: number;
      total: string;
      used: string;
      color: string;
    };
    gpu?: {
      utilizationGpu: number;
      vendor: string;
      temperatureGpu: number;
      memoryTotal: string;
      memoryUsed: string;
      color: string;
    };
  };
};

/** 获取系统信息 */
export const getSystemInfo = () => {
  return http.request<getSystemInfoResult>("post", "/get-system-info", {
    data: { token: getToken().accessToken }
  });
};
