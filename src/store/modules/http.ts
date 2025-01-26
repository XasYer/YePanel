import { defineStore } from "pinia";
import { type httpType, store, storageLocal } from "../utils";

export const useHttpStore = defineStore({
  id: "pure-http",
  state: (): httpType => ({
    timeout: storageLocal().getItem<number>("timeout") || 10
  }),
  getters: {
    getTimeout(state) {
      return state.timeout;
    }
  },
  actions: {
    setTimeout(timeout: number) {
      this.timeout = timeout;
      storageLocal().setItem("timeout", timeout);
    }
  }
});

export function useHttpStoreHook() {
  return useHttpStore(store);
}
