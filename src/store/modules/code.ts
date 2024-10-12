import { defineStore } from "pinia";
import { store } from "../utils";

type stateType = {
  code: {
    [key: string]: {
      main: string[];
      components: string[];
    };
  };
  guoba: {
    [key: string]: {
      pluginInfo: any;
    };
  };
};

export const useCodeStore = defineStore({
  id: "code",
  state: (): stateType => ({
    code: sessionStorage.getItem("plugin.code")
      ? JSON.parse(sessionStorage.getItem("plugin.code"))
      : {},
    guoba: sessionStorage.getItem("plugin.guoba")
      ? JSON.parse(sessionStorage.getItem("plugin.guoba"))
      : {}
  }),
  actions: {
    setData(data: stateType) {
      this.code = data.code;
      this.guoba = data.guoba;
      sessionStorage.setItem("plugin.code", JSON.stringify(data.code));
      sessionStorage.setItem("plugin.guoba", JSON.stringify(data.guoba));
    },
    clearData() {
      this.code = {};
      this.guoba = {};
      sessionStorage.removeItem("plugin.code");
      sessionStorage.removeItem("plugin.guoba");
    }
  }
});

export function useCodeStoreHook() {
  return useCodeStore(store);
}
