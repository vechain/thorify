"use strict";
/* tslint:disable:max-line-length */
// forked from ethjs-provider-http

// workaround to use http provider in different envs
const XHR2 = require("xhr2");
const web3Utils = require("web3-utils");
const debug = require("debug")("thor:http-provider");
import { ThorAPIMapping} from "./thor-interceptor";

class ThorHttpProvider {
  private host: string;
  private timeout: number;

  constructor(host: string, timeout = 0) {
    if (!host) { throw new Error('[thorify-provider-http] the ThorHttpProvider instance requires that the host be specified (e.g. `new HttpProvider("http://localhost:8545")` or via service like infura `new HttpProvider("http://ropsten.infura.io")`)'); }

    this.host = host;
    this.timeout = timeout;
  }

  public sendAsync(payload: any, callback: any) {
    debug("payload: %O", payload);

    if (payload.method === "eth_sendTransaction") {
      return callback(new Error("The private key corresponding to from filed can't be found in local eth.accounts.wallet!"), {
        id: payload.id || 0,
        jsonrpc: payload.jsonrpc || "2.0",
        result: null,
      });
    }

    if (!ThorAPIMapping[payload.method]) {
      return callback(new Error("Method not supported!"), {
        id: payload.id || 0,
        jsonrpc: payload.jsonrpc || "2.0",
        result: null,
      });
    }

    const Interceptor = ThorAPIMapping[payload.method];
    const preparation = Interceptor.prepare(payload);

    const request = new XHR2();
    request.timeout = this.timeout;
    request.open(preparation.Method, this.host + preparation.URL, true);

    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        if (request.status !== 200) {
          return callback(new Error("[thorify-provider-http] Invalid response code from provider: " + request.status + (request.responseText ? ", response: " + request.responseText : "")), {
            id: payload.id || 0,
            jsonrpc: payload.jsonrpc || "2.0",
            result: null,
          });
        }
        let result = request.responseText;
        let error = null;

        try {
          result = JSON.parse(result);
        } catch (e) {
          error = invalidResponseError(e);
          return callback(error, {
            id: payload.id || 0,
            jsonrpc: payload.jsonrpc || "2.0",
            result: null,
          });
        }

        debug("result: %O", result);
        result = preparation.ResFormatter(result);

        // tricks for compatible with original web3 instance
        // non-objects or non-arrays does't need isThorified property since thorify just overwritten 3 formatters
        // which all accept object as input
        if (web3Utils._.isObject(result) && !web3Utils._.isArray(result)) {
          Object.defineProperty(result, "isThorified", { get: () => true});
        }
        if (web3Utils._.isArray(result)) {
          result = result.map((item: any) => {
            Object.defineProperty(item, "isThorified", { get: () => true});
            return item;
          });
        }
        callback(error, {
          id: payload.id || 0,
          jsonrpc: payload.jsonrpc || "2.0",
          result,
        });
      }
    };

    request.ontimeout = () => {
      callback(new Error(`[thorify-provider-http] CONNECTION TIMEOUT: http request timeout after ${this.timeout} ms. (i.e. your connect has timed out for whatever reason, check your provider).`), null);
    };

    try {
      request.send(preparation.Method === "POST" ? JSON.stringify(preparation.Body) : null);
    } catch (error) {
      callback(new Error(`[thorify-provider-http] CONNECTION ERROR: Couldn't connect to node '${this.host}': ${JSON.stringify(error, null, 2)}`), null);
    }
  }
}

/**
 * InvalidResponseError helper for invalid errors.
 */
function invalidResponseError(error: any) {
  const message = `[thorify-provider-http] Invalid response from host provider :${error.message}`;
  return new Error(message);
}

export {
  ThorHttpProvider,
};
