import { defineStore } from "pinia";
import { store } from "../utils";

type stateType = {
  data: {
    [key: string]: {
      main: string[];
      components: string[];
    };
  };
};

export const useCodeStore = defineStore({
  id: "code",
  state: (): stateType => ({
    data: sessionStorage.getItem("data")
      ? JSON.parse(sessionStorage.getItem("data"))
      : {}
  }),
  actions: {
    setData(data: stateType["data"]) {
      this.data = data;
      sessionStorage.setItem("data", JSON.stringify(data));
    },
    clearData() {
      this.data = "";
      sessionStorage.removeItem("data");
    }
  }
});

export function useCodeStoreHook() {
  return useCodeStore(store);
}
