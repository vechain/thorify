'use strict'
const web3Utils = require('web3-utils')
import { EthTransaction } from '../types'
import { params } from './params'

export * from './params'
export * from './option-formatters'

export const calcIntrinsicGas = function(tx: EthTransaction): number {
    let totalGas = params.TxGas

    // calculate data gas
    if (tx.data) {
        const buffer = new Buffer(sanitizeHex(tx.data), 'hex')
        let z = 0
        let nz = 0
        for (const byte of buffer) {
            if (byte) {
                nz++
            } else {
                z++
            }
        }
        totalGas += params.TxDataZeroGas * z
        totalGas += params.TxDataNonZeroGas * nz
    }

    if (!!tx.to) {
        totalGas += params.ClauseGas
    } else {
        totalGas += params.ClauseGasContractCreation
    }

    return totalGas
}

export const toPrefixedHex = function(hexStr: string): string {
    if (hexStr.indexOf('0x') === 0) {
        return hexStr
    } else {
        return '0x' + hexStr
    }
}

export const sanitizeHex = function(hexStr: string): string {
    if (hexStr.indexOf('0x') === 0) {
        return hexStr.substr(2)
    } else {
        return hexStr
    }
}

export const isHex = function(hex: string): boolean {
    return !!hex && ((typeof hex === 'string') && /^(-0x|0x)?[0-9a-f]+$/i.test(hex))
}

export const newNonce = function(): number {
    return Math.floor((new Date().getTime() / 0xffff) * Math.random() * 0xffff)
}

export const toInteger = function(input: any): number | null {
    const num = Number.parseInt(input)
    if (Number.isInteger(num)) {
        return num
    } else {
        return null
    }
}

export const isArray = function(o: any): boolean {
    return Object.prototype.toString.call(o) === '[object Array]'
}

export const isObject = function(o: any): boolean {
    return Object.prototype.toString.call(o) === '[object Object]'
}

export const isNull = function(o: any): boolean {
    return Object.prototype.toString.call(o) === '[object Null]'
}

export const isUndefined = function(o: any): boolean {
    return Object.prototype.toString.call(o) === '[object Undefined]'
}

export const isFunction = function(o: any): boolean {
    return typeof o === 'function'
}

export const mustToBN = function(value: any) {
    if (isNull(value) || isUndefined(value)) {
        throw new Error('input can\'t be null or undefined')
    }

    const num = web3Utils.toBN(value)
    return num.abs()
}

export const validNumberOrDefault = function(value: any, defaultValue: number) {
    if (typeof value === 'number' && Number.isInteger(value)) {
        return Math.abs(value)
    }
    if (Number.isNaN(Number.parseInt(value)) === false) {
        return Math.abs(Number.parseInt(value))
    }
    return defaultValue
}

export const validAddressOrError = function(input: any, msg = 'Invalid address string') {
    if (/^(-0x|0x)?[0-9a-fA-F]{40}$/i.test(input)) {
        return toPrefixedHex(input)
    } else {
        throw new Error(msg)
    }
}

export const validBytes32OrError = function(input: any, msg = 'Invalid hex string') {
    if (/^(-0x|0x)?[0-9a-fA-F]{64}$/i.test(input)) {
        return toPrefixedHex(input)
    } else {
        throw new Error(msg)
    }
}

export const leftPadToBytes32 = function(input: string) {
    return ('0x' + '0'.repeat(64 - sanitizeHex(input).length) + sanitizeHex(input))
}
