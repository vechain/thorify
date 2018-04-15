'use strict'
const XHR2 = require('xhr2');
import utils from './utils'

export interface formatter{
  (payload:any): any
}
export interface InterceptorRet{
  Method: 'GET'|'POST';
  Body: object
  Request: any;
  ResFormatter: formatter;
}

export interface ThorInterceptor {
  formatXHR(payload: object, host: string, timeout: number): InterceptorRet
}

let noop = ()=>{}
let ThorAPIMapping: { [key:string]: ThorInterceptor };

ThorAPIMapping = {
  'eth_getBlockByNumber': {
    formatXHR(payload: any, host: string, timeout: number): InterceptorRet { 
      let request = new XHR2(); 
      request.timeout = timeout;
      request.open('GET', host + '/blocks/' + utils.formatBlockNumber(payload.params[0]), true);
      return {
        Method: 'GET',
        Body: {},
        Request: request,
        ResFormatter: (v)=>v
      }
    }
  },
  'eth_getBlockByHash': {
    formatXHR(payload: any, host: string, timeout: number): InterceptorRet {
      let request = new XHR2();
      request.timeout = timeout;
      request.open('GET', host + '/blocks/' + payload.params[0], true);
      return {
        Method: 'GET',
        Body: {},
        Request: request,
        ResFormatter: (v) => v
      }
    }
  }
};

export default ThorAPIMapping;
