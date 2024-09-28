import { http } from "@/utils/http";

export type getSettingResult = {
  success: boolean;
  data: any;
};

export type setSettingResult = {
  success: boolean;
  message?: string;
};

/** 获取设置数据 */
export const getSettingData = () => {
  return http.request<getSettingResult>("post", "/get-setting-data");
};

export const setSetting = data => {
  return http.request<setSettingResult>("post", "/set-setting", {
    data: { data }
  });
};
