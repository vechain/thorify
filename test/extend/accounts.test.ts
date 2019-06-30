'use strict'
import { expect } from 'chai'
import { web3, xhrUtility } from '../test-utils/init'

describe('extend:accounts', () => {

    it('normal sign Transaction', async () => {
        const ret = await web3.eth.accounts.signTransaction({
            to: '0xd3ae78222beadb038203be21ed5ce7c9b1bff602',
            value: '0x3e8',
            expiration: 720,
            gasPriceCoef: 128,
            chainTag: '0x89',
            blockRef: '0x000000352985d99d',
            dependsOn: '0x4ad4be11393f26dabf2b0d95a410c847981193bd1ff804095852606e5e7681c0',
            gas: 53000,
            nonce: 'dead',
        }, '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65')
        expect(ret).to.have.property('rawTransaction')
        expect(ret).to.have.property('messageHash')
    })

    it('sign Transaction with minimal param should not throw error', async () => {
        xhrUtility.setCachedResponse('/blocks/0', {
            id: '0xf7e2fb83191da98ab0dbc59596113058ed5d393634c87b5efac7f609bf010589',
        })
        xhrUtility.setCachedResponse('/blocks/best', {
            id: '0x000000352985d99d',
        })
        xhrUtility.setCachedResponse('/accounts/0xd3ae78222beadb038203be21ed5ce7c9b1bff602?revision=best', {
            gasUsed: 53000,
        })

        const ret = await web3.eth.accounts.signTransaction({
            to: '0xD3ae78222BEADB038203bE21eD5ce7C9B1BfF602',
            value: '0x3e8',
        }, '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65')
        expect(ret).to.have.property('rawTransaction')
        expect(ret).to.have.property('messageHash')
        xhrUtility.clearCachedResponse()
    })

    it('sign Transaction with callback', (done) => {
        web3.eth.accounts.signTransaction({
            to: '0xD3ae78222BEADB038203bE21eD5ce7C9B1BfF602',
            value: '0x3e8',
            expiration: 720,
            gasPriceCoef: 128,
            chainTag: '0x89',
            blockRef: '0x000000352985d99d',
            gas: 53000,
            nonce: 1198344495087,
        }, '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65', (error, ret) => {
            try {
                expect(ret).to.have.property('rawTransaction')
                expect(ret).to.have.property('messageHash')
                done()
            } catch (e) {
                done(e)
            }
        })
    })

    it('sign Transaction without chainTag', (done) => {
        xhrUtility.setCachedResponse('/blocks/best', {
            id: '',
        })
        web3.eth.accounts.signTransaction({
            to: '0xD3ae78222BEADB038203bE21eD5ce7C9B1BfF602',
            value: '0x3e8',
            expiration: 720,
            gasPriceCoef: 128,
            blockRef: '0x000000352985d99d',
            gas: 53000,
            nonce: 1198344495087,
        }, '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65').then(() => {
            done(new Error('no error thrown'))
        }).catch((e) => {
            try {
                expect(() => { throw e || 'no error' }).to.throw('error getting chainTag')
                done()
            } catch (err) {
                done(err)
            }
        })
    })

    it('sign Transaction with callback should return error in callback', (done) => {
        xhrUtility.setCachedResponse('/blocks/best', {
            id: '',
        })
        web3.eth.accounts.signTransaction({
            to: '0xD3ae78222BEADB038203bE21eD5ce7C9B1BfF602',
            value: '0x3e8',
            expiration: 720,
            gasPriceCoef: 128,
            blockRef: '0x000000352985d99d',
            gas: 53000,
            nonce: 1198344495087,
        }, '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65', (e) => {
            try {
                expect(() => { throw e || 'no error'  }).to.throw('error getting chainTag')
                done()
            } catch (err) {
                done(err)
            }
        })
    })

    it('sign Transaction without blockRef', (done) => {
        xhrUtility.setCachedResponse('/blocks/best', {
            id: '',
        })
        web3.eth.accounts.signTransaction({
            to: '0xD3ae78222BEADB038203bE21eD5ce7C9B1BfF602',
            value: '0x3e8',
            expiration: 720,
            gasPriceCoef: 128,
            chainTag: '0x89',
            gas: 53000,
            nonce: 1198344495087,
        }, '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65').then(() => {
            done(new Error('no error thrown'))
        }).catch((e) => {
            try {
                expect(() => { throw e }).to.throw('error getting blockRef')
                done()
            } catch (err) {
                done(err)
            }
        })
    })

    it('sign Transaction without gas', (done) => {
        // if reverted estimateGas will return null
        xhrUtility.setCachedResponse('/accounts/0xd3ae78222beadb038203be21ed5ce7c9b1bff602?revision=best', {
            reverted: true,
            data: '0x08c379a00x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000f736f6d657468696e672077726f6e670000000000000000000000000000000000',
        })
        web3.eth.accounts.signTransaction({
            to: '0xd3ae78222beadb038203be21ed5ce7c9b1bff602',
            value: '0x3e8',
            expiration: 720,
            gasPriceCoef: 128,
            chainTag: '0x89',
            blockRef: '0x000000352985d99d',
            data: '0xdead',
            nonce: 1198344495087,
        }, '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65').then(() => {
            done(new Error('no error thrown'))
        }).catch((e) => {
            try {
                expect(() => { throw e }).to.throw('Returned error: Gas estimation failed with VM reverted: something wrong')
                done()
            } catch (err) {
                done(err)
            }
        })

    })

    it('sign Transaction invalid data', (done) => {
        web3.eth.accounts.signTransaction({
            to: '0xd3ae78222beadb038203be21ed5ce7c9b1bff602',
            value: '0x3e8',
            expiration: 720,
            gasPriceCoef: 128,
            chainTag: '0x89',
            blockRef: '0x000000352985d99d',
            data: 'invalid data',
            gas: 100000,
            nonce: 1198344495087,
        }, '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65').then(() => {
            done(new Error('no error thrown'))
        }).catch((e) => {
            try {
                expect(() => { throw e }).to.throw('Data must be valid hex')
                done()
            } catch (err) {
                done(err)
            }
        })

    })

    it('sign Transaction without gas and 0-length clause should not throw error', async () => {
        xhrUtility.setCachedResponse('/accounts?revision=best', {
            gasUsed: 53000,
        })

        await web3.eth.accounts.signTransaction({
            expiration: 720,
            gasPriceCoef: 128,
            chainTag: '0x89',
            blockRef: '0x000000352985d99d',
            nonce: 1198344495087,
        }, '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65')

        await web3.eth.accounts.signTransaction({
            to: null,
            value: null,
            data: null,
            expiration: 720,
            gasPriceCoef: 128,
            chainTag: '0x89',
            blockRef: '0x000000352985d99d',
            nonce: 1198344495087,
        }, '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65')
        xhrUtility.clearCachedResponse()
    })

    it('sign Transaction without nonce won\'t throw error', async () => {
        await web3.eth.accounts.signTransaction({
            to: '0xD3ae78222BEADB038203bE21eD5ce7C9B1BfF602',
            value: '0x3e8',
            expiration: 720,
            gasPriceCoef: 128,
            chainTag: '0x89',
            blockRef: '0x000000352985d99d',
            gas: 53000,
        }, '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65')
    })

    it('recover transaction should return the signer address', async () => {
        const rawTx = '0xf85d818985352985d99d8202d0c0818082cf088086011702e5dfefc0b841d290fa00bc124d1cc22d9a3e6850aab0c9ba15952487dd4c716b4043fbb77a330b0c6f81a6e98f798fa82a86ee717e0f5dbbe72eaca29a6422c1d904e542905e01'
        expect(web3.eth.accounts.recoverTransaction(rawTx)).to.be.equal('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed')
    })

    it('hash message', async () => {
        const message = 'test message'
        expect(web3.eth.accounts.hashMessage(message)).to.be.equal('0x6bb54cc20ea49203c24ece6c631f81f35cf947b136246dc0de006609d294b032')
    })

    it('hash message with hexadecimal string', async () => {
        const message = '0x74657374206d657373616765'
        expect(web3.eth.accounts.hashMessage(message)).to.be.equal('0x6bb54cc20ea49203c24ece6c631f81f35cf947b136246dc0de006609d294b032')
    })

    it('sign message', async () => {
        const message = 'test message'
        const ret = web3.eth.accounts.sign(message, '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65')
        expect(ret.message).to.be.equal('test message')
        expect(ret.messageHash).to.be.equal('0x6bb54cc20ea49203c24ece6c631f81f35cf947b136246dc0de006609d294b032')
        expect(ret.signature).to.be.equal('0x9fd2e0f9b57405809fcb52887e62ac17abd2a94112ec272ee606589ea6da956b3cbfc7386e9e9383dced85f85386dcea401f82bba529f5a5452512985598388400')
    })

    it('recover with not-prefixed message', async () => {
        const message = 'test message'
        const signature = '0x9fd2e0f9b57405809fcb52887e62ac17abd2a94112ec272ee606589ea6da956b3cbfc7386e9e9383dced85f85386dcea401f82bba529f5a5452512985598388400'
        expect(web3.eth.accounts.recover(message, signature)).to.be.equal('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed')
    })

    it('recover with message hash', async () => {
        const messageHash = '0xf1d201623965f4a21390705e83ba1fb2c33600a529bd2fab2373c2558bf4cb5e'
        const signature = '0xce639afc9733cbffe7a2dd87e096856e5a81fc5094c9292919eb04eb9a751b7747986f7351d562a64b9b9c9d7989eec344570e754b0461a34bb598c1ee262aef00'
        expect(web3.eth.accounts.recover(messageHash, signature, true)).to.be.equal('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed')
    })

    it('recover with object', async () => {
        const messageHash = '0xf1d201623965f4a21390705e83ba1fb2c33600a529bd2fab2373c2558bf4cb5e'
        const signature = '0xce639afc9733cbffe7a2dd87e096856e5a81fc5094c9292919eb04eb9a751b7747986f7351d562a64b9b9c9d7989eec344570e754b0461a34bb598c1ee262aef00'
        expect(web3.eth.accounts.recover({ messageHash, signature })).to.be.equal('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed')
    })

})
