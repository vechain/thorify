'use strict'
// forked from ethjs-provider-http

// workaround to use httpprovider in different envs
const XHR2 = require('xhr2');
const debug = require('debug')('thor:http-provider')
import ThorInterceptor from './thor-interceptor';

class ThorHttpProvider {
  private host: string;
  private timeout: number;

  constructor(host: string, timeout = 0) {
    if (!(this instanceof ThorHttpProvider)) { throw new Error('[thorjs-provider-http] the ThorHttpProvider instance requires the "new" flag in order to function normally (e.g. `const thor = new Web3(new ThorHttpProvider());`).'); }
    if (typeof host !== 'string') { throw new Error('[thorjs-provider-http] the ThorHttpProvider instance requires that the host be specified (e.g. `new HttpProvider("http://localhost:8545")` or via service like infura `new HttpProvider("http://ropsten.infura.io")`)'); }

    this.host = host;
    this.timeout = timeout;
  }

  sendAsync(payload: any, callback: any) {
    debug('payload: %O', payload);

    if (!ThorInterceptor[payload.method]) {
      return callback(new Error('Method not supported!'), {
        id: payload.id || 0,
        jsonrpc: payload.jsonrpc || "2.0",
        result: null
      });
    }

    let Interceptor = ThorInterceptor[payload.method];
    let ret = Interceptor.formatXHR(payload, this.host, this.timeout)
    let request = ret.Request;

    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.timeout !== 1) {
        var result = request.responseText;
        var error = null;

        try {
          result = JSON.parse(result);
        } catch (e) {
          error = invalidResponseError(request.responseText, this.host);
        }

        debug('result: %O', result);
        result = ret.ResFormatter(result)
        callback(error, {
          id: payload.id || 0,
          jsonrpc: payload.jsonrpc || "2.0",
          result
        });
      }
    };

    request.ontimeout = () => {
      callback(`[thorjs-provider-http] CONNECTION TIMEOUT: http request timeout after ${this.timeout} ms. (i.e. your connect has timed out for whatever reason, check your provider).`, null);
    };

    try {
      request.send(ret.Method === 'POST' ? JSON.stringify(ret.Body) : null);
    } catch (error) {
      callback(`[thorjs-provider-http] CONNECTION ERROR: Couldn't connect to node '${this.host}': ${JSON.stringify(error, null, 2)}`, null);
    }
  }

}

/**
 * InvalidResponseError helper for invalid errors.
 */
function invalidResponseError(result: any, host: any) {
  const message = !!result && !!result.error && !!result.error.message ? `[thorjs-provider-http] ${result.error.message}` : `[thorjs-provider-http] Invalid JSON RPC response from host provider ${host}: ${JSON.stringify(result, null, 2)}`;
  return new Error(message);
}

export default ThorHttpProvider;

