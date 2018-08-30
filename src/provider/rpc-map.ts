"use strict";

import * as utils from "../utils";
import { JSONRPC, RPCResult } from "./json-rpc";
import { HTTP, SimpleResponse} from "./simple-http";

type RPCExecutor = (rpc: JSONRPC, host: string, timeout: number) => Promise<RPCResult>;

const RPCMap = new Map<string, RPCExecutor>();

const HTTPPostProcessor = function(res: SimpleResponse): Promise<any> {
    // TODO：need more test
    if (res.Code === 0) {
        throw new Error(`[thorify-provider] Invalid response, check the host`);
    }
    if (res.Code !== 200) {
        throw new Error(res.Body ? res.Body as string : ("[thorify-provider] Invalid response code from provider: " + res.Code) );
    }
    return Promise.resolve(res.Body);
};

RPCMap.set("eth_getBlockByNumber", async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + "/blocks/" + utils.fromETHBlockNumber(rpc.params[0]);

    let res;
    try {
        res = await HTTP.get(URL, timeout).then(HTTPPostProcessor);
    } catch (e) {
        return rpc.makeError(e.message);
    }

    return rpc.makeResult(res);
});

RPCMap.set("eth_getBlockByNumber", async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + "/blocks/" + utils.fromETHBlockNumber(rpc.params[0]);

    let res;
    try {
        res = await HTTP.get(URL, timeout).then(HTTPPostProcessor);
    } catch (e) {
        return rpc.makeError(e.message);
    }

    return rpc.makeResult(res);
});

RPCMap.set("eth_getBlockByHash", async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + "/blocks/" + rpc.params[0];

    let res;
    try {
        res = await HTTP.get(URL, timeout).then(HTTPPostProcessor);
    } catch (e) {
        return rpc.makeError(e.message);
    }

    return rpc.makeResult(res);
});

RPCMap.set("eth_blockNumber", async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + "/blocks/best";

    let res;
    try {
        res = await HTTP.get(URL, timeout).then(HTTPPostProcessor);
    } catch (e) {
        return rpc.makeError(e.message);
    }

    return rpc.makeResult(!res  ? null : res.number);
});

RPCMap.set("eth_getBalance", async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + "/accounts/" + rpc.params[0] + "?revision=" + utils.fromETHBlockNumber(rpc.params[1]);

    let res;
    try {
        res = await HTTP.get(URL, timeout).then(HTTPPostProcessor);
    } catch (e) {
        return rpc.makeError(e.message);
    }

    return rpc.makeResult(!res ? null : res.balance);
});

RPCMap.set("eth_getEnergy", async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + "/accounts/" + rpc.params[0] + "?revision=" + utils.fromETHBlockNumber(rpc.params[1]);

    let res;
    try {
        res = await HTTP.get(URL, timeout).then(HTTPPostProcessor);
    } catch (e) {
        return rpc.makeError(e.message);
    }

    return rpc.makeResult(!res ? null : res.energy);
});

RPCMap.set("eth_getCode", async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + "/accounts/" + rpc.params[0] + "/code?revision=" + utils.fromETHBlockNumber(rpc.params[1]);

    let res;
    try {
        res = await HTTP.get(URL, timeout).then(HTTPPostProcessor);
    } catch (e) {
        return rpc.makeError(e.message);
    }

    return rpc.makeResult(!res ? null : res.code);
});

RPCMap.set("eth_getStorageAt", async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + "/accounts/" + rpc.params[0] + "/storage/" + rpc.params[1] + "?revision=" + utils.fromETHBlockNumber(rpc.params[2]);

    let res;
    try {
        res = await HTTP.get(URL, timeout).then(HTTPPostProcessor);
    } catch (e) {
        return rpc.makeError(e.message);
    }

    return rpc.makeResult(!res ? null : res.value);
});

RPCMap.set("eth_sendRawTransaction", async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + "/transactions";
    const reqBody = {
        raw: rpc.params[0],
    };

    let res;
    try {
        res = await HTTP.post(URL, reqBody, timeout).then(HTTPPostProcessor);
    } catch (e) {
        return rpc.makeError(e.message);
    }

    return rpc.makeResult(!res ? null : res.id);
});

RPCMap.set("eth_getTransactionByHash", async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + "/transactions/" + rpc.params[0];

    let res;
    try {
        res = await HTTP.get(URL, timeout).then(HTTPPostProcessor);
    } catch (e) {
        return rpc.makeError(e.message);
    }

    if (!res) {
        return rpc.makeResult(null);
    }
    res.blockNumber = res.meta.blockNumber;
    return rpc.makeResult(res);
});

RPCMap.set("eth_getTransactionReceipt", async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + "/transactions/" + rpc.params[0] + "/receipt";

    let res;
    try {
        res = await HTTP.get(URL, timeout).then(HTTPPostProcessor);
    } catch (e) {
        return rpc.makeError(e.message);
    }

    if (!res) {
        return rpc.makeResult(null);
    }

    res.blockNumber = res.meta.blockNumber;
    res.blockHash = res.meta.blockID;
    res.transactionHash = res.meta.txID;
    // For compatible with ethereum's receipt
    if (res.reverted) {
        res.status = "0x0";
    } else {
        res.status = "0x1";
    }
    if (res.outputs.length === 1) {
        res.contractAddress = res.outputs[0].contractAddress;
    }

    return rpc.makeResult(res);
});

// eth_call: {
//     prepare(payload: any): InterceptorRet {
//         let extraURI = "";
//         if (rpc.params[0].to) {
//             extraURI = "/" + rpc.params[0].to;
//         }
//         extraURI += "?revision=" + utils.fromETHBlockNumber(rpc.params[1]);

//         const body: any = {
//             value: rpc.params[0].value || "",
//             data: rpc.params[0].data || "0x",
//             gasPrice: rpc.params[0].gasPrice || "",
//         };
//         if (rpc.params[0].gas) {
//             if (typeof rpc.params[0].gas === "number") {
//                 body.gas = rpc.params[0].gas;
//             } else {
//                 body.gas = parseInt(utils.sanitizeHex(rpc.params[0].gas), 16);
//             }
//         }
//         if (rpc.params[0].from) {
//             body.caller = rpc.params[0].from;
//         }

//         return {
//             Method: "POST",
//             Body: body,
//             URL: "/accounts" + extraURI,
//             ResFormatter: (v) => {
//                 if (!v) {
//                     return v;
//                 } else {
//                     if (v.reverted) {
//                         return null;
//                     } else {
//                         return v.data;
//                     }
//                 }
//             },
//         };
//     },
// },
// eth_estimateGas: {
//     prepare(payload: any): InterceptorRet {
//         let extraURI = "";
//         if (rpc.params[0].to) {
//             extraURI = "/" + rpc.params[0].to;
//         }
//         extraURI += "?revision=" + utils.fromETHBlockNumber(rpc.params[1]);

//         const body: any = {
//             value: rpc.params[0].value || "0",
//             data: rpc.params[0].data || "0x",
//             gasPrice: rpc.params[0].gasPrice || "",
//         };
//         if (rpc.params[0].from) {
//             body.caller = rpc.params[0].from;
//         }

//         return {
//             Method: "POST",
//             Body: body,
//             URL: "/accounts" + extraURI,
//             ResFormatter: (v) => {
//                 if (!v) {
//                     return v;
//                 } else {
//                     if (v.reverted) {
//                         return null;
//                     }
//                     // ignore the overflow since block gas limit is uint64 and javascript's max number is 2^53
//                     const intrinsicGas = utils.calcIntrinsicGas(Object.assign(body, { to: rpc.params[0].to }));
//                     if (v.gasUsed === 0 && (body.data === "0x")) {
//                         return intrinsicGas;
//                     } else {
//                         return Math.floor(v.gasUsed * 1.2) + intrinsicGas; // increase vm gas with 20% for safe since it's estimated from current block state, final state for the transaction is not determined for now
//                     }
//                 }
//             },
//         };
//     },
// },
// eth_getLogs: {
//     prepare(payload: any): InterceptorRet {
//         let query = "";
//         if (rpc.params[0].address) {
//             query = "&address=" + rpc.params[0].address;
//         }
//         if (rpc.params[0].order && (rpc.params[0].order.toUpperCase() === "ASC" || rpc.params[0].order.toUpperCase() === "DESC")) {
//             query += "&order=" + rpc.params[0].order.toUpperCase();
//         }
//         query = query.replace("&", "?");
//         const body = utils.formatLogQuery(rpc.params[0]);

//         return {
//             Method: "POST",
//             Body: body,
//             URL: "/events" + query,
//             ResFormatter: (v) => {
//                 if (!v) { return v; }
//                 for (const item of v) {
//                     item.blockNumber = item.meta.blockNumber;
//                     item.blockHash = item.meta.blockID;
//                     item.transactionHash = item.meta.txID;
//                 }
//                 return v;
//             },
//         };
//     },
// },
// eth_getBlockRef: {
//     prepare(payload: any): InterceptorRet {
//         return {
//             Method: "GET",
//             Body: {},
//             URL: "/blocks/best",
//             ResFormatter: (v) => {
//                 if (!v) {
//                     return null;
//                 } else if (v.id) {
//                     return v.id.substr(0, 18);
//                 } else {
//                     return null;
//                 }
//             },
//         };
//     },
// },
// eth_getChainTag: {
//     prepare(payload: any): InterceptorRet {
//         return {
//             Method: "GET",
//             Body: {},
//             URL: "/blocks/0",
//             ResFormatter: (v) => {
//                 if (!v) {
//                     return null;
//                 } else if (v.id && v.id.length === 66) {
//                     return "0x" + v.id.substr(64, 2);
//                 } else {
//                     return null;
//                 }
//             },
//         };
//     },
// },
// thor_test: {
//     prepare(payload: any): InterceptorRet {
//         return {
//             Method: payload.testMethod && payload.testMethod === "POST" ? "POST" : "GET",
//             Body: payload.testBody || {},
//             URL: "/thor/test",
//             ResFormatter: () => { if (payload.testResult) { return payload.testResult; } else { return {}; } },
//         };
//     },
// },
