'use strict'
import { parse } from 'url'
import { Callback } from '../types'
const debug = require('debug')('thor:http-provider')
import { EventEmitter } from 'eventemitter3'
import WebSocket = require('isomorphic-ws')
import * as QS from 'querystring'
import { JSONRPC } from './json-rpc'
import { RPCExecutor, RPCMethodMap } from './rpc-methods'

interface Sockets {
    [index: number]: {
        rpc: JSONRPC,
        ws: WebSocket,
    }
}

class ThorProvider extends EventEmitter {
    private RESTHost: string
    private WSHost: string
    private timeout: number
    private sockets: Sockets

    constructor(host: string, timeout = 0) {
        super()
        if (!host) { throw new Error('[thor-provider]Thorify requires that the host be specified(e.g. "http://localhost:8669")') }

        const hostURL = parse(host)
        if (!hostURL.protocol || !hostURL.host) {
            throw new Error('[thor-provider]Parsing url failed!')
        }

        this.RESTHost = `${hostURL.protocol}//${hostURL.host}`
        this.WSHost = `${hostURL.protocol.replace('http', 'ws')}//${hostURL.host}`
        this.timeout = timeout
        this.sockets = []
    }

    public sendAsync(payload: any, callback: Callback) {
        debug('payload: %O', payload)
        const rpc = new JSONRPC(payload)

        // kindly remind developers about the usage about send transaction
        if (rpc.method === 'eth_sendTransaction') {
            return callback(null, rpc.makeError('[thor-provider]The private key corresponding to from filed can\'t be found in local eth.accounts.wallet!'))
        }

        // subscriptions
        if (rpc.method === 'eth_subscribe' || rpc.method === 'eth_unsubscribe') {
            return this.ManagerSubscription(rpc, callback)
        }

        if (RPCMethodMap.has(rpc.method)) {
            const executor = RPCMethodMap.get(rpc.method) as RPCExecutor
            executor(rpc, this.RESTHost, this.timeout).then((ret) => {
                debug('response: %O', ret.result)
                omitCallBackedPromise(callback(null, ret))
                return
            }).catch((err) => {
                omitCallBackedPromise(callback(err, null))
                return
            })
        } else {
            callback(null, rpc.makeError('[thor-provider]Method not supported!'))
            return
        }

    }

    public ManagerSubscription(rpc: JSONRPC, callback: Callback) {
        let query = ''
        if (rpc.method === 'eth_subscribe') {
            let URI = '/subscriptions/'
            switch (rpc.params[0]) {
                case 'newHeads':
                    URI += 'block'
                    if (rpc.params[1] && rpc.params[1] !== 'best') {
                        URI += '?pos=' + rpc.params[1]
                    }
                    break
                case 'logs':
                    URI += 'event'
                    query = QS.stringify(rpc.params[1])
                    if (query) {
                        URI += '?' + query
                    }
                    break
                case 'transfers':
                    URI += 'transfer'
                    query = QS.stringify(rpc.params[1])
                    if (query) {
                        URI += '?' + query
                    }
                    break
                default:
                    callback(null, rpc.makeError(`Subscription ${rpc.params[0]} not supported!`))
                    return
            }

            /*  web3-core-requestmanager doesn't respond to error event, so in thorify both "data" level and "error" level are emitted
                by "data" event and will add subscriptionHandler to handle the message, regarding the process in request manager, the
                format of data emitted is not the standard JSON-RPC format, so built to func makeSubResult and makeSubError to work with that
            */

            const ws = new WebSocket(this.WSHost + URI)

            ws.onerror = (event) => {
                debug('error from ws: %O', event)
                this.emit('data', rpc.makeSubError(event.error ? event.error : 'Error from upstream'))
            }

            ws.onmessage = (event) => {
                debug('[ws]message from ws: %O', event.data)
                try {
                    // wrong type define of message, typeof message turns to be string
                    const obj = JSON.parse(event.data as string)

                    obj.removed = obj.obsolete
                    delete obj.obsolete
                    this.emit('data', rpc.makeSubResult(obj))
                } catch (e) {
                    debug('Parse message failed %O', e)
                }
            }

            ws.onopen = () => {
                debug('[ws]opened')
                ws.onclose = (event) => {
                    debug('[ws]close', event.code, event.reason)
                    this.emit('data', rpc.makeSubError(new Error(`Connection closed${event.reason ? (':' + event.reason) : ''}`)))
                }
            }

            this.sockets[rpc.id] = {rpc, ws}

            callback(null, rpc.makeResult(rpc.id))
            return
        } else {
            if (this.sockets[rpc.params[0]]) {
                const ws = this.sockets[rpc.params[0]].ws
                if (ws && ws.readyState === ws.OPEN) {
                    ws.close()

                    // clean up
                    if (ws.removeAllListeners) {
                        ws.removeAllListeners()
                    } else {
                        ws.onopen = null!
                        ws.onerror = null!
                        ws.onmessage = null!
                        ws.onclose = null!
                    }

                    delete this.sockets[rpc.params[0]]
                    callback(null, rpc.makeResult(true))
                } else {
                    delete this.sockets[rpc.params[0]]
                    callback(null, rpc.makeResult(true))
                }
            } else {
                callback(null, rpc.makeResult(true))
            }

        }
    }
}

const omitCallBackedPromise = function(callBackedRet: any) {
        /*  when developer calling a method using promise,when error return from provider,the function in web3-core-method
            will return a Promise in,it's ok when writing provider in callback mode but it will cause problems when
            writing provider in Promise, this function is used to omit the rejected promise
        */

        if (callBackedRet && callBackedRet.catch) {
            callBackedRet.catch(() => null)
        }
}

export {
    ThorProvider,
}
