'use strict'
const debug = require('debug')('thor:injector')
const web3Utils = require('web3-utils')

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

export {
    extendFormatters,
}
