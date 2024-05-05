import { http } from "@/utils/http";
import { getToken } from "@/utils/auth";

export type homeDataResult = {
  success: boolean;
  // TODO: 补充返回数据类型
  data: any
};


/** 获取主页数据 */
export const getHomeData = () => {
  return http.request<homeDataResult>("post", "/getHomeData", { data: { token: getToken().accessToken } });
};

