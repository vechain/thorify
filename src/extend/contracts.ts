'use strict'
const debug = require('debug')('thor:injector')
const Subscription = require('web3-core-subscriptions').subscription
import { LogFilterOptions } from '../types'
import * as utils from '../utils'
import { inputLogFilterFormatter } from './formatters'

const extendContracts = function(web3: any) {
    const _encodeEventABI = web3.eth.Contract.prototype._encodeEventABI
    web3.eth.Contract.prototype._encodeEventABI = function(event: any, options: any): any {
        debug('_encodeEventABI')
        const result = _encodeEventABI.call(this, event, options)
        if (options.options) {
            result.options = options.options
        }
        if (options.range) {
            result.range = options.range
        }
        if (options.order) {
            result.order = options.order
        }
        return result
    }

    web3.eth.Contract.prototype._on = function() {
        debug('_on')
        // keeps the code from web3
        const subOptions = this._generateEventOptions.apply(this, arguments)

        // prevent the event "newListener" and "removeListener" from being overwritten
        this._checkListener('newListener', subOptions.event.name, subOptions.callback)
        this._checkListener('removeListener', subOptions.event.name, subOptions.callback)

        // TODO check if listener already exists? and reuse subscription if options are the same.

        // create new subscription
        /* changes from web3 starts the following
         */

        // subscription options in thor doesn't support array as topic filter object
        const filterOptions: LogFilterOptions = {
            address: subOptions.params.address,
        }
        debug('Contract filter option: %O', filterOptions)

        if (subOptions.params.topics) {
            for (const [index, value] of subOptions.params.topics.entries()) {
                if (value === null) {
                    continue
                }
                if (typeof value === 'string') {
                    filterOptions['t' + index as 't0' | 't1' | 't2' | 't3' | 't4'] = value
                } else {
                    throw new Error('[thorify] Array filter option is not supported in thor, must be null or bytes32 string')
                }
            }
        }

        const decodeEventABI = this._decodeEventABI.bind(subOptions.event)
        const subscription = new Subscription({
            subscription: {
                params: 1,
                inputFormatter: [inputLogFilterFormatter],
                subscriptionHandler(subscriptionMsg: any) {
                    if (subscriptionMsg.error) {
                        this.emit('error', subscriptionMsg.error)
                        if (utils.isFunction(this.callback)) {
                            this.callback(subscriptionMsg.error, null, this)
                        }
                        this.unsubscribe()
                    } else {
                        const result = decodeEventABI(subscriptionMsg.data)
                        if (result.removed) {
                            this.emit('changed', result)
                        } else {
                            this.emit('data', result)
                        }
                        if (utils.isFunction(this.callback)) {
                            this.callback(null, result, this)
                        }
                    }
                },
            },
            type: 'eth',
            requestManager: this._requestManager,
        })
        subscription.subscribe('logs', filterOptions, subOptions.callback || function() {})

        return subscription
    }
}

export {
    extendContracts,
}
