"use strict";
/* tslint:disable:max-line-length */
import { ThorAPIMapping } from "./fake-interceptor";
const web3Utils = require("web3-utils");

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
    let ret = ThorAPIMapping[payload.method].ret;
    // non-objects doesn't need isThorified property since thorify just overwritten 3 formatters
    // which all accept object as input
    if (web3Utils._.isObject(ret)) {
      // tricks for fast deep copy since I defined ThorAPIMapping
       ret = JSON.parse(JSON.stringify(ret));
       Object.defineProperty(ret, "reqBody", { get: () => payload, set: () => null });
       Object.defineProperty(ret, "isThorified", { get: () => true, set: () => null });
    }
    if (web3Utils._.isArray(ret)) {
      ret = ret.map((i) => {
        i = JSON.parse(JSON.stringify(i));
        Object.defineProperty(i, "reqBody", { get: () => payload, set: () => null });
        Object.defineProperty(i, "isThorified", { get: () => true, set: () => null });
        return i;
      });
    }
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
