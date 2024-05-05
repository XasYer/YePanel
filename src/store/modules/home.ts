import { defineStore } from "pinia";
import {
  type homeDataType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import {
  type homeDataResult,
  getHomeData,
} from "@/api/home";
import { useMultiTagsStoreHook } from "./multiTags";
import { setBaseUrlApi } from '@/api/utils'

export const useUserStore = defineStore({
  id: "pure-home",
  state: (): homeDataType => ({
    // 今日统计
    todayData: {},
    // 月度统计
    monthData: {},
  }),
  actions: {
    /** 存储头像 */
    setTodayData(todayData: object) {
      this.todayData = todayData;
    },
    /** 存储用户名 */
    setMonthData(monthData: object) {
      this.monthData = monthData;
    },
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
