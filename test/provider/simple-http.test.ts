'use strict'
import { xhrUtility } from '../test-utils/init'

import {expect} from 'chai'
import {HTTP} from '../../src/provider/simple-http'

describe('simple http', () => {
    it('get', async () => {
        HTTP.get('http://localhost:8669/test')

        const { url } = xhrUtility.extractRequest()
        expect(url).to.be.equal('/test')
    })

    it('post', async () => {
        HTTP.post('http://localhost:8669/test', {data: 'body'})

        const { url, body } = xhrUtility.extractRequest()

        expect(url).to.be.equal('/test')
        expect(body).to.have.property('data', 'body')
    })
})

describe('simple http: error handling', () => {

    it('parse error should throw error', (done) => {

        xhrUtility.setError('ParseError')
        HTTP.get('http://localhost:8669/test').then(() => {
            done(new Error('no error thrown'))
        }).catch((e) => {
            try {
                expect(() => { throw e || 'no error' }).to.throw('[thor-provider]Error parsing the response: Unexpected token t in JSON at position 1')
                done()
            } catch (err) {
                done(err)
            }
        })

    })

    it('connect error should throw error', (done) => {

        xhrUtility.setError('ConnectError')
        HTTP.get('http://localhost:8669/test').then(() => {
            done(new Error('no error thrown'))
        }).catch((e) => {
            try {
                expect(() => { throw e || 'no error' }).to.throw('[thor-provider]Connect error: send failed')
                done()
            } catch (err) {
                done(err)
            }
        })

    })

    it('timeout error should throw error', (done) => {

        xhrUtility.setError('TimeoutError')
        HTTP.get('http://localhost:8669/test').then(() => {
            done(new Error('no error thrown'))
        }).catch((e) => {
            try {
                expect(() => { throw e || 'no error' }).to.throw('[thor-provider]Time out for whatever reason, check your provider')
                done()
            } catch (err) {
                done(err)
            }
        })

    })

})
