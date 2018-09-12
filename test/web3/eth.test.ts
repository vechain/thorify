'use strict'
import { expect } from 'chai'
import { web3, xhrUtility } from '../test-utils/init'

describe('web3.eth', () => {
    beforeEach(() => {
        xhrUtility.resetMockData()
    })

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

    it('getBlock with normal response', async () => {
        xhrUtility.setResponse({
            number: 634569,
            id: '0x0009aec90d88f6cae1c228f8b081ca21712768cd237d7593f19e35d7d6cff0ab',
            size: 240,
            parentID: '0x0009aec816e6c38e41f4dc9b41001412d0a6d7bffb193d122cb281a8e73979e1',
            timestamp: 1536664770,
            gasLimit: 15752702,
            beneficiary: '0x54f6f89138b7ff8131fa76485d1a81cc1e8fe2b7',
            gasUsed: 0,
            totalScore: 62654805,
            txsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            stateRoot: '0x218a10dabd1794b29bb164d009353aff9bed8a6b640664214174aba078a40df4',
            receiptsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            signer: '0xc3b3770ecabd9410f70b27612da8242eddd70dcf',
            isTrunk: true,
            transactions: [],
        })
        const result = await web3.eth.getBlock('latest')
        const { url } = xhrUtility.extractRequest()

        expect(url).to.be.equal('/blocks/best')
        expect(result).to.have.all.keys('number', 'id', 'size', 'parentID', 'timestamp', 'gasLimit', 'beneficiary', 'gasUsed', 'totalScore', 'txsRoot', 'stateRoot', 'receiptsRoot', 'signer', 'isTrunk', 'transactions')
    })

    it('getBlockNumber with valid response', async () => {
        xhrUtility.setResponse({
            number: 634569,
        })
        const result = await web3.eth.getBlockNumber()
        const { url } = xhrUtility.extractRequest()

        expect(url).to.be.equal('/blocks/best')
        expect(result).to.be.equal(634569)
    })

    it('getBalance with valid response', async () => {
        xhrUtility.setResponse({
            balance: '0x47ff1f90327aa0f8e',
        })
        const result = await web3.eth.getBalance('0xe59d475abe695c7f67a8a2321f33a856b0b4c71d')
        const { url } = xhrUtility.extractRequest()

        expect(url).to.be.equal('/accounts/0xe59d475abe695c7f67a8a2321f33a856b0b4c71d?revision=best')
        expect(result).to.be.equal('83006399998987997070')
    })

    it('getEnergy with valid response', async () => {
        xhrUtility.setResponse({
            energy: '0x47ff1f90327aa0f8e',
        })
        const result = await web3.eth.getEnergy('0xe59d475abe695c7f67a8a2321f33a856b0b4c71d')
        const { url } = xhrUtility.extractRequest()

        expect(url).to.be.equal('/accounts/0xe59d475abe695c7f67a8a2321f33a856b0b4c71d?revision=best')
        expect(result).to.be.equal('83006399998987997070')
    })

    it('getPastLogs with valid response', async () => {
        xhrUtility.setResponse([{
            address: '0x0000000000000000000000000000456e65726779',
            topics:
                ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                    '0x000000000000000000000000d3ae78222beadb038203be21ed5ce7c9b1bff602',
                    '0x0000000000000000000000007567d83b7b8d80addcb281a71d54fc7b3364ffed'],
            data: '0x0000000000000000000000000000000000000000000000000000000000000001',
            meta:
            {
                blockID: '0x0000005b0f386bdd9b677993f52a1a3c76445df49781d9c111a70ecacff63169',
                blockNumber: 91,
                blockTimestamp: 1536747051,
                txID: '0x405611a6ba2f9a5f45b81a899f2c15f87c7938dcc01589a9f2981c7609dc153a',
                txOrigin: '0xd3ae78222beadb038203be21ed5ce7c9b1bff602',
            },
            blockNumber: 91,
            blockHash: '0x0000005b0f386bdd9b677993f52a1a3c76445df49781d9c111a70ecacff63169',
            transactionHash: '0x405611a6ba2f9a5f45b81a899f2c15f87c7938dcc01589a9f2981c7609dc153a',
        }])
        const result = await web3.eth.getPastLogs({
            address: '0x0000000000000000000000000000456e65726779',
            topics: ['0x0000000000000000000000000000456e65726779[0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
        })
        const { url } = xhrUtility.extractRequest()

        expect(url).to.be.equal('/logs/events?address=0x0000000000000000000000000000456e65726779')
        expect(result.length).to.be.equal(1)
    })

})

describe('web3.eth:error handling', () => {

    it('execute method with response code 0(means server is not responding) throw error', (done) => {
        xhrUtility.setResponse(null, 0)

        web3.eth.getBlock(1).then(() => {
            done(new Error('no error thrown'))
        }).catch((e) => {
            try {
                expect(() => { throw e || 'no error' }).to.throw('[thor-provider] Invalid response, check the host')
                done()
            } catch (err) {
                done(err)
            }
        })
    })

    it('execute method with invalid response code and no response body should throw error', (done) => {
        xhrUtility.setResponse(null, 500)

        web3.eth.getBlock(1).then(() => {
            done(new Error('no error thrown'))
        }).catch((e) => {
            try {
                expect(() => { throw e || 'no error' }).to.throw('[thor-provider] Invalid response code from provider: 500')
                done()
            } catch (err) {
                done(err)
            }
        })
    })

    it('sendRawTransaction with wrong signature should throw error', (done) => {
        // this code is for testing omitCallBackedPromise in provider/index.ts
        xhrUtility.setResponse('bad tx: recovery failed', 400)
        web3.eth.sendSignedTransaction('0xf8be4a').then(() => {
            done(new Error('no error thrown'))
        }).catch((e) => {
            try {
                expect(() => { throw e || 'no error' }).to.throw('bad tx: recovery failed')
                done()
            } catch (err) {
                done(err)
            }
        })
    })

})
