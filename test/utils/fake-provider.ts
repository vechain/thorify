"use strict";
/* tslint:disable:max-line-length */

import { ThorAPIMapping } from "./fake-interceptor";

class ThorHttpProvider {
  private host: string;
  private timeout: number;

  public sendAsync(payload: any, callback: any) {

    if (!ThorAPIMapping[payload.method]) {
      return callback(new Error("Method not supported!"), {
        id: payload.id || 0,
        jsonrpc: payload.jsonrpc || "2.0",
        result: null,
      });
    }

    const ret = ThorAPIMapping[payload.method];
    Object.getPrototypeOf(ret).getReqBody = () => payload;

    callback(null, {
      id: payload.id || 0,
      jsonrpc: payload.jsonrpc || "2.0",
      result: ret,
    });
  }

}

export {
  ThorHttpProvider,
};
