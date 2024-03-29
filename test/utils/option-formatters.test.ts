'use strict'

import { expect } from 'chai'
import * as utils from '../../src/utils'

describe('utils:fromETHBlockNumber', () => {

    it('with number', () => {
        expect(utils.fromETHBlockNumber(100)).to.be.equal(100)
    })

    it('with number 0', () => {
        expect(utils.fromETHBlockNumber(0)).to.be.equal(0)
    })

    it('with string 0x0', () => {
        expect(utils.fromETHBlockNumber('0x0')).to.be.equal(0)
    })

    it('with valid string', () => {
        expect(utils.fromETHBlockNumber('earliest')).to.be.equal(0)
        expect(utils.fromETHBlockNumber('latest')).to.be.equal('best')
        expect(utils.fromETHBlockNumber('pending')).to.be.equal('best')
    })

    it('with invalid string', () => {
        expect(utils.fromETHBlockNumber('invalid string')).to.be.equal('best')
    })

    it('with invalid type', () => {
        expect(utils.fromETHBlockNumber({})).to.be.equal('best')
    })

})

describe('utils:fromETHBlockNumberOrHash', () => {

    it('with number', () => {
        expect(utils.fromETHBlockNumberOrHash(100)).to.be.equal(100)
    })

    it('with blockID', () => {
        expect(utils.fromETHBlockNumberOrHash('0x000000003a3e7437634e9ab026cd279a88a8f086c2f332421d424668ac976bc7')).to.be.equal('0x000000003a3e7437634e9ab026cd279a88a8f086c2f332421d424668ac976bc7')
    })

})

describe('utils:formatRange', () => {
    it('minimal input', () => {
        const ret = utils.formatRange({ unit: 'block' })
        expect(ret.unit).to.be.equal('block')
        expect(ret.from).to.be.equal(0)
        expect(ret.to).to.be.equal(Number.MAX_SAFE_INTEGER)
    })

    it('normal input', () => {
        const ret = utils.formatRange({ unit: 'block', from: 0, to: 1000 })
        expect(ret.unit).to.be.equal('block')
        expect(ret.from).to.be.equal(0)
        expect(ret.to).to.be.equal(1000)
    })

    it('invalid input', () => {
        const ret = utils.formatRange({ unit: 'time', from: 'invalid-number', to: 'invalid-number' })
        expect(ret.unit).to.be.equal('time')
        expect(ret.from).to.be.equal(0)
        expect(ret.to).to.be.equal(Number.MAX_SAFE_INTEGER)
    })

    it('time range input', () => {
        const ret = utils.formatRange({ unit: 'time', from: 0, to: 1000 })
        console.log(ret)
        expect(ret.unit).to.be.equal('time')
        expect(ret.from).to.be.equal(0)
        expect(ret.to).to.be.equal(1000)
    })

    it('time: invalid input', () => {
        const ret = utils.formatRange({ unit: 'time', from: 'invalid', to: 'invalid' })
        expect(ret.unit).to.be.equal('time')
        expect(ret.from).to.be.equal(0)
        expect(ret.to).to.be.equal(Number.MAX_SAFE_INTEGER)
    })
})

describe('utils:formatOptions', () => {
    it('valid input', () => {
        const ret = utils.formatOptions({ limit: 100, offset: 100 })
        expect(ret.limit).to.be.equal(100)
        expect(ret.offset).to.be.equal(100)
    })

    it('invalid input', () => {
        const ret = utils.formatOptions({ limit: 'invalid', offset: 'invalid' })
        expect(ret).to.have.property('offset', 0) 
        expect(ret).to.have.property('limit', utils.params.defaultLogLimit)
    })

    it('max limit', () => {
        const ret = utils.formatOptions({ limit: 1024})
        expect(ret).to.have.property('limit', utils.params.maxLogLimit)
    })

})

describe('utils:formatLogQuery', () => {

    it('valid options', () => {
        const ret = utils.formatLogQuery({ options: { limit: 100, offset: 100 } })
        expect(ret.options.limit).to.be.equal(100)
        expect(ret.options.offset).to.be.equal(100)
    })

    it('invalid options should result default options', () => {
        const ret = utils.formatLogQuery({ options: {} })
        expect(ret).to.property('options')
        expect(ret.options).to.have.property('offset', 0) 
        expect(ret.options).to.have.property('limit', utils.params.defaultLogLimit)
    })

    it('valid range', () => {
        const ret = utils.formatLogQuery({ range: { unit: 'block', from: 0, to: 1000 } })
        expect(ret.range.unit).to.be.equal('block')
        expect(ret.range.from).to.be.equal(0)
        expect(ret.range.to).to.be.equal(1000)
    })

    it('invalid range', () => {
        const ret = utils.formatLogQuery({ range: { unit: 'invalid' } })
        expect(ret).to.have.property('range')
        expect(ret.range.from).to.be.equal(0)
        expect(ret.range.to).to.be.equal(Number.MAX_SAFE_INTEGER)
    })

    it('valid from block', () => {
        const ret = utils.formatLogQuery({ fromBlock: '0x64' })
        expect(ret.range.unit).to.be.equal('block')
        expect(ret.range.from).to.be.equal(100)
        expect(ret.range.to).to.be.equal(Number.MAX_SAFE_INTEGER)
    })

    it('invalid from and to block', () => {
        const ret = utils.formatLogQuery({ fromBlock: 'latest', toBlock: 'latest' })
        expect(ret.range.from).to.be.equal(Number.MAX_SAFE_INTEGER)
        expect(ret.range.to).to.be.equal(Number.MAX_SAFE_INTEGER)
    })

    it('valid to block', () => {
        const ret = utils.formatLogQuery({ toBlock: '0x64' })
        expect(ret.range.unit).to.be.equal('block')
        expect(ret.range.from).to.be.equal(0)
        expect(ret.range.to).to.be.equal(100)
    })

    it('valid from & to block', () => {
        const ret = utils.formatLogQuery({ fromBlock: '0x64', toBlock: '0x65' })
        expect(ret.range.unit).to.be.equal('block')
        expect(ret.range.from).to.be.equal(100)
        expect(ret.range.to).to.be.equal(101)
    })

    it('with empty topics', () => {
        const ret = utils.formatLogQuery({
            topics: [
                null,
            ],
        })
        expect(ret).to.have.property('criteriaSet')
        expect(ret.criteriaSet).to.be.instanceof(Array)
    })

    it('with valid topics', () => {
        const ret = utils.formatLogQuery({
            topics: [
                ['topic00', 'topic01'],
                ['topic10', 'topic11'],
                'topic2',
            ],
        })

        expect(ret).to.have.property('criteriaSet')
        expect(ret.criteriaSet).to.be.instanceof(Array)
        expect(ret.criteriaSet).to.have.length(2 * 2 * 1)
        for (let i = 0; i < 3; i++) {
            expect(ret.criteriaSet[i]).to.have.property('topic0')
            expect(ret.criteriaSet[i]).to.have.property('topic1')
            expect(ret.criteriaSet[i]).to.have.property('topic2')
        }
        expect(ret.criteriaSet[0].topic2).to.be.equal('topic2')

        expect(ret.criteriaSet[0].topic1).to.be.equal('topic10')
        expect(ret.criteriaSet[1].topic0).to.be.equal('topic00')
        expect(ret.criteriaSet[2].topic0).to.be.equal('topic01')
        expect(ret.criteriaSet[3].topic1).to.be.equal('topic11')
    })

})
