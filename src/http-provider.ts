"use strict";
/* tslint:disable:max-line-length */
// forked from ethjs-provider-http

// workaround to use http provider in different envs
const XHR2 = require("xhr2");
const debug = require("debug")("thor:http-provider");
import { ThorAPIMapping} from "./thor-interceptor";

class ThorHttpProvider {
  private host: string;
  private timeout: number;

  constructor(host: string, timeout = 0) {
    if (!(this instanceof ThorHttpProvider)) { throw new Error('[thorify-provider-http] the ThorHttpProvider instance requires the "new" flag in order to function normally (e.g. `const thor = new Web3(new ThorHttpProvider());`).'); }
    if (typeof host !== "string") { throw new Error('[thorify-provider-http] the ThorHttpProvider instance requires that the host be specified (e.g. `new HttpProvider("http://localhost:8545")` or via service like infura `new HttpProvider("http://ropsten.infura.io")`)'); }

    this.host = host;
    this.timeout = timeout;
  }

  public sendAsync(payload: any, callback: any) {
    debug("payload: %O", payload);

    if (!ThorAPIMapping[payload.method]) {
      return callback(new Error("Method not supported!"), {
        id: payload.id || 0,
        jsonrpc: payload.jsonrpc || "2.0",
        result: null,
      });
    }

    const Interceptor = ThorAPIMapping[payload.method];
    const ret = Interceptor.formatXHR(payload, this.host, this.timeout);
    const request = ret.Request;

    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.timeout !== 1) {
        let result = request.responseText;
        let error = null;

        try {
          result = JSON.parse(result);
        } catch (e) {
          error = invalidResponseError(request.responseText, this.host);
        }

        debug("result: %O", result);
        result = ret.ResFormatter(result);

        // tricks for compatible with original web3 instance
        if (result) {
          Object.getPrototypeOf(result).isThorified = () => true;
        }

        callback(error, {
          id: payload.id || 0,
          jsonrpc: payload.jsonrpc || "2.0",
          result,
        });
      }
    };

    request.ontimeout = () => {
      callback(`[thorify-provider-http] CONNECTION TIMEOUT: http request timeout after ${this.timeout} ms. (i.e. your connect has timed out for whatever reason, check your provider).`, null);
    };

    try {
      request.send(ret.Method === "POST" ? JSON.stringify(ret.Body) : null);
    } catch (error) {
      callback(`[thorify-provider-http] CONNECTION ERROR: Couldn't connect to node '${this.host}': ${JSON.stringify(error, null, 2)}`, null);
    }
  }
}

/**
 * InvalidResponseError helper for invalid errors.
 */
function invalidResponseError(result: any, host: any) {
  const message = !!result && !!result.error && !!result.error.message ? `[thorify-provider-http] ${result.error.message}` : `[thorify-provider-http] Invalid JSON RPC response from host provider ${host}: ${JSON.stringify(result, null, 2)}`;
  return new Error(message);
}

export {
  ThorHttpProvider,
};
