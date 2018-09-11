'use strict'

import { expect } from 'chai'
import { inputBlockFilterFormatter, inputLogFilterFormatter, inputTransferFilterFormatter } from '../../src/extend/formatters'
import { web3 } from '../test-utils/init'

const ethTx = {
    blockHash: '0xf7e2fb83191da98ab0dbc59596113058ed5d393634c87b5efac7f609bf010538',
    blockNumber: '0x56e87f',
    from: '0x1c7931f18c027ace696e4e8e33ff899a367a22dd',
    gas: '0x11170',
    gasPrice: '0x4a817c800',
    hash: '0xac0218329ba219e2c1882257f2b75c04692f7fbc74d96cb0e7affa9a5d27e6d1',
    input: '0xa9059cbb000000000000000000000000e0d0dc778dcbb24d909686b90b63cc574af17b8a0000000000000000000000000000000000000000000000000001eefc517ec733',
    nonce: '0x19d',
    to: '0x3becba56f35eea87ab3f6e299d431c7dee90405f',
    transactionIndex: '0x13',
    value: '0x0',
    v: '0x26',
    r: '0x6649d6238c5fc1811988e53b1c2af1c2f06d6e503a50e292fb21eafc1764bbf2',
    s: '0x51366011c426f7eaaacf01493f4b6ab231d75797c4adeb894e4c8aae0a49bd78',
}

const thorTx = {
    id: '0x6f73c93a2f4ea12e3e9bf9db9bc7b59ada3b5d97637d66b9aa05d28309d80057',
    size: 1059,
    chainTag: 207,
    blockRef: '0x0002511e9f2943a5',
    expiration: 720,
    clauses: [
        {
            to: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
            value: '0x0',
            data: '0x608060405234801561001057600080fd5b5060008054600160a060020a033316600160a060020a03199091161790556103808061003d6000396000f3006080604052600436106100565763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416630e054260811461005b5780638da5cb5b14610113578063f2fde38b14610144575b600080fd5b34801561006757600080fd5b5060408051602060046044358181013583810280860185019096528085526100ff958335600160a060020a039081169660248035909216963696956064959294930192829185019084908082843750506040805187358901803560208181028481018201909552818452989b9a9989019892975090820195509350839250850190849080828437509497506101679650505050505050565b604080519115158252519081900360200190f35b34801561011f57600080fd5b506101286102ad565b60408051600160a060020a039092168252519081900360200190f35b34801561015057600080fd5b50610165600160a060020a03600435166102bc565b005b60008054819033600160a060020a0390811691161461018557600080fd5b825184511461019357600080fd5b8351609610156101a257600080fd5b5060005b83518160ff1610156102a15785600160a060020a03166323b872dd86868460ff168151811015156101d357fe5b90602001906020020151868560ff168151811015156101ee57fe5b6020908102909101810151604080517c010000000000000000000000000000000000000000000000000000000063ffffffff8816028152600160a060020a03958616600482015293909416602484015260448301529151606480830193928290030181600087803b15801561026257600080fd5b505af1158015610276573d6000803e3d6000fd5b505050506040513d602081101561028c57600080fd5b5051151560011461029957fe5b6001016101a6565b50600195945050505050565b600054600160a060020a031681565b60005433600160a060020a039081169116146102d757600080fd5b600160a060020a03811615156102ec57600080fd5b60008054604051600160a060020a03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a36000805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a03929092169190911790555600a165627a7a723058204eaf121c508d7c1a7bd36ef137fb7de02bc6c7ead2d51428b359c7077e921dd50029',
        },
    ],
    gasPriceCoef: 0,
    gas: 500000,
    dependsOn: null,
    nonce: '0x64',
    origin: '0xe59d475abe695c7f67a8a2321f33a856b0b4c71d',
    block: {
        id: '0x0002511f9dafcc645588beef15e2d8d1ed6b0a65800463bccbb87d87c9126c2e',
        number: 151839,
        timestamp: 1527922040,
    },
}

const thorTxWithNullTo = {
    id: '0x6f73c93a2f4ea12e3e9bf9db9bc7b59ada3b5d97637d66b9aa05d28309d80057',
    size: 1059,
    chainTag: 207,
    blockRef: '0x0002511e9f2943a5',
    expiration: 720,
    clauses: [
        {
            to: null,
            value: '0x0',
            data: '0x608060405234801561001057600080fd5b5060008054600160a060020a033316600160a060020a03199091161790556103808061003d6000396000f3006080604052600436106100565763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416630e054260811461005b5780638da5cb5b14610113578063f2fde38b14610144575b600080fd5b34801561006757600080fd5b5060408051602060046044358181013583810280860185019096528085526100ff958335600160a060020a039081169660248035909216963696956064959294930192829185019084908082843750506040805187358901803560208181028481018201909552818452989b9a9989019892975090820195509350839250850190849080828437509497506101679650505050505050565b604080519115158252519081900360200190f35b34801561011f57600080fd5b506101286102ad565b60408051600160a060020a039092168252519081900360200190f35b34801561015057600080fd5b50610165600160a060020a03600435166102bc565b005b60008054819033600160a060020a0390811691161461018557600080fd5b825184511461019357600080fd5b8351609610156101a257600080fd5b5060005b83518160ff1610156102a15785600160a060020a03166323b872dd86868460ff168151811015156101d357fe5b90602001906020020151868560ff168151811015156101ee57fe5b6020908102909101810151604080517c010000000000000000000000000000000000000000000000000000000063ffffffff8816028152600160a060020a03958616600482015293909416602484015260448301529151606480830193928290030181600087803b15801561026257600080fd5b505af1158015610276573d6000803e3d6000fd5b505050506040513d602081101561028c57600080fd5b5051151560011461029957fe5b6001016101a6565b50600195945050505050565b600054600160a060020a031681565b60005433600160a060020a039081169116146102d757600080fd5b600160a060020a03811615156102ec57600080fd5b60008054604051600160a060020a03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a36000805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a03929092169190911790555600a165627a7a723058204eaf121c508d7c1a7bd36ef137fb7de02bc6c7ead2d51428b359c7077e921dd50029',
        },
    ],
    gasPriceCoef: 0,
    gas: 500000,
    dependsOn: null,
    nonce: '0x64',
    origin: '0xe59d475abe695c7f67a8a2321f33a856b0b4c71d',
    block: {
        id: '0x0002511f9dafcc645588beef15e2d8d1ed6b0a65800463bccbb87d87c9126c2e',
        number: 151839,
        timestamp: 1527922040,
    },
}

const thorTxWithUnsafeFields = {
    id: '0x6f73c93a2f4ea12e3e9bf9db9bc7b59ada3b5d97637d66b9aa05d28309d80057',
    size: 1059,
    chainTag: 207,
    blockRef: '0x0002511e9f2943a5',
    expiration: 720,
    gasPriceCoef: 0,
    gas: 500000,
    dependsOn: null,
    nonce: '0x64',
    block: {
        id: '0x0002511f9dafcc645588beef15e2d8d1ed6b0a65800463bccbb87d87c9126c2e',
        number: 151839,
        timestamp: 1527922040,
    },
}

const ethTxReceipt = {
    blockHash: '0xf7e2fb83191da98ab0dbc59596113058ed5d393634c87b5efac7f609bf010538',
    blockNumber: '0x56e87f',
    contractAddress: null,
    cumulativeGasUsed: '0x9c8a3',
    from: '0x1c7931f18c027ace696e4e8e33ff899a367a22dd',
    gasUsed: '0xcaa2',
    logs: [
        {
            address: '0x3becba56f35eea87ab3f6e299d431c7dee90405f',
            topics: [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '0x0000000000000000000000001c7931f18c027ace696e4e8e33ff899a367a22dd',
                '0x000000000000000000000000e0d0dc778dcbb24d909686b90b63cc574af17b8a',
            ],
            data: '0x0000000000000000000000000000000000000000000000000001eefc517ec733',
            blockNumber: '0x56e87f',
            transactionHash: '0xac0218329ba219e2c1882257f2b75c04692f7fbc74d96cb0e7affa9a5d27e6d1',
            transactionIndex: '0x13',
            blockHash: '0xf7e2fb83191da98ab0dbc59596113058ed5d393634c87b5efac7f609bf010538',
            logIndex: '0x7',
            removed: false,
        },
    ],
    logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000008000000000000000000000000000000000001000000000000000000000000000100000000000000000000000000000010000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000002020000000020000000000000000000000000000000000000000000000010000000000000000000010000000000000000000000000000000000000000',
    status: '0x1',
    to: '0x3becba56f35eea87ab3f6e299d431c7dee90405f',
    transactionHash: '0xac0218329ba219e2c1882257f2b75c04692f7fbc74d96cb0e7affa9a5d27e6d1',
    transactionIndex: '0x13',
}

const thorTxReceipt = {
    gasUsed: 55365,
    gasPayer: '0xe59d475abe695c7f67a8a2321f33a856b0b4c71d',
    paid: '0x7aef5bddbe52000',
    reward: '0x24e1685c1f7f000',
    reverted: false,
    meta: {
        blockID: '0x00000001c458949985a6d86b7139690b8811dd3b4647c02d4f41cdefb7d32327',
        blockNumber: 1,
        blockTimestamp: 1523156271,
        txID: '0x4de71f2d588aa8a1ea00fe8312d92966da424d9939a511fc0be81e65fad52af8',
        txOrigin: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
    },
    outputs: [
        {
            contractAddress: '0x0000000000000000000000000000456e65726779',
            events: [],
            transfers: [],
        },
        {
            contractAddress: null,
            events: [
                {
                    address: '0x0000000000000000000000000000456e65726779',
                    topics: [
                        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                        '0x000000000000000000000000e59d475abe695c7f67a8a2321f33a856b0b4c71d',
                        '0x000000000000000000000000bedc3de64693b96005c801423f5127bc4dd4c606',
                    ],
                    data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
                },
            ],
            transfers: [],
        },
    ],
}

const thorTxReceiptWithUnsafeFields = {
    gasUsed: 55365,
    paid: '0x7aef5bddbe52000',
    reward: '0x24e1685c1f7f000',
    reverted: false,
    meta: {
        blockID: '0x00000001c458949985a6d86b7139690b8811dd3b4647c02d4f41cdefb7d32327',
        blockNumber: 1,
        blockTimestamp: 1523156271,
    },
    outputs: [
        {
            contractAddress: null,
            events: {},
            transfers: [],
        },
    ],
}

Object.defineProperty(thorTx, 'isThorified', { get: () => true, set: () => null })
Object.defineProperty(thorTxWithNullTo, 'isThorified', { get: () => true, set: () => null })
Object.defineProperty(thorTxWithUnsafeFields, 'isThorified', { get: () => true, set: () => null })
Object.defineProperty(thorTxReceipt, 'isThorified', { get: () => true, set: () => null })
Object.defineProperty(thorTxReceiptWithUnsafeFields, 'isThorified', { get: () => true, set: () => null })

describe('web3 formatters', () => {

    it('Format eth transaction', () => {
        const tx = web3.extend.formatters.outputTransactionFormatter(ethTx)
        expect(tx).to.have.all.keys('blockHash', 'blockNumber', 'from', 'gas', 'gasPrice', 'hash', 'input', 'nonce', 'transactionIndex', 'to', 'value', 'r', 's', 'v')
    })

    it('Format thor transaction', () => {
        const tx = web3.extend.formatters.outputTransactionFormatter(thorTx)
        expect(tx).to.have.all.keys('block', 'blockRef', 'chainTag', 'clauses', 'dependsOn', 'expiration', 'gas', 'gasPriceCoef', 'id', 'nonce', 'origin', 'size')
    })

    it('Format thor transaction with null to', () => {
        const tx = web3.extend.formatters.outputTransactionFormatter(thorTxWithNullTo)
        expect(tx).to.have.all.keys('block', 'blockRef', 'chainTag', 'clauses', 'dependsOn', 'expiration', 'gas', 'gasPriceCoef', 'id', 'nonce', 'origin', 'size')
    })

    it('Format thor transaction with unsafe input', () => {
        const tx = web3.extend.formatters.outputTransactionFormatter(thorTxWithUnsafeFields)
        expect(tx).to.have.all.keys('block', 'blockRef', 'chainTag', 'dependsOn', 'expiration', 'gas', 'gasPriceCoef', 'id', 'nonce', 'size')
    })

    it('Format eth transaction receipt', () => {
        const tx = web3.extend.formatters.outputTransactionReceiptFormatter(ethTxReceipt)
        expect(tx).to.have.all.keys('blockHash', 'blockNumber', 'contractAddress', 'cumulativeGasUsed', 'gasUsed', 'from', 'logs', 'logsBloom', 'status', 'to', 'transactionHash', 'transactionIndex')
    })

    it('Format thor transaction receipt', () => {
        const tx = web3.extend.formatters.outputTransactionReceiptFormatter(thorTxReceipt)
        expect(tx).to.have.all.keys('meta', 'gasPayer', 'gasUsed', 'outputs', 'paid', 'reverted', 'reward')
    })

    it('Format thor transaction receipt with unsafe input', () => {
        const tx = web3.extend.formatters.outputTransactionReceiptFormatter(thorTxReceiptWithUnsafeFields)
        expect(tx).to.have.all.keys('gasUsed', 'outputs', 'paid', 'reverted', 'reward', 'meta')
    })

    it('Format thor transaction receipt with eth receipt properties', () => {
        Object.defineProperty(thorTxReceipt, 'transactionIndex', { value: 1, configurable: true })
        Object.defineProperty(thorTxReceipt, 'cumulativeGasUsed', { value: 1000000, configurable: true })
        const tx = web3.extend.formatters.outputTransactionReceiptFormatter(thorTxReceipt)
        expect(tx).to.have.all.keys('gasPayer', 'gasUsed', 'outputs', 'paid', 'reverted', 'reward', 'meta')
    })

    it('Format eth log', () => {
        const ret = web3.extend.formatters.outputLogFormatter(ethTxReceipt.logs[0])
        expect(ret).to.have.all.keys('address', 'blockHash', 'blockNumber', 'data', 'id', 'logIndex', 'removed', 'topics', 'transactionHash', 'transactionIndex')
    })

    it('Format thor log', () => {
        const log = thorTxReceipt.outputs[1].events[0]
        if (!log.isThorified) { Object.defineProperty(log, 'isThorified', { get: () => true }) }
        Object.defineProperty(log, 'transactionIndex', { value: 1, configurable: true })
        Object.defineProperty(log, 'logIndex', { value: 1, configurable: true })
        Object.defineProperty(log, 'id', { value: 1, configurable: true })
        let ret = web3.extend.formatters.outputLogFormatter(log)
        expect(ret).to.have.all.keys('address', 'data', 'topics')
        const logWithUnsafeFields = {
            topics: [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '0x000000000000000000000000e59d475abe695c7f67a8a2321f33a856b0b4c71d',
                '0x000000000000000000000000bedc3de64693b96005c801423f5127bc4dd4c606',
            ],
            data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
        }
        Object.defineProperty(logWithUnsafeFields, 'isThorified', { get: () => true })
        ret = web3.extend.formatters.outputLogFormatter(logWithUnsafeFields)
        expect(ret).to.have.all.keys('data', 'topics')
    })
})

describe('thorify input formatters', () => {

    it('inputLogFilterFormatter with none input', () => {
        expect(inputLogFilterFormatter(undefined)).to.be.equal(undefined)
    })

    it('inputLogFilterFormatter with invalid input', () => {
        expect(() => { inputLogFilterFormatter({ address: 'invalid address' }) }).to.throw('Invalid address string')
        expect(() => { inputLogFilterFormatter({ position: 'invalid position' }) }).to.throw('Invalid position(block ID)')
        expect(() => { inputLogFilterFormatter({ t0: 'invalid topic' }) }).to.throw('Invalid t0')
        expect(() => { inputLogFilterFormatter({ t1: 'invalid topic' }) }).to.throw('Invalid t1')
        expect(() => { inputLogFilterFormatter({ t2: 'invalid topic' }) }).to.throw('Invalid t2')
        expect(() => { inputLogFilterFormatter({ t3: 'invalid topic' }) }).to.throw('Invalid t3')
        expect(() => { inputLogFilterFormatter({ t4: 'invalid topic' }) }).to.throw('Invalid t4')
    })

    it('inputLogFilterFormatter with valid input', () => {
        const logFilterOption = {
            address: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            t0: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3e0',
            t1: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3e1',
            t2: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3e2',
            t3: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3e3',
            t4: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3e4',
        }
        const result = inputLogFilterFormatter(logFilterOption)

        expect(result).to.have.property('address', '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed')
        expect(result).to.have.property('t0', '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3e0')
        expect(result).to.have.property('t1', '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3e1')
        expect(result).to.have.property('t2', '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3e2')
        expect(result).to.have.property('t3', '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3e3')
        expect(result).to.have.property('t4', '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3e4')
    })

    it('inputLogFilterFormatter with only 1 property input', () => {
        expect(inputLogFilterFormatter({ t0: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3e0'})).to.have.property('t0', '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3e0')
    })

    it('inputBlockFilterFormatter with none input', () => {
        expect(inputBlockFilterFormatter(undefined)).to.be.equal(undefined)
    })

    it('inputBlockFilterFormatter with invalid input', () => {
        expect(() => { inputBlockFilterFormatter('invalid position') }).to.throw('Invalid position(block ID)')
    })

    it('inputBlockFilterFormatter with valid input', () => {
        expect(inputBlockFilterFormatter('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3e0')).to.be.equal('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3e0')
    })

    it('inputTransferFilterFormatter with none input', () => {
        expect(inputTransferFilterFormatter(undefined)).to.be.equal(undefined)
    })

    it('inputTransferFilterFormatter with invalid input', () => {
        expect(() => { inputTransferFilterFormatter({ position: 'invalid position' }) }).to.throw('Invalid position(block ID)')
        expect(() => { inputTransferFilterFormatter({ txOrigin: 'invalid address' }) }).to.throw('Invalid address string')
        expect(() => { inputTransferFilterFormatter({ sender: 'invalid address' }) }).to.throw('Invalid address string')
        expect(() => { inputTransferFilterFormatter({ recipient: 'invalid address' }) }).to.throw('Invalid address string')
    })

    it('inputTransferFilterFormatter with valid input', () => {
        const transferFilterOption = {
            position: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3e0',
            txOrigin: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffea',
            sender: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffeb',
            recipient: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffec',
        }
        const result = inputTransferFilterFormatter(transferFilterOption)

        expect(result).to.have.property('position', '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3e0')
        expect(result).to.have.property('txOrigin', '0x7567d83b7b8d80addcb281a71d54fc7b3364ffea')
        expect(result).to.have.property('sender', '0x7567d83b7b8d80addcb281a71d54fc7b3364ffeb')
        expect(result).to.have.property('recipient', '0x7567d83b7b8d80addcb281a71d54fc7b3364ffec')
    })

    it('inputTransferFilterFormatter with only 1 property input', () => {
        expect(inputTransferFilterFormatter({ position: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3e0' })).to.have.property('position', '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3e0')
    })

})
