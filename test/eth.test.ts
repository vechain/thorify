'use strict'
import { expect } from 'chai'
import { web3, xhrUtility } from './test-utils/init'

describe('web3.eth', () => {

    it('getBlock without parameter', async () => {
        await web3.eth.getBlock()

        const { url } = xhrUtility.extractRequest()
        expect(url).to.be.equal('/blocks/best')
    })

    it('getBlock with earliest', async () => {
        await web3.eth.getBlock('earliest')

        const { url } = xhrUtility.extractRequest()
        expect(url).to.be.equal('/blocks/0')
    })

    it('getBlock with latest', async () => {
        await web3.eth.getBlock('latest')

        const { url } = xhrUtility.extractRequest()
        expect(url).to.be.equal('/blocks/best')
    })

    it('getBlock with pending', async () => {
        await web3.eth.getBlock('pending')

        const { url } = xhrUtility.extractRequest()
        expect(url).to.be.equal('/blocks/best')
    })

    it('getBlock with blockHash', async () => {
        web3.eth.getBlock('0x00003800dfbcc35f2010ebcc26f28f009268b1df58886a0c698545ed07bd1c7b')

        const { url } = xhrUtility.extractRequest()
        expect(url).to.be.equal('/blocks/0x00003800dfbcc35f2010ebcc26f28f009268b1df58886a0c698545ed07bd1c7b')
    })

    it('getBlock with blockNumber', async () => {
        await web3.eth.getBlock(1)

        const { url } = xhrUtility.extractRequest()
        expect(url).to.be.equal('/blocks/1')
    })

})
