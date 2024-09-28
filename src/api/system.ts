import { http } from "@/utils/http";
import { getToken } from "@/utils/auth";
import { getBaseUrlApi } from "@/api/utils";

export function createWS(
  api: string,
  {
    onmessage,
    onclose,
    onerror,
    onopen
  }: {
    onmessage?: (this: WebSocket, ev: MessageEvent) => any;
    onclose?: (this: WebSocket, ev: CloseEvent) => any;
    onerror?: (this: WebSocket, ev: Event) => any;
    onopen?: (this: WebSocket, ev: Event) => any;
  } = {}
): WebSocket {
  const url = getBaseUrlApi().replace(/^https?/, "ws") + "/ws/" + api;
  const ws = new WebSocket(url, getToken().accessToken);
  ws.onmessage = onmessage;
  ws.onclose = onclose;
  ws.onerror = onerror;
  ws.onopen = onopen;
  return ws;
}

export type getDirDataResult = {
  success: boolean;
  message?: string;
  data: {
    path: string;
    parentPath: string;
    files: {
      name: string;
      path: string;
      size: string;
      rowSize: number;
      time: string;
      mtimeMs: number;
      ext: string;
      isDir?: boolean;
    }[];
  };
};

export const getDirData = (path: string) => {
  return http.request<getDirDataResult>("post", "/get-dir-data", {
    data: { path }
  });
};

export type renameFileResult = {
  success: boolean;
  message?: string;
};

/** 重命名文件或文件夹, 如果没有则创建 */
export const renameFile = (path: string, name: string, isDir: boolean) => {
  return http.request<renameFileResult>("post", "/rename-file", {
    data: { path, name, isDir }
  });
};

export type deleteFileResult = {
  success: boolean;
  message?: string;
  errors?: { path: string; isDir: boolean; message: string }[];
};

/** 删除文件或文件夹 */
export const deleteFiles = (paths: { path: string; isDir: boolean }[]) => {
  return http.request<deleteFileResult>("post", "/delete-file", {
    data: { paths }
  });
};

/** 复制或移动 文件或文件夹 */
export const moveFiles = (
  paths: { path: string; name: string; isDir: boolean }[],
  targetPath: string,
  action: "copy" | "move"
) => {
  return http.request<deleteFileResult>("post", "/move-file", {
    data: { paths, targetPath, action }
  });
};

export const downloadFile = (path: string, name: string) => {
  return http.request<any>("post", "/download-file", {
    data: { path, name },
    responseType: "blob"
  });
};

export const setFileData = (path: string, data: string) => {
  return http.request<renameFileResult>("post", "/set-file-data", {
    data: { path, data }
  });
};
