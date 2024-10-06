let baseUrl =
  localStorage.getItem("QQBotBaseUrl") || "http://127.0.0.1:2536/qqbot";

export const setBaseUrlApi = (url: string) => {
  baseUrl = url;
};

export const getBaseUrlApi = () => baseUrl;
