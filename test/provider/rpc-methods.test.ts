'use strict'
// make sure init test utility first to inject fake-xhr2
import { xhrUtility } from '../test-utils/init'

import { expect } from 'chai'
import { JSONRPC } from '../../src/provider/json-rpc'
import { RPCMethodMap } from '../../src/provider/rpc-methods'

const host = 'http://localhost:8669'
const timeout = 0
const makeRPCRequest = function(method: string, params: any[]) {
    return new JSONRPC({
        id: 1,
        method,
        params,
        jsonrpc: '2.0',
    })
}

describe('rpc methods', () => {

    beforeEach(() => {
        xhrUtility.resetMockData()
    })

    describe('eth_getBlockNumber', () => {

        it('return number', async () => {
            xhrUtility.setResponse({ number: 2000 })
            const executor = RPCMethodMap.get('eth_blockNumber')
            const rpc = makeRPCRequest('', [])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.be.equal(2000)
        })

        it('return null', async () => {
            const executor = RPCMethodMap.get('eth_blockNumber')
            const rpc = makeRPCRequest('', [])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.be.equal(null)
        })

    })

    describe('eth_getBalance', () => {

        it('valid response', async () => {
            xhrUtility.setResponse({ balance: '0x47ff1f90327aa0f8e' })
            const executor = RPCMethodMap.get('eth_getBalance')
            const rpc = makeRPCRequest('eth_getBalance', ['0xe59d475abe695c7f67a8a2321f33a856b0b4c71d'])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.be.equal('0x47ff1f90327aa0f8e')
        })

        it('return null', async () => {
            const executor = RPCMethodMap.get('eth_getBalance')
            const rpc = makeRPCRequest('eth_getBalance', ['0xe59d475abe695c7f67a8a2321f33a856b0b4c71d'])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.be.equal(null)
        })

    })

    describe('eth_getEnergy', () => {

        it('valid response', async () => {
            xhrUtility.setResponse({ energy: '0x47ff1f90327aa0f8e' })
            const executor = RPCMethodMap.get('eth_getEnergy')
            const rpc = makeRPCRequest('eth_getEnergy', ['0xe59d475abe695c7f67a8a2321f33a856b0b4c71d'])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.be.equal('0x47ff1f90327aa0f8e')
        })

        it('return null', async () => {
            const executor = RPCMethodMap.get('eth_getEnergy')
            const rpc = makeRPCRequest('eth_getEnergy', ['0xe59d475abe695c7f67a8a2321f33a856b0b4c71d'])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.be.equal(null)
        })

    })

    describe('eth_getCode', () => {

        it('valid response', async () => {
            xhrUtility.setResponse({ code: '0xcode' })
            const executor = RPCMethodMap.get('eth_getCode')
            const rpc = makeRPCRequest('eth_getCode', ['0xe59d475abe695c7f67a8a2321f33a856b0b4c71d'])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.be.equal('0xcode')
        })

        it('return null', async () => {
            const executor = RPCMethodMap.get('eth_getCode')
            const rpc = makeRPCRequest('eth_getCode', ['0xe59d475abe695c7f67a8a2321f33a856b0b4c71d'])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.be.equal(null)
        })

    })

    describe('eth_getStorageAt', () => {

        it('valid response', async () => {
            xhrUtility.setResponse({ value: '0xstorage' })
            const executor = RPCMethodMap.get('eth_getStorageAt')
            const rpc = makeRPCRequest('eth_getStorageAt', ['0xe59d475abe695c7f67a8a2321f33a856b0b4c71d', '0x07855b46a623a8ecabac76ed697aa4e13631e3b6718c8a0d342860c13c30d2fc'])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.be.equal('0xstorage')
        })

        it('return null', async () => {
            const executor = RPCMethodMap.get('eth_getStorageAt')
            const rpc = makeRPCRequest('eth_getStorageAt', ['0xe59d475abe695c7f67a8a2321f33a856b0b4c71d', '0x07855b46a623a8ecabac76ed697aa4e13631e3b6718c8a0d342860c13c30d2fc'])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.be.equal(null)
        })

    })

    describe('eth_sendRawTransaction', () => {

        it('valid response', async () => {
            xhrUtility.setResponse({ id: '0xid' })
            const executor = RPCMethodMap.get('eth_sendRawTransaction')
            const rpc = makeRPCRequest('eth_sendRawTransaction', ['0xe59d475abe695c7f67a8a2321f33a856b0b4c71d'])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.be.equal('0xid')
        })

        it('return null', async () => {
            const executor = RPCMethodMap.get('eth_sendRawTransaction')
            const rpc = makeRPCRequest('eth_sendRawTransaction', ['0xe59d475abe695c7f67a8a2321f33a856b0b4c71d'])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.be.equal(null)
        })

    })

    describe('eth_getTransactionByHash', () => {

        it('valid response', async () => {
            xhrUtility.setResponse({ meta: { blockNumber: 100 } })
            const executor = RPCMethodMap.get('eth_getTransactionByHash')
            const rpc = makeRPCRequest('eth_getTransactionByHash', ['0xa5b3d1dbafe79a41dce8ec33a83e68cf506cdcd1df7776c3afd8fc67a76cecf2'])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.have.property('blockNumber', 100)
        })

        it('return null', async () => {
            const executor = RPCMethodMap.get('eth_getTransactionByHash')
            const rpc = makeRPCRequest('eth_getTransactionByHash', ['0xa5b3d1dbafe79a41dce8ec33a83e68cf506cdcd1df7776c3afd8fc67a76cecf2'])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.be.equal(null)
        })

    })

    describe('eth_getTransactionReceipt', () => {

        it('valid response', async () => {
            xhrUtility.setResponse({
                meta: {
                    blockID: 'block-id',
                    blockNumber: 100,
                    txID: 'tx-id',
                },
                reverted: false,
                outputs: [{ contractAddress: 'contractAddress' }],
            })
            const executor = RPCMethodMap.get('eth_getTransactionReceipt')
            const rpc = makeRPCRequest('eth_getTransactionReceipt', ['0xa5b3d1dbafe79a41dce8ec33a83e68cf506cdcd1df7776c3afd8fc67a76cecf2'])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.have.property('blockNumber', 100)
            expect(ret.result).to.have.property('blockHash', 'block-id')
            expect(ret.result).to.have.property('transactionHash', 'tx-id')
            expect(ret.result).to.have.property('status', '0x1')
            expect(ret.result).to.have.property('contractAddress', 'contractAddress')
        })

        it('return revert false status should be 0x0', async () => {
            xhrUtility.setResponse({
                meta: {
                    blockID: 'block-id',
                    blockNumber: 100,
                    txID: 'tx-id',
                },
                reverted: true,
                outputs: [],
            })
            const executor = RPCMethodMap.get('eth_getTransactionReceipt')
            const rpc = makeRPCRequest('eth_getTransactionReceipt', ['0xa5b3d1dbafe79a41dce8ec33a83e68cf506cdcd1df7776c3afd8fc67a76cecf2'])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.have.property('status', '0x0')
        })

        it('return null', async () => {
            const executor = RPCMethodMap.get('eth_getTransactionReceipt')
            const rpc = makeRPCRequest('eth_getTransactionReceipt', ['0xa5b3d1dbafe79a41dce8ec33a83e68cf506cdcd1df7776c3afd8fc67a76cecf2'])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.be.equal(null)
        })

    })

    describe('eth_call', () => {

        it('valid response', async () => {
            xhrUtility.setResponse({ reverted: false, data: '0xdata' })
            const executor = RPCMethodMap.get('eth_call')
            const rpc = makeRPCRequest('eth_call', [{
                to: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
                from: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
                gas: 100,
                value: '0x64',
                gasPrice: '0x64',
            }])

            const ret = await executor(rpc, host, timeout)
            const { url, body } = xhrUtility.extractRequest()

            expect(url).to.be.equal('/accounts/0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed?revision=best')
            expect(body).to.have.property('value', '0x64')
            expect(body).to.have.property('gas', 100)
            expect(body).to.have.property('gasPrice', '0x64')
            expect(body).to.have.property('caller', '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed')
            expect(ret.result).to.be.equal('0xdata')
        })

        it('reverted should return null', async () => {
            xhrUtility.setResponse({ reverted: true })
            const executor = RPCMethodMap.get('eth_call')
            const rpc = makeRPCRequest('eth_call', [{
                to: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
                from: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
                gas: '0x64',
                value: '0x64',
                gasPrice: '0x64',
            }])

            const ret = await executor(rpc, host, timeout)
            const { body } = xhrUtility.extractRequest()

            expect(ret.result).to.be.equal(null)
            expect(body).to.have.property('gas', 100)

        })

        it('"0x" of data should return empty string', async () => {
            xhrUtility.setResponse({ data: '0x' })
            const executor = RPCMethodMap.get('eth_call')
            const rpc = makeRPCRequest('eth_call', [{
                to: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
                from: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
                gas: '0x64',
                value: '0x64',
                gasPrice: '0x64',
            }])

            const ret = await executor(rpc, host, timeout)
            const { body } = xhrUtility.extractRequest()

            expect(ret.result).to.be.equal('')
        })

        it('return null', async () => {
            const executor = RPCMethodMap.get('eth_call')
            const rpc = makeRPCRequest('eth_call', ['0xa5b3d1dbafe79a41dce8ec33a83e68cf506cdcd1df7776c3afd8fc67a76cecf2'])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.be.equal(null)
        })

    })

    describe('eth_call', () => {

        it('valid response', async () => {
            xhrUtility.setResponse({ reverted: false, data: '0xdata' })
            const executor = RPCMethodMap.get('eth_call')
            const rpc = makeRPCRequest('eth_call', [{
                to: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
                from: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
                gas: 100,
                value: '0x64',
                gasPrice: '0x64',
            }])

            const ret = await executor(rpc, host, timeout)
            const { url, body } = xhrUtility.extractRequest()

            expect(url).to.be.equal('/accounts/0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed?revision=best')
            expect(body).to.have.property('value', '0x64')
            expect(body).to.have.property('gas', 100)
            expect(body).to.have.property('gasPrice', '0x64')
            expect(body).to.have.property('caller', '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed')
            expect(ret.result).to.be.equal('0xdata')
        })

        it('reverted should return null', async () => {
            xhrUtility.setResponse({ reverted: true })
            const executor = RPCMethodMap.get('eth_call')
            const rpc = makeRPCRequest('eth_call', [{
                to: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
                from: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
                gas: '0x64',
                value: '0x64',
                gasPrice: '0x64',
            }])

            const ret = await executor(rpc, host, timeout)
            const { body } = xhrUtility.extractRequest()

            expect(ret.result).to.be.equal(null)
            expect(body).to.have.property('gas', 100)

        })

        it('request without from should not have caller in body', async () => {
            xhrUtility.setResponse({ reverted: true })
            const executor = RPCMethodMap.get('eth_call')
            const rpc = makeRPCRequest('eth_call', [{
                to: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
                gas: '0x64',
                value: '0x64',
                gasPrice: '0x64',
            }])

            const ret = await executor(rpc, host, timeout)
            const { body } = xhrUtility.extractRequest()

            expect(ret.result).to.be.equal(null)
            expect(body).to.have.property('gas', 100)
            expect(body).to.not.have.property('caller')

        })

        it('deploy contract should request the right url', async () => {
            const executor = RPCMethodMap.get('eth_call')
            const rpc = makeRPCRequest('eth_call', [{
                from: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
            }])

            await executor(rpc, host, timeout)
            const { url } = xhrUtility.extractRequest()
            expect(url).to.be.equal('/accounts?revision=best')
        })

        it('return null', async () => {
            const executor = RPCMethodMap.get('eth_call')
            const rpc = makeRPCRequest('eth_call', [{}])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.be.equal(null)
        })

    })

    describe('eth_estimateGas', () => {

        it('valid response', async () => {
            xhrUtility.setResponse({ gasUsed: 0 })
            const executor = RPCMethodMap.get('eth_estimateGas')
            const rpc = makeRPCRequest('eth_estimateGas', [{
                to: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
                from: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
                gas: 100,
                value: '0x64',
                gasPrice: '0x64',
            }])

            const ret = await executor(rpc, host, timeout)
            const { url, body } = xhrUtility.extractRequest()

            expect(url).to.be.equal('/accounts/0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed?revision=best')
            expect(body).to.have.property('value', '0x64')
            expect(body).to.not.have.property('gas')
            expect(body).to.have.property('gasPrice', '0x64')
            expect(body).to.have.property('caller', '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed')
            expect(ret.result).to.be.equal(21000)
        })

        it('gas Used should increase 20%', async () => {
            xhrUtility.setResponse({ gasUsed: 10 })
            const executor = RPCMethodMap.get('eth_estimateGas')
            const rpc = makeRPCRequest('eth_estimateGas', [{
                to: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
                from: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
                gas: 100,
                value: '0x64',
                gasPrice: '0x64',
            }])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.be.equal(21012)
        })

        it('reverted should return null', async () => {
            xhrUtility.setResponse({ reverted: true })
            const executor = RPCMethodMap.get('eth_estimateGas')
            const rpc = makeRPCRequest('eth_estimateGas', [{
                to: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
                from: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
                gas: '0x64',
                value: '0x64',
                gasPrice: '0x64',
            }])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.be.equal(null)

        })

        it('request without from should not have caller in body', async () => {
            xhrUtility.setResponse({ reverted: true })
            const executor = RPCMethodMap.get('eth_estimateGas')
            const rpc = makeRPCRequest('eth_estimateGas', [{
                to: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
                gas: '0x64',
                value: '0x64',
                gasPrice: '0x64',
            }])

            const ret = await executor(rpc, host, timeout)
            const { body } = xhrUtility.extractRequest()

            expect(ret.result).to.be.equal(null)
            expect(body).to.not.have.property('gas')
            expect(body).to.not.have.property('caller')

        })

        it('deploy contract should request the right url', async () => {
            const executor = RPCMethodMap.get('eth_estimateGas')
            const rpc = makeRPCRequest('eth_estimateGas', [{
                from: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
            }])

            await executor(rpc, host, timeout)
            const { url } = xhrUtility.extractRequest()
            expect(url).to.be.equal('/accounts?revision=best')
        })

        it('return null', async () => {
            const executor = RPCMethodMap.get('eth_estimateGas')
            const rpc = makeRPCRequest('eth_estimateGas', [{}])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.be.equal(null)
        })

    })

    describe('eth_getLogs', () => {

        it('valid response', async () => {
            xhrUtility.setResponse([{
                meta: {
                    blockNumber: 100,
                    blockID: 'block-id',
                    txID: 'tx-id',
                },
            }])
            const executor = RPCMethodMap.get('eth_getLogs')
            const rpc = makeRPCRequest('eth_getLogs', [{
                address: '0x0000000000000000000000417574686f72697479',
                order: 'ASC',
            }])

            const ret = await executor(rpc, host, timeout)
            const {url} = xhrUtility.extractRequest()

            expect(url).to.be.equal('/logs/events?address=0x0000000000000000000000417574686f72697479&order=ASC')
            expect(ret.result).to.have.lengthOf(1)
            expect(ret.result[0]).to.have.property('blockNumber', 100)
            expect(ret.result[0]).to.have.property('blockHash', 'block-id')
            expect(ret.result[0]).to.have.property('transactionHash', 'tx-id')
        })

        it('order DESC should get the right url', async () => {
            const executor = RPCMethodMap.get('eth_getLogs')
            const rpc = makeRPCRequest('eth_getLogs', [{
                address: '0x0000000000000000000000417574686f72697479',
                order: 'DESC',
            }])

            await executor(rpc, host, timeout)
            const { url } = xhrUtility.extractRequest()

            expect(url).to.be.equal('/logs/events?address=0x0000000000000000000000417574686f72697479&order=DESC')
        })

        it('minimum request param should get the minimum url', async () => {
            const executor = RPCMethodMap.get('eth_getLogs')
            const rpc = makeRPCRequest('eth_getLogs', [{}])

            await executor(rpc, host, timeout)
            const { url } = xhrUtility.extractRequest()

            expect(url).to.be.equal('/logs/events')
        })

        it('return null', async () => {
            const executor = RPCMethodMap.get('eth_getLogs')
            const rpc = makeRPCRequest('eth_getLogs', [{
                address: '0x0000000000000000000000417574686f72697479',
                order: 'ASC',
            }])

            const ret = await executor(rpc, host, timeout)
            expect(ret.result).to.be.equal(null)
        })

    })

})
