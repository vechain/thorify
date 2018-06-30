"use strict";
import * as utils from "./utils";
/* tslint:disable:max-line-length */

export type formatter = (payload: any) => any;
export interface InterceptorRet {
  Method: "GET"|"POST";
  Body: object;
  URL: string;
  ResFormatter: formatter;
}

export interface IThorInterceptor {
  prepare(payload: object): InterceptorRet;
}

let ThorAPIMapping: { [key: string]: IThorInterceptor };

ThorAPIMapping = {
  eth_getBlockByNumber: {
    prepare(payload: any): InterceptorRet {
      return {
        Method: "GET",
        Body: {},
        URL: "/blocks/" + utils.formatBlockNumber(payload.params[0]),
        ResFormatter: (v) => v,
      };
    },
  },
  eth_getBlockByHash: {
    prepare(payload: any): InterceptorRet {
      return {
        Method: "GET",
        Body: {},
        URL: "/blocks/" + utils.formatBlockHash(payload.params[0]),
        ResFormatter: (v) => v,
      };
    },
  },
  eth_blockNumber: {
    prepare(payload: any): InterceptorRet {
      return {
        Method: "GET",
        Body: {},
        URL: "/blocks/best",
        ResFormatter: (v) => !v ? v : v.number,
      };
    },
  },
  eth_getBalance: {
    prepare(payload: any): InterceptorRet {
      return {
        Method: "GET",
        Body: {},
        URL: "/accounts/" + payload.params[0] + "?revision=" + utils.formatBlockNumber(payload.params[1]),
        ResFormatter: (v) => !v ? v : v.balance,
      };
    },
  },
  eth_getEnergy: {
    prepare(payload: any): InterceptorRet {
      return {
        Method: "GET",
        Body: {},
        URL: "/accounts/" + payload.params[0] + "?revision=" + utils.formatBlockNumber(payload.params[1]),
        ResFormatter: (v) => !v ? v : v.energy,
      };
    },
  },
  eth_getCode: {
    prepare(payload: any): InterceptorRet {
      return {
        Method: "GET",
        Body: {},
        URL: "/accounts/" + payload.params[0] + "/code?revision=" + utils.formatBlockNumber(payload.params[1]),
        ResFormatter: (v) => !v ? v : v.code,
      };
    },
  },
  eth_getStorageAt: {
    prepare(payload: any): InterceptorRet {
      return {
        Method: "GET",
        Body: {},
        URL: "/accounts/" + payload.params[0] + "/storage/" + payload.params[1] + "?revision=" + utils.formatBlockNumber(payload.params[2]),
        ResFormatter: (v) => !v ? v : v.value,
      };
    },
  },
  eth_sendRawTransaction: {
    prepare(payload: any): InterceptorRet {
      return {
        Method: "POST",
        Body: {
          raw: payload.params[0],
        },
        URL: "/transactions",
        ResFormatter: (v) => !v ? v : v.id,
      };
    },
  },
  eth_getTransactionByHash: {
    prepare(payload: any): InterceptorRet {
      return {
        Method: "GET",
        Body: {},
        URL: "/transactions/" + payload.params[0],
        ResFormatter: (v) => {
          if (!v) { return v; }
          v.blockNumber = v.meta.blockNumber;
          return v;
        },
      };
    },
  },
  eth_getTransactionReceipt: {
    prepare(payload: any): InterceptorRet {
      return {
        Method: "GET",
        Body: {},
        URL: "/transactions/" + payload.params[0] + "/receipt",
        ResFormatter: (v) => {
          if (!v) { return v; }
          v.blockNumber = v.meta.blockNumber;
          v.blockHash = v.meta.blockID;
          v.transactionHash = v.meta.txID;
          // For compatible with ethereum's receipt
          if (v.reverted) {
            v.status = "0x0";
          } else {
            v.status = "0x1";
          }
          if (v.outputs.length === 1) {
            v.contractAddress = v.outputs[0].contractAddress;
          }
          return v;
        },
      };
    },
  },
  eth_call: {
    prepare(payload: any): InterceptorRet {
      let extraURI = "";
      if (payload.params[0].to) {
        extraURI = "/" + payload.params[0].to;
      }
      extraURI += "?revision=" + utils.formatBlockNumber(payload.params[1]);

      const body: any = {
        value: payload.params[0].value || "",
        data: payload.params[0].data || "0x",
        gasPrice: payload.params[0].gasPrice || "",
      };
      if (payload.params[0].gas) {
        if (typeof payload.params[0].gas === "number") {
          body.gas = payload.params[0].gas;
        } else {
          body.gas = parseInt(utils.sanitizeHex(payload.params[0].gas), 16);
        }
      }
      if (payload.params[0].from) {
        body.caller = payload.params[0].from;
      }

      return {
        Method: "POST",
        Body: body,
        URL: "/accounts" + extraURI,
        ResFormatter: (v) => {
          if (!v) {
            return v;
          } else {
            if (v.reverted) {
              return null;
            } else {
              return v.data;
            }
          }
        },
      };
    },
  },
  eth_estimateGas: {
    prepare(payload: any): InterceptorRet {
      let extraURI = "";
      if (payload.params[0].to) {
        extraURI = "/" + payload.params[0].to;
      }
      extraURI += "?revision=" + utils.formatBlockNumber(payload.params[1]);

      const body: any = {
        value: payload.params[0].value || "0",
        data: payload.params[0].data || "0x",
        gasPrice: payload.params[0].gasPrice || "",
      };
      if (payload.params[0].from) {
        body.caller = payload.params[0].from;
      }

      return {
        Method: "POST",
        Body: body,
        URL: "/accounts" + extraURI,
        ResFormatter: (v) => {
          if (!v) {
            return v;
          } else {
            if (v.reverted) {
              return null;
            }
            // ignore the overflow since block gas limit is uint64 and javascript's max number is 2^53
            const intrinsicGas = utils.calcIntrinsicGas(Object.assign(body, { to: payload.params[0].to}));
            if (v.gasUsed === 0 && ( body.data === "0x" )) {
              return intrinsicGas;
            } else {
              return Math.floor(v.gasUsed * 1.2) + intrinsicGas; // increase vm gas with 20% for safe since it's estimated from current block state, final state for the transaction is not determined for now
            }
          }
        },
      };
    },
  },
  eth_getLogs: {
    prepare(payload: any): InterceptorRet {
      let query = "";
      if (payload.params[0].address) {
        query = "&address=" + payload.params[0].address;
      }
      if (payload.params[0].order && (payload.params[0].order.toUpperCase() === "ASC" || payload.params[0].order.toUpperCase() === "DESC")) {
        query += "&order=" + payload.params[0].order.toUpperCase();
      }
      query = query.replace("&", "?");
      const body = utils.formatLogQuery(payload.params[0]);

      return {
        Method: "POST",
        Body: body,
        URL: "/events" + query,
        ResFormatter: (v) => {
          if (!v) { return v; }
          for (const item of v) {
            item.blockNumber = item.meta.blockNumber;
            item.blockHash = item.meta.blockID;
            item.transactionHash = item.meta.txID;
          }
          return v;
        },
      };
    },
  },
  eth_getBlockRef: {
    prepare(payload: any): InterceptorRet {
      return {
        Method: "GET",
        Body: {},
        URL: "/blocks/best",
        ResFormatter: (v) => {
          if (!v) {
            return null;
          } else if (v.id) {
            return v.id.substr(0, 18);
          } else {
            return null;
          }
        },
      };
    },
  },
  eth_getChainTag: {
    prepare(payload: any): InterceptorRet {
      return {
        Method: "GET",
        Body: {},
        URL: "/blocks/0",
        ResFormatter: (v) => {
          if (!v) {
            return null;
          } else if (v.id && v.id.length === 66) {
            return "0x" + v.id.substr(64, 2);
          } else {
            return null;
          }
        },
      };
    },
  },
  thor_test: {
    prepare(payload: any): InterceptorRet {
      return {
        Method: payload.testMethod && payload.testMethod === "POST" ? "POST" : "GET",
        Body: payload.testBody || {} ,
        URL: "/thor/test",
        ResFormatter: () => { if (payload.testResult) { return payload.testResult; } else { return {}; } },
      };
    },
  },
};

export {
  ThorAPIMapping,
};
