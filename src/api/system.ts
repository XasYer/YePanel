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
