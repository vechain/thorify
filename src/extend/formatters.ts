'use strict'
const debug = require('debug')('thor:injector')
const web3Utils = require('web3-utils')
import { LogFilterOptions, TransferFilterOptions } from '../types'
import * as utils from '../utils'

const extendFormatters = function(web3: any) {

    const outputTransactionFormatter = web3.extend.formatters.outputTransactionFormatter
    web3.extend.formatters.outputTransactionFormatter = function(tx: any) {
        if (tx && tx.isThorified) {
            debug('outputTransactionFormatter')
            tx.gas = web3Utils.hexToNumber(tx.gas)
            tx.chainTag = web3Utils.numberToHex(tx.chainTag)

            if (tx.origin) {
                tx.origin = web3Utils.toChecksumAddress(tx.origin)
            }
            if (tx.clauses) {
                for (const clause of tx.clauses) {
                    clause.value = web3.extend.formatters.outputBigNumberFormatter(clause.value)
                    if (clause.to && web3Utils.isAddress(clause.to)) { // tx.to could be `0x0` or `null` while contract creation
                        clause.to = web3Utils.toChecksumAddress(clause.to)
                    } else {
                        clause.to = null // set to `null` if invalid address
                    }
                }
            }
            return tx
        } else {
            return outputTransactionFormatter(tx)
        }
    }

    const outputTransactionReceiptFormatter = web3.extend.formatters.outputTransactionReceiptFormatter
    web3.extend.formatters.outputTransactionReceiptFormatter = function(receipt: any) {
        if (receipt && receipt.isThorified) {
            debug('outputTransactionReceiptFormatter')

            if (receipt.hasOwnProperty('transactionIndex')) {
                delete receipt.transactionIndex
            }
            if (receipt.hasOwnProperty('cumulativeGasUsed')) {
                delete receipt.cumulativeGasUsed
            }

            receipt.gasUsed = web3Utils.hexToNumber(receipt.gasUsed)

            if (receipt.gasPayer) {
                receipt.gasPayer = web3Utils.toChecksumAddress(receipt.gasPayer)
            }
            if (receipt.meta && receipt.meta.txOrigin) {
                receipt.meta.txOrigin = web3Utils.toChecksumAddress(receipt.meta.txOrigin)
            }

            for (const output of receipt.outputs) {
                if (web3Utils._.isArray(output.events)) {
                    output.events = output.events.map((event: any) => {
                        if (!event.isThorified) {
                            Object.defineProperty(event, 'isThorified', { get: () => true })
                        }
                        return web3.extend.formatters.outputLogFormatter(event)
                    })
                }

                if (output.contractAddress) {
                    output.contractAddress = web3Utils.toChecksumAddress(output.contractAddress)
                }
            }

            return receipt
        } else {
            return outputTransactionReceiptFormatter(receipt)
        }
    }

    const outputLogFormatter = web3.extend.formatters.outputLogFormatter
    web3.extend.formatters.outputLogFormatter = function(log: any) {
        if (log && log.isThorified) {
            debug('outputLogFormatter')
            if (log.hasOwnProperty('transactionIndex')) {
                delete log.transactionIndex
            }
            if (log.hasOwnProperty('logIndex')) {
                delete log.logIndex
            }
            if (log.hasOwnProperty('id')) {
                delete log.id
            }

            if (log.address) {
                log.address = web3Utils.toChecksumAddress(log.address)
            }

            return log
        } else {
            return outputLogFormatter(log)
        }
    }
}

const validAddressOrError = function(input: any, msg= 'Invalid address string') {
    if (/^(-0x|0x)?[0-9a-fA-F]{40}$/i.test(input)) {
        return utils.toPrefixedHex(input)
    } else {
        throw new Error(msg)
    }
}

const validBytes32 = function(input: any, msg = 'Invalid hex string') {
    if (/^(-0x|0x)?[0-9a-fA-F]{64}$/i.test(input)) {
        return utils.toPrefixedHex(input)
    } else {
        throw new Error(msg)
    }
}

const inputLogFilterFormatter = function(options: LogFilterOptions) {
    if (options) {
        const logFilterOptions: LogFilterOptions = {}
        if (options.address) {
            logFilterOptions.address = validAddressOrError(options.address)
        }
        if (options.position) {
            logFilterOptions.position = validBytes32(options.position, 'Invalid position(block ID)')
        }
        if (options.t0) {
            logFilterOptions.t0 = validBytes32(options.t0, 'Invalid topic0')
        }
        if (options.t1) {
            logFilterOptions.t1 = validBytes32(options.t1, 'Invalid t1')
        }
        if (options.t2) {
            logFilterOptions.t2 = validBytes32(options.t2, 'Invalid t2')
        }
        if (options.t3) {
            logFilterOptions.t3 = validBytes32(options.t3, 'Invalid t3')
        }
        if (options.t4) {
            logFilterOptions.t4 = validBytes32(options.t4, 'Invalid t4')
        }
        return logFilterOptions
    }
}

const inputBlockFilterFormatter = function(blockID: string|null) {
    if (blockID) {
        blockID = validBytes32(blockID, 'Invalid position(block ID)')
        return blockID
    }
}

const inputTransferFilterFormatter = function(options: TransferFilterOptions) {
    if (options) {
        const transferFilterOptions: TransferFilterOptions = {}
        if (options.position) {
            transferFilterOptions.position = validBytes32(options.position, 'Invalid position(block ID)')
        }
        if (options.txOrigin) {
            transferFilterOptions.txOrigin = validAddressOrError(options.txOrigin)
        }
        if (options.sender) {
            transferFilterOptions.sender = validAddressOrError(options.sender)
        }
        if (options.recipient) {
            transferFilterOptions.recipient = validAddressOrError(options.recipient)
        }
        return transferFilterOptions
    }
}

export {
    extendFormatters,
    inputLogFilterFormatter,
    inputBlockFilterFormatter,
    inputTransferFilterFormatter,
}
