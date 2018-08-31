"use strict";
import * as utils from "../utils";

export interface RPCPayload {
    id: number;
    jsonrpc: "2.0";
    method: string;
    params: any;
}

export interface RPCResult {
    id: number;
    jsonrpc: "2.0";
    result?: any;
    error?: {
        message: string;
    };
}

const thorifyResult = function(result: any) {
    // tricks for compatible with original web3 instance
    // non-objects or non-arrays doesn't need isThorified property since thorify just overwritten 3 formatters
    // which all accept object as input
    if (utils.isArray(result)) {
        result = result.map((item: any) => {
            Object.defineProperty(item, "isThorified", { get: () => true });
            return item;
        });
    } else if (utils.isObject(result)) {
        Object.defineProperty(result, "isThorified", { get: () => true });
    }
    return result;
};

export class JSONRPC {
    public id: number;
    public method: string;
    public params: any;

    constructor(payload: RPCPayload) {
        this.id = payload.id;
        this.method = payload.method;
        this.params = payload.params;
    }

    public makeResult(result: any): RPCResult {
        return {
            id: this.id,
            jsonrpc: "2.0",
            result: thorifyResult(result),
        };
    }

    public makeError(message: string): RPCResult {
        return {
            id: this.id,
            jsonrpc: "2.0",
            error: {
                message,
            },
        };
    }
}
