import { http } from "@/utils/http";

let baseUrl = 'http://127.0.0.1:2536/qqbot';

export const setBaseUrlApi = (url: string) => {
  http.setBaseURL(url);
  baseUrl = url;
}

export const getBaseUrlApi = () => baseUrl;
