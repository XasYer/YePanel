import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: {
    router: any[];
    code: any;
    guoba: {
      [key: string]: any;
    };
  };
};

export const getAsyncRoutes = () => {
  return http.request<Result>("get", "/get-async-routes");
};
