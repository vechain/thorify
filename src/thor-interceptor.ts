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
      request.open('GET', host + '/blocks/' + utils.formatBlockNumber(payload.params[0]), true);
      return {
        Method: 'GET',
        Body: {},
        Request: request,
        ResFormatter: (v) => v
      }
    }
  },
  'eth_blockNumber': {
    formatXHR(payload: any, host: string, timeout: number): InterceptorRet {
      let request = new XHR2();
      request.timeout = timeout;
      request.open('GET', host + '/blocks/best', true);
      return {
        Method: 'GET',
        Body: {},
        Request: request,
        ResFormatter: (v) => !v ? v : v.number
      }
    }
  },
  'eth_getBalance': {
    formatXHR(payload: any, host: string, timeout: number): InterceptorRet {
      let request = new XHR2();
      request.timeout = timeout;
      request.open('GET', host + '/accounts/' + payload.params[0] + '?revision=' + utils.formatBlockNumber(payload.params[1]), true);
      return {
        Method: 'GET',
        Body: {},
        Request: request,
        ResFormatter: (v) => !v ? v : v.balance
      }
    }
  },
  'eth_getEnergy': {
    formatXHR(payload: any, host: string, timeout: number): InterceptorRet {
      let request = new XHR2();
      request.timeout = timeout;
      request.open('GET', host + '/accounts/' + payload.params[0] + '?revision=' + utils.formatBlockNumber(payload.params[1]), true);
      return {
        Method: 'GET',
        Body: {},
        Request: request,
        ResFormatter: (v) => !v ? v : v.energy
      }
    }
  },
  'eth_getCode': {
    formatXHR(payload: any, host: string, timeout: number): InterceptorRet {
      let request = new XHR2();
      request.timeout = timeout;
      request.open('GET', host + '/accounts/' + payload.params[0] + '/code?revision=' + utils.formatBlockNumber(payload.params[1]), true);
      return {
        Method: 'GET',
        Body: {},
        Request: request,
        ResFormatter: (v) => !v ? v : v.code
      }
    }
  },
  'eth_getStorageAt': {
    formatXHR(payload: any, host: string, timeout: number): InterceptorRet {
      let request = new XHR2();
      request.timeout = timeout;
      request.open('GET', host + '/accounts/' + payload.params[0] + '/storage/' + payload.params[1]+'?revision=' + utils.formatBlockNumber(payload.params[2]), true);
      return {
        Method: 'GET',
        Body: {},
        Request: request,
        ResFormatter: (v) => !v ? v : v.value
      }
    }
  },  
  'eth_sendRawTransaction': {
    formatXHR(payload: any, host: string, timeout: number): InterceptorRet {
      let request = new XHR2();
      request.timeout = timeout;
      request.open('POST', host + '/transactions', true);
      return {
        Method: 'POST',
        Body: {
          raw: payload.params[0]
        },
        Request: request,
        ResFormatter: (v) => !v ? v : v.id
      }
    }
  },
  'eth_getTransactionByHash': {
    formatXHR(payload: any, host: string, timeout: number): InterceptorRet {
      let request = new XHR2();
      request.timeout = timeout;
      request.open('GET', host + '/transactions/' + payload.params[0], true);
      return {
        Method: 'GET',
        Body: {},
        Request: request,
        ResFormatter: (v) => {
          if (!v) return v
          v.blockNumber = v.block.number;
          return v;
        }
      }
    }
  },
  'eth_getTransactionReceipt': {
    formatXHR(payload: any, host: string, timeout: number): InterceptorRet {
      let request = new XHR2();
      request.timeout = timeout;
      request.open('GET', host + '/transactions/' + payload.params[0]+'/receipt', true);
      return {
        Method: 'GET',
        Body: {},
        Request: request,
        ResFormatter: (v) => {
          if(!v) return v
          v.blockNumber = v.block.number;
          v.blockHash = v.block.id;
          return v;
        }
      }
    }
  },
  'eth_call': {
    formatXHR(payload: any, host: string, timeout: number): InterceptorRet {
      let request = new XHR2();
      request.timeout = timeout;
      request.open('POST', host + '/accounts/' + payload.params[0].to + '?revision=' + utils.formatBlockNumber(payload.params[1]), true);

      let body:any = {
        value: payload.params[0].value || '',
        data: payload.params[0].data || '',
        gas: payload.params[0].gas || 0,
        gasPrice: payload.params[0].gasPrice || ''
      };
      if (payload.params[0].from) {
        body.caller = payload.params[0].from;
      }

      return {
        Method: 'POST',
        Body: body,
        Request: request,
        ResFormatter: (v) => !v ? v : v.data
      }
    }
  },
  'eth_getLogs': {
    formatXHR(payload: any, host: string, timeout: number): InterceptorRet {
      let request = new XHR2();
      request.timeout = timeout;
      console.log(payload.params);
      console.log(host + '/accounts/' + payload.params[0].address + '/logs' + (payload.params[0].order ? '?order=' + payload.params[0].order : ''));
      request.open('POST', host + '/accounts/' + payload.params[0].address + '/logs' + (payload.params[0].order ? '?order=' + payload.params[0].order :''), true);

      // let body: any = {
      //   value: payload.params[0].value || '',
      //   data: payload.params[0].data || '',
      //   gas: payload.params[0].gas || 0,
      //   gasPrice: payload.params[0].gasPrice || ''
      // };
      // if (payload.params[0].from) {
      //   body.caller = payload.params[0].from;
      // }
      let body={}

      return {
        Method: 'POST',
        Body: body,
        Request: request,
        ResFormatter: (v) => v
      }
    }
  }
};

export default ThorAPIMapping;