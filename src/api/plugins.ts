import { http } from "@/utils/http";

export type getGroupListResult = {
  success: boolean;
  data: any;
};

export type getFriendListResult = {
  success: boolean;
  data: any;
};

/** 获取群聊列表 */
export const getGroupList = () => {
  return http.request<getGroupListResult>("get", "/get-group-list");
};

/** 获取好友列表 */
export const getFriendList = () => {
  return http.request<getFriendListResult>("get", "/get-friend-list");
};

export type setSettingDataResult = {
  success: boolean;
  message: string;
};

export const setSettingData = (plugin: string, data: any) => {
  return http.request<setSettingDataResult>("post", `/setting/${plugin}`, {
    data
  });
};

export type getGuobaDataResult = {
  success: boolean;
  data: {
    [key: string]: any;
  };
  schemas: {
    [key: string]: any;
  };
};

export const getGuobaData = (plugin: string) => {
  return http.request<getGuobaDataResult>("get", `/get-guoba-data`, {
    params: {
      plugin
    }
  });
};