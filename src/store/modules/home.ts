import { defineStore } from "pinia";
import { type homeDataType, store } from "../utils";

export const useHomeStore = defineStore({
  id: "pure-home",
  state: (): homeDataType => ({
    botInfo: []
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
    setBotInfo(botInfo: homeDataType["botInfo"]) {
      this.botInfo = botInfo;
    }
  }
});

export function useHomeStoreHook() {
  return useHomeStore(store);
}
