'use strict'

import { expect } from 'chai'
import { thorify } from '../../src'
const Web3 = require('web3')
const web3 = thorify(new Web3(), 'http://localhost:8669', 0)

describe('XHR2: localhost:8669 should not be listened', () => {
    it('call eth methods should throw error', (done) => {
        web3.eth.getChainTag().then(() => {
            done(new Error('no error thrown'))
        }).catch((e: Error) => {
            try {
                expect(() => { throw e || 'no error' }).to.throw('[thor-provider] Invalid response, check the host')
                done()
            } catch (err) {
                done(err)
            }
        })
    })
})

describe('WebSocket: localhost:8669 should not be listened', () => {

    it('call subscribe throw error', (done) => {
        web3.eth.subscribe('newBlockHeaders', function(error: Error, result: any) {
            if (!error) {
                done(new Error('no error thrown'))
            }
            try {
                expect(() => { throw error || 'no error' }).to.throw('Error from upstream')
                done()
            } catch (err) {
                done(err)
            }

        })
    })

})
