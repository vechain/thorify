'use strict'

import {Transaction} from 'thor-devkit'
import * as utils from '../utils'
import { JSONRPC, RPCResult } from './json-rpc'
import { HTTP, SimpleResponse } from './simple-http'
const debug = require('debug')('thor:http-provider:rpc')

export type RPCExecutor = (rpc: JSONRPC, host: string, timeout: number) => Promise<RPCResult>

export const RPCMethodMap = new Map<string, RPCExecutor>()

const HTTPPostProcessor = function(res: SimpleResponse): Promise<any> {
    if (res.Code === 0) {
        return Promise.reject(new Error(`[thor-provider] Invalid response, check the host`))
    }
    if (res.Code !== 200) {
        return Promise.reject(new Error(res.Body ? res.Body as string : ('[thor-provider] Invalid response code from provider: ' + res.Code) ))
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
    const URL = host + '/accounts/' + rpc.params[0] + '?revision=' + utils.fromETHBlockNumberOrHash(rpc.params[1])

    const res = await HTTP.get(URL, timeout).then(HTTPPostProcessor)

    return rpc.makeResult(!res ? null : res.balance)
})

RPCMethodMap.set('eth_getEnergy', async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + '/accounts/' + rpc.params[0] + '?revision=' + utils.fromETHBlockNumberOrHash(rpc.params[1])

    const res = await HTTP.get(URL, timeout).then(HTTPPostProcessor)

    return rpc.makeResult(!res ? null : res.energy)
})

RPCMethodMap.set('eth_getCode', async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + '/accounts/' + rpc.params[0] + '/code?revision=' + utils.fromETHBlockNumberOrHash(rpc.params[1])

    const res = await HTTP.get(URL, timeout).then(HTTPPostProcessor)

    return rpc.makeResult(!res ? null : res.code)
})

RPCMethodMap.set('eth_getStorageAt', async function(rpc: JSONRPC, host: string, timeout: number) {
    const URL = host + '/accounts/' + rpc.params[0] + '/storage/' + utils.leftPadToBytes32(rpc.params[1]) + '?revision=' + utils.fromETHBlockNumberOrHash(rpc.params[2])

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
    const extraURI = '?revision=' + utils.fromETHBlockNumberOrHash(rpc.params[1])
    const URL = host + '/accounts/*' + extraURI

    const reqBody: any = {
        clauses: [{
            to: rpc.params[0].to || null,
            value: rpc.params[0].value || '',
            data: rpc.params[0].data || '0x',
        }],
        gasPrice: rpc.params[0].gasPrice || undefined,
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

    debug('eth_call returns', res)
    if (!res || res.length === 0) {
        return rpc.makeResult(null)
    } else {
        const result = res[0]
        if (result.reverted || result.vmError) {
            if (result.data && (result.data as string).startsWith('0x08c379a0')) {
                return rpc.makeError('VM reverted: ' + require('web3-eth-abi').decodeParameter('string', result.data.replace(/^0x08c379a0/i, '')))
            } else {
                return rpc.makeError('VM executing failed' + (result.vmError ? ': ' + result.vmError : ''))
            }
        } else {
            return rpc.makeResult(result.data === '0x' ? '' : result.data)
        }
    }
})

RPCMethodMap.set('eth_estimateGas', async function(rpc: JSONRPC, host: string, timeout: number) {
    const extraURI = '?revision=' + utils.fromETHBlockNumberOrHash(rpc.params[1])
    const URL = host + '/accounts/*' + extraURI

    const reqBody: any = {
        clauses: [{
            to: rpc.params[0].to || null,
            value: rpc.params[0].value || '',
            data: rpc.params[0].data || '0x',
        }],
        gasPrice: rpc.params[0].gasPrice || undefined,
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

    if (!res || res.length === 0) {
        return rpc.makeResult(null)
    } else {
        const result = res[0]
        if (result.reverted || result.vmError) {
            if (result.data && (result.data as string).startsWith('0x08c379a0')) {
                return rpc.makeError('Gas estimation failed with VM reverted: ' + require('web3-eth-abi').decodeParameter('string', result.data.replace(/^0x08c379a0/i, '')))
            } else {
                return rpc.makeError('Gas estimation failed' + (result.vmError ? ': ' + result.vmError : ''))
            }
        } else {
            debug('VM gas:', result.gasUsed)
            // ignore the overflow since block gas limit is uint64 and JavaScript's max number is 2^53
            const intrinsicGas = Transaction.intrinsicGas(reqBody.clauses)
            // increase vm gas by 15000 for safe since it's estimated from current block state, final state for the transaction is not determined for now
            return rpc.makeResult(intrinsicGas + (result.gasUsed ? (result.gasUsed + 15000) : 0))
        }
    }
})

RPCMethodMap.set('eth_getLogs', async function(rpc: JSONRPC, host: string, timeout: number) {
    const reqBody = utils.formatLogQuery(rpc.params[0])

    const URL = host + '/logs/event'
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
