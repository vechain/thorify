'use strict'

import { expect } from 'chai'
import * as utils from '../../src/utils'

describe('utils:validNumberOrDefault', () => {

    it('input hex string', () => {
        const ret = utils.validNumberOrDefault('0x64', 1)
        expect(ret).to.be.equal(100)
    })

    it('input string', () => {
        const ret = utils.validNumberOrDefault('100', 1)
        expect(ret).to.be.equal(100)
    })

    it('input negative string', () => {
        const ret = utils.validNumberOrDefault('-100', 1)
        expect(ret).to.be.equal(100)
    })

    it('input negative number', () => {
        const ret = utils.validNumberOrDefault(-100, 1)
        expect(ret).to.be.equal(100)
    })

    it('input number', () => {
        const ret = utils.validNumberOrDefault(100, 1)
        expect(ret).to.be.equal(100)
    })

    it('input NaN', () => {
        const ret = utils.validNumberOrDefault(NaN, 1)
        expect(ret).to.be.equal(1)
    })

})

describe('utils:validOrError', () => {
    it('validAddressOrError with valid input', () => {
        expect(utils.validAddressOrError('7567d83b7b8d80addcb281a71d54fc7b3364ffed')).to.be.equal('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed')
    })

    it('validAddressOrError with valid input', () => {
        expect(() => { utils.validAddressOrError('67d83b7b8d80addcb281a71d54fc7b3364ffed') }).to.throw('Invalid address string')
    })

    it('validBytes32OrError with valid input', () => {
        expect(utils.validBytes32OrError('0009850025c90b3f0c6924cdf63fea15bbd53d9ffb620a3845ef76ab1f1b8c08')).to.be.equal('0x0009850025c90b3f0c6924cdf63fea15bbd53d9ffb620a3845ef76ab1f1b8c08')
    })

    it('validBytes32OrError with valid input', () => {
        expect(() => { utils.validBytes32OrError('09850025c90b3f0c6924cdf63fea15bbd53d9ffb620a3845ef76ab1f1b8c08') }).to.throw('Invalid hex string')
    })
})

describe('utils:is-type', () => {

    it('isArray with valid input', () => {
        expect(utils.isArray([])).to.be.equal(true)
    })

    it('isArray with invalid input', () => {
        expect(utils.isArray({})).to.be.equal(false)
    })

    it('isObject with valid input', () => {
        expect(utils.isObject({})).to.be.equal(true)
    })

    it('isObject with invalid input', () => {
        expect(utils.isObject(null)).to.be.equal(false)
    })

    it('isNull with valid input', () => {
        expect(utils.isNull(null)).to.be.equal(true)
    })

    it('isNull with invalid input', () => {
        expect(utils.isNull(undefined)).to.be.equal(false)
    })

    it('isUndefined with valid input', () => {
        expect(utils.isUndefined(undefined)).to.be.equal(true)
    })

    it('isUndefined with invalid input', () => {
        expect(utils.isUndefined(null)).to.be.equal(false)
    })

    it('isFunction with valid input', () => {
        expect(utils.isFunction(() => { return })).to.be.equal(true)
    })

    it('isFunction with invalid input', () => {
        expect(utils.isFunction('')).to.be.equal(false)
    })

})

describe('utils:utilities', () => {

    it('calcIntrinsicGas with empty code contract creation', () => {
        const ret = utils.calcIntrinsicGas({})
        expect(ret).to.be.equal(53000)
    })

    it('calcIntrinsicGas with normal tx', () => {
        const ret = utils.calcIntrinsicGas({ to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed', value: '0x64' })
        expect(ret).to.be.equal(21000)
    })

    it('calcIntrinsicGas with data', () => {
        const ret = utils.calcIntrinsicGas({ data: '0x0001' })
        expect(ret).to.be.equal(53072)
    })

    it('toPrefixedHex with 0x prefix', () => {
        expect(utils.toPrefixedHex('0x0001')).to.be.equal('0x0001')
    })

    it('toPrefixedHex without 0x prefix', () => {
        expect(utils.toPrefixedHex('0001')).to.be.equal('0x0001')
    })

    it('isHex without 0x prefix', () => {
        expect(utils.isHex('0001')).to.be.equal(true)
    })

    it('isHex', () => {
        expect(utils.isHex('0x')).to.be.equal(false)
    })

    it('newNonce', () => {
        expect(utils.newNonce()).is.a('number')
    })

    it('sanitizeHex', () => {
        expect(utils.sanitizeHex('0001')).to.be.equal('0001')
    })

    it('toInteger with valid input', () => {
        expect(utils.toInteger('0x64')).to.be.equal(100)
    })

    it('toInteger with invalid input', () => {
        expect(utils.toInteger('invalid input')).to.be.equal(null)
    })

})
