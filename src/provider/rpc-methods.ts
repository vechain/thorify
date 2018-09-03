'use strict'

import * as utils from '../utils'
import { JSONRPC, RPCResult } from './json-rpc'
import { HTTP, SimpleResponse} from './simple-http'

export type RPCExecutor = (rpc: JSONRPC, host: string, timeout: number) => Promise<RPCResult>

export const RPCMethodMap = new Map<string, RPCExecutor>()

const HTTPPostProcessor = function(res: SimpleResponse): Promise<any> {
    if (res.Code === 0) {
        return Promise.reject(new Error(`[thorify-provider] Invalid response, check the host`))
    }
    if (res.Code !== 200) {
        return Promise.reject(new Error(res.Body ? res.Body as string : ('[thorify-provider] Invalid response code from provider: ' + res.Code) ))
    }
    return Promise.resolve(res.Body)
}

RPCMethodMap.set('eth_getBlockByNumber', async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + '/blocks/' + utils.fromETHBlockNumber(rpc.params[0])

    const res = await HTTP.get(URL, timeout).then(HTTPPostProcessor)

    return rpc.makeResult(res)
})

RPCMethodMap.set('eth_getBlockByHash', async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + '/blocks/' + rpc.params[0]

    const res = await HTTP.get(URL, timeout).then(HTTPPostProcessor)

    return rpc.makeResult(res)
})

RPCMethodMap.set('eth_blockNumber', async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + '/blocks/best'

    const res = await HTTP.get(URL, timeout).then(HTTPPostProcessor)

    return rpc.makeResult(!res  ? null : res.number)
})

RPCMethodMap.set('eth_getBalance', async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + '/accounts/' + rpc.params[0] + '?revision=' + utils.fromETHBlockNumber(rpc.params[1])

    const res = await HTTP.get(URL, timeout).then(HTTPPostProcessor)

    return rpc.makeResult(!res ? null : res.balance)
})

RPCMethodMap.set('eth_getEnergy', async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + '/accounts/' + rpc.params[0] + '?revision=' + utils.fromETHBlockNumber(rpc.params[1])

    const res = await HTTP.get(URL, timeout).then(HTTPPostProcessor)

    return rpc.makeResult(!res ? null : res.energy)
})

RPCMethodMap.set('eth_getCode', async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + '/accounts/' + rpc.params[0] + '/code?revision=' + utils.fromETHBlockNumber(rpc.params[1])

    const res = await HTTP.get(URL, timeout).then(HTTPPostProcessor)

    return rpc.makeResult(!res ? null : res.code)
})

RPCMethodMap.set('eth_getStorageAt', async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + '/accounts/' + rpc.params[0] + '/storage/' + rpc.params[1] + '?revision=' + utils.fromETHBlockNumber(rpc.params[2])

    const res = await HTTP.get(URL, timeout).then(HTTPPostProcessor)

    return rpc.makeResult(!res ? null : res.value)
})

RPCMethodMap.set('eth_sendRawTransaction', async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + '/transactions'
    const reqBody = {
        raw: rpc.params[0],
    }

    const res = await HTTP.post(URL, reqBody, timeout).then(HTTPPostProcessor)

    return rpc.makeResult(!res ? null : res.id)
})

RPCMethodMap.set('eth_getTransactionByHash', async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + '/transactions/' + rpc.params[0]

    const res = await HTTP.get(URL, timeout).then(HTTPPostProcessor)

    if (!res) {
        return rpc.makeResult(null)
    }

    res.blockNumber = res.meta.blockNumber
    return rpc.makeResult(res)
})

RPCMethodMap.set('eth_getTransactionReceipt', async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + '/transactions/' + rpc.params[0] + '/receipt'

    const res = await HTTP.get(URL, timeout).then(HTTPPostProcessor)

    if (!res) {
        return rpc.makeResult(null)
    }

    res.blockNumber = res.meta.blockNumber
    res.blockHash = res.meta.blockID
    res.transactionHash = res.meta.txID
    // For compatible with ethereum's receipt
    if (res.reverted) {
        res.status = '0x0'
    } else {
        res.status = '0x1'
    }
    if (res.outputs.length === 1) {
        res.contractAddress = res.outputs[0].contractAddress
    }

    return rpc.makeResult(res)
})

RPCMethodMap.set('eth_call', async function(rpc: JSONRPC, host: string, timeout: number) {
    let extraURI = ''
    if (rpc.params[0].to) {
        extraURI = '/' + rpc.params[0].to
    }
    extraURI += '?revision=' + utils.fromETHBlockNumber(rpc.params[1])
    const URL = host + '/accounts' + extraURI

    const reqBody: any = {
        value: rpc.params[0].value || '',
        data: rpc.params[0].data || '0x',
        gasPrice: rpc.params[0].gasPrice || '',
    }
    if (rpc.params[0].gas) {
        if (typeof rpc.params[0].gas === 'number') {
            reqBody.gas = rpc.params[0].gas
        } else {
            reqBody.gas = parseInt(utils.sanitizeHex(rpc.params[0].gas), 16)
        }
    }
    if (rpc.params[0].from) {
        reqBody.caller = rpc.params[0].from
    }

    const res = await HTTP.post(URL, reqBody, timeout).then(HTTPPostProcessor)

    if (!res) {
        return rpc.makeResult(null)
    } else {
        if (res.reverted) {
            return rpc.makeResult(null)
        } else {
            return rpc.makeResult(res.data)
        }
    }
})

RPCMethodMap.set('eth_estimateGas', async function(rpc: JSONRPC, host: string, timeout: number) {
    let extraURI = ''
    if (rpc.params[0].to) {
        extraURI = '/' + rpc.params[0].to
    }
    extraURI += '?revision=' + utils.fromETHBlockNumber(rpc.params[1])
    const URL = host + '/accounts' + extraURI

    const reqBody: any = {
        value: rpc.params[0].value || '',
        data: rpc.params[0].data || '0x',
        gasPrice: rpc.params[0].gasPrice || '',
    }
    if (rpc.params[0].gas) {
        if (typeof rpc.params[0].gas === 'number') {
            reqBody.gas = rpc.params[0].gas
        } else {
            reqBody.gas = parseInt(utils.sanitizeHex(rpc.params[0].gas), 16)
        }
    }
    if (rpc.params[0].from) {
        reqBody.caller = rpc.params[0].from
    }

    const res = await HTTP.post(URL, reqBody, timeout).then(HTTPPostProcessor)

    if (!res) {
        return rpc.makeResult(null)
    } else {
        if (res.reverted) {
            return rpc.makeResult(null)
        } else {
            // ignore the overflow since block gas limit is uint64 and JavaScript's max number is 2^53
            const intrinsicGas = utils.calcIntrinsicGas(Object.assign(reqBody, { to: rpc.params[0].to }))
            if (res.gasUsed === 0 && (reqBody.data === '0x')) {
                return rpc.makeResult(intrinsicGas)
            } else {
                return rpc.makeResult(Math.floor(res.gasUsed * 1.2) + intrinsicGas) // increase vm gas with 20% for safe since it's estimated from current block state, final state for the transaction is not determined for now
            }
        }
    }
})

RPCMethodMap.set('eth_getLogs', async function(rpc: JSONRPC, host: string, timeout: number) {
    let query = ''
    if (rpc.params[0].address) {
        query = '&address=' + rpc.params[0].address
    }
    if (rpc.params[0].order && (rpc.params[0].order.toUpperCase() === 'ASC' || rpc.params[0].order.toUpperCase() === 'DESC')) {
        query += '&order=' + rpc.params[0].order.toUpperCase()
    }
    query = query.replace('&', '?')
    const URL = host + '/events' + query

    const reqBody = utils.formatLogQuery(rpc.params[0])

    const res = await HTTP.post(URL, reqBody, timeout).then(HTTPPostProcessor)

    if (!res) {
        return rpc.makeResult(null)
    }

    for (const item of res) {
        item.blockNumber = item.meta.blockNumber
        item.blockHash = item.meta.blockID
        item.transactionHash = item.meta.txID
    }
    return rpc.makeResult(res)

})

RPCMethodMap.set('eth_getBlockRef', async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + '/blocks/best'

    const res = await HTTP.get(URL, timeout).then(HTTPPostProcessor)

    if (!res || !res.id) {
        return rpc.makeResult(null)
    }

    return rpc.makeResult(res.id.substr(0, 18))
})

RPCMethodMap.set('eth_getChainTag', async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + '/blocks/0'

    const res = await HTTP.get(URL, timeout).then(HTTPPostProcessor)

    if (!res || !res.id || res.id.length !== 66) {
        return rpc.makeResult(null)
    }

    return rpc.makeResult('0x' + res.id.substr(64, 2))
})

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
