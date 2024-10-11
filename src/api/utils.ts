let baseUrl = localStorage.getItem("QQBotBaseUrl") || "http://127.0.0.1:2877";

export const setBaseUrlApi = (url: string) => {
  baseUrl = url;
};

export const getBaseUrlApi = () => baseUrl;
