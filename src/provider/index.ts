"use strict";
import { parse } from "url";
import {Callback} from "../types";
const debug = require("debug")("thor:http-provider");
import { JSONRPC } from "./json-rpc";
import { RPCExecutor, RPCMethodMap } from "./rpc-methods";

class ThorProvider {
    private RESTHost: string;
    private WSHost: string;
    private timeout: number;

    constructor(host: string, timeout = 0) {
        if (!host) { throw new Error('[thorify-provider] Thorify requires that the host be specified (e.g. "http://localhost:8669")'); }

        const hostURL = parse(host);
        if (!hostURL.protocol) {
            hostURL.protocol = "http:";
        }

        this.RESTHost = `${hostURL.protocol}//${hostURL.host}`;
        this.WSHost = `${hostURL.protocol.replace("http", "ws")}//${hostURL.host}`;
        this.timeout = timeout;
    }

    public sendAsync(payload: any, callback: Callback) {
        debug("payload: %O", payload);
        const rpc = new JSONRPC(payload);

        if (rpc.method === "eth_sendTransaction") {
            return callback(null, rpc.makeError("The private key corresponding to from filed can't be found in local eth.accounts.wallet!"));
        }

        if (RPCMethodMap.has(rpc.method)) {
            const executor = RPCMethodMap.get(rpc.method) as RPCExecutor;
            executor(rpc, this.RESTHost, this.timeout).then((ret) => {
                debug("response: %O", ret.result);
                omitCallBackedPromise(callback(null, ret));
                return;
            }).catch((err) => {
                omitCallBackedPromise(callback(err, null));
                return;
            });
        } else {
            callback(null, rpc.makeError("Method not supported!"));
            return;
        }

    }
}

const omitCallBackedPromise = function(callBackedRet: any) {
    if (callBackedRet && callBackedRet.catch) {
        callBackedRet.catch(() => null);
    }
};

export {
    ThorProvider,
};
