'use strict'

import { expect } from 'chai'
import { thorify } from '../src'
import {ThorProvider} from '../src/provider'
const Web3 = require('web3')

describe('initialization', () => {
    it('init thorify should not throw error', () => {
        const web3 = new Web3()
        thorify(web3, 'http://localhost:8669', 0)
    })

    it('init thorify without host', () => {
        const web3 = new Web3()
        thorify(web3)

        expect(web3.currentProvider).to.have.property('RESTHost', 'http://localhost:8669')
        expect(web3.currentProvider).to.have.property('WSHost', 'ws://localhost:8669')
        expect(web3.currentProvider).to.have.property('timeout', 0)
    })

    it('providers should be ThorProvider', () => {
        const web3 = new Web3()
        thorify(web3)

        expect(web3.currentProvider instanceof ThorProvider).to.be.equal(true)
        expect(web3.eth.currentProvider instanceof ThorProvider).to.be.equal(true)
        expect(web3.eth.accounts.currentProvider instanceof ThorProvider).to.be.equal(true)
        expect(web3.eth.Contract.currentProvider instanceof ThorProvider).to.be.equal(true)
    })

})
