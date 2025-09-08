// Override for @types/ws to fix Server generic type issues
declare module "ws" {
  import { EventEmitter } from "events";
  import { IncomingMessage } from "http";
  import { Duplex } from "stream";
  import { URL } from "url";

  // Fix the Server type to not be generic
  export interface ServerOptions {
    host?: string;
    port?: number;
    backlog?: number;
    server?: any;
    verifyClient?: any;
    handleProtocols?: any;
    path?: string;
    noServer?: boolean;
    clientTracking?: boolean;
    perMessageDeflate?: boolean | any;
    maxPayload?: number;
    skipUTF8Validation?: boolean;
  }

  export class Server extends EventEmitter {
    constructor(options?: ServerOptions, callback?: () => void);
    close(cb?: (err?: Error) => void): void;
    handleUpgrade(
      request: IncomingMessage,
      socket: Duplex,
      upgradeHead: Buffer,
      callback: (client: WebSocket, request: IncomingMessage) => void
    ): void;
    shouldHandle(request: IncomingMessage): boolean | Promise<boolean>;
  }

  export interface WebSocket extends EventEmitter {
    // Basic WebSocket interface
    send(data: any, cb?: (err?: Error) => void): void;
    close(code?: number, reason?: string): void;
    readyState: number;
  }

  export const WebSocket: {
    new (address: string | URL, protocols?: string | string[]): WebSocket;
    CONNECTING: number;
    OPEN: number;
    CLOSING: number;
    CLOSED: number;
  };
}
