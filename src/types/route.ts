import { RequestHandler, Request, Response, NextFunction } from 'express'
import internal from 'stream'
import WebSocket from 'ws'

export interface httpRoute {
    url: string;
    method: 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';
    token?: boolean;
    contentType?: string;
    response: (req: Request, res: Response, next: NextFunction) => void;
    handler?: RequestHandler;
}

// 待改进
export interface wsRoute {
    url: string;
    function: (ws: WebSocket, req: Request, socket: internal.Duplex, head: Buffer) => void;
}
