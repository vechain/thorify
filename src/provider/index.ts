'use strict'
import { parse } from 'url'
import { Callback } from '../types'
const debug = require('debug')('thor:http-provider')
import {EventEmitter} from 'eventemitter3'
import * as WebSocket from 'ws'
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
        if (!host) { throw new Error('[thorify-provider] Thorify requires that the host be specified (e.g. "http://localhost:8669")') }

        const hostURL = parse(host)
        if (!hostURL.protocol) {
            hostURL.protocol = 'http:'
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
            return callback(null, rpc.makeError('The private key corresponding to from filed can\'t be found in local eth.accounts.wallet!'))
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
            callback(null, rpc.makeError('Method not supported!'))
            return
        }

    }

    public ManagerSubscription(rpc: JSONRPC, callback: Callback) {
        if (rpc.method === 'eth_subscribe') {
            let URI = '/subscriptions/'
            switch (rpc.params[0]) {
                case 'newHeads':
                    URI += 'block'
                    break
                default:
                    callback(new Error(`Subscription ${rpc.params[0]} not supported!`))
                    return
            }

            /*  web3-core-requestmanager doesn't respond to error event, so in thorify both "data" level and "error" level are emitted
                by "data" event and will add subscriptionHandler to handle the message, regarding the process in request manager, the
                format of data emitted is not the standard JSON-RPC format, so built to func makeSubResult and makeSubError to work with that
            */

            const ws = new WebSocket(this.WSHost + URI)

            ws.on('error', (error) => {
                debug('error from ws: %O', error)
                this.emit('data', rpc.makeSubError(error))
            })

            ws.on('message', (message) => {
                debug('[ws]message from ws: %O', message)
                try {
                    // wrong type define of message, typeof message turns to be string
                    const obj = JSON.parse(message as string)

                    obj.removed = obj.obsolete
                    delete obj.obsolete
                    this.emit('data', rpc.makeSubResult(obj))
                } catch (e) {
                    debug('Parse message failed %O', e)
                }
            })

            ws.on('open', () => {
                debug('[ws]opened')
                ws.on('close', (code, reason) => {
                    debug('[ws]close', code, reason)
                    this.emit('data', rpc.makeSubError(new Error('Connection closed')))
                })
            })

            this.sockets[rpc.id] = {rpc, ws}

            callback(null, rpc.makeResult(rpc.id))
            return
        } else {
            if (this.sockets[rpc.params[0]]) {
                const ws = this.sockets[rpc.params[0]].ws
                if (ws && ws.readyState === ws.OPEN) {
                    ws.terminate()
                    ws.removeAllListeners()
                    ws.on('close', () => {
                        delete this.sockets[rpc.params[0]]
                        callback(null, rpc.makeResult(true))
                    })
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
