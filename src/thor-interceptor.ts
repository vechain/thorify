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
          v.transactionHash = v.tx.id;
          // For competible with ethereum's receipt
          if (v.reverted) {
            v.status = '0x0';
          } else {
            v.status = '0x1';
          }
          if (v.outputs.length === 1) {
            v.contractAddress = v.outputs[0].contractAddress;
          }
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

      let query = '';
      if (payload.params[0].address) {
        query = '&address=' + payload.params[0].address;
      }
      if (payload.params[0].order && (payload.params[0].order.toUpperCase() === 'ASC' || payload.params[0].order.toUpperCase() === 'DESC')) {
        query += '&order=' + payload.params[0].order.toUpperCase();
      }
      query = query.replace('&', '?');
      let body = utils.formatLogQuery(payload.params[0]);

      request.open('POST', host + '/logs' + query, true);

      return {
        Method: 'POST',
        Body: body,
        Request: request,
        ResFormatter: (v) => {
          if (!v) return v
          for (let item of v) {
            item.blockNumber = item.block.number;
            item.blockHash = item.block.id;
            item.transactionHash = item.tx.id;
          } 
          return v;
        }
      }
    }
  },
  'eth_getBlockRef': {
    formatXHR(payload: any, host: string, timeout: number): InterceptorRet {
      let request = new XHR2();
      request.timeout = timeout;
      request.open('GET', host + '/blocks/best', true);
      return {
        Method: 'GET',
        Body: {},
        Request: request,
        ResFormatter: (v) => {
          if (!v) {
            return null;
          } else if (v.id) {
            return v.id.substr(0, 18);
          } else {
            return null;
          }
        }
      }
    }
  },
  'eth_getChainTag': {
    formatXHR(payload: any, host: string, timeout: number): InterceptorRet {
      let request = new XHR2();
      request.timeout = timeout;
      request.open('GET', host + '/blocks/0', true);
      return {
        Method: 'GET',
        Body: {},
        Request: request,
        ResFormatter: (v) => {
          if (!v) {
            return null;
          } else if (v.id&&v.id.length === 66) {
            return '0x'+v.id.substr(64,2);
          } else {
            return null;
          }
        }
      }
    }
  }
};

export default ThorAPIMapping;