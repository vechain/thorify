'use strict'
const Subscriptions = require('web3-core-subscriptions').subscriptions
import * as utils from '../utils'
import { inputBlockFilterFormatter, inputLogFilterFormatter, inputTransferFilterFormatter } from './formatters'

const extendMethods = function(web3: any) {
    web3.extend({
        property: 'eth',
        methods: [
            new web3.extend.Method({
                name: 'getEnergy',
                call: 'eth_getEnergy',
                params: 2,
                inputFormatter: [web3.extend.utils.toAddress, web3.extend.formatters.inputDefaultBlockNumberFormatter],
                outputFormatter: web3.extend.formatters.outputBigNumberFormatter,
            }),
            new web3.extend.Method({
                name: 'getTransaction',
                call: 'eth_getTransactionByHash',
                params: 1,
                inputFormatter: [null],
                outputFormatter: web3.extend.formatters.outputTransactionFormatter,
            }),
            new web3.extend.Method({
                name: 'getTransactionReceipt',
                call: 'eth_getTransactionReceipt',
                params: 1,
                inputFormatter: [null],
                outputFormatter: web3.extend.formatters.outputTransactionReceiptFormatter,
            }),
            new web3.extend.Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                accounts: web3.eth.accounts,
                params: 1,
                inputFormatter: [web3.extend.formatters.inputTransactionFormatter],
            }),
            new web3.extend.Method({
                name: 'getBlockRef',
                call: 'eth_getBlockRef',
                params: 0,
            }),
            new web3.extend.Method({
                name: 'getChainTag',
                call: 'eth_getChainTag',
                params: 0,
            }),
            new web3.extend.Method({
                name: 'getPastLogs',
                call: 'eth_getLogs',
                params: 1,
                inputFormatter: [web3.extend.formatters.inputLogFormatter],
                outputFormatter: web3.extend.formatters.outputLogFormatter,
            }),
        ],
    })

    // subscriptions
    const subs = new Subscriptions({
        name: 'subscribe',
        type: 'eth',
        subscriptions: {
            newBlockHeaders: {
                subscriptionName: 'newHeads',
                params: 1,
                inputFormatter: [inputBlockFilterFormatter],
                subscriptionHandler(subscriptionMsg: any) {
                    if (subscriptionMsg.error) {
                        this.emit('error', subscriptionMsg.error)
                         // web3-core-subscriptions/subscription sets a default value for this.callback
                        this.callback(subscriptionMsg.error, null, this)
                    } else {
                        const result = web3.extend.formatters.outputBlockFormatter(subscriptionMsg.data)
                        if (result.removed) {
                            this.emit('changed', result)
                        } else {
                            this.emit('data', result)
                        }
                        // web3-core-subscriptions/subscription sets a default value for this.callback
                        this.callback(null, result, this)
                    }
                },
            },
            logs: {
                params: 1,
                inputFormatter: [inputLogFilterFormatter],
                subscriptionHandler(subscriptionMsg: any) {
                    if (subscriptionMsg.error) {
                        this.emit('error', subscriptionMsg.error)
                        // web3-core-subscriptions/subscription sets a default value for this.callback
                        this.callback(subscriptionMsg.error, null, this)
                    } else {
                        const result = web3.extend.formatters.outputLogFormatter(subscriptionMsg.data)
                        if (result.removed) {
                            this.emit('changed', result)
                        } else {
                            this.emit('data', result)
                        }
                        // web3-core-subscriptions/subscription sets a default value for this.callback
                        this.callback(null, result, this)
                    }
                },
            },
            transfers: {
                params: 1,
                inputFormatter: [inputTransferFilterFormatter],
                subscriptionHandler(subscriptionMsg: any) {
                    if (subscriptionMsg.error) {
                        this.emit('error', subscriptionMsg.error)
                        // web3-core-subscriptions/subscription sets a default value for this.callback
                        this.callback(subscriptionMsg.error, null, this)
                    } else {
                        const result = subscriptionMsg.data
                        if (result.removed) {
                            this.emit('changed', result)
                        } else {
                            this.emit('data', result)
                        }
                        // web3-core-subscriptions/subscription sets a default value for this.callback
                        this.callback(null, result, this)
                    }
                },
            },
        },
    })

    subs.attachToObject(web3.eth)
    subs.setRequestManager(web3.eth._requestManager)

    web3.eth.clearSubscriptions = web3.eth._requestManager.clearSubscriptions.bind(web3.eth._requestManager)
}

export {
    extendMethods,
}
