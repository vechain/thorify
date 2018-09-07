'use strict'

import rewiremock from 'rewiremock'
const FakeXHR2 = require('./fake-xhr2')
const Web3 = require('web3')

// Test utilities
const xhrUtility = new FakeXHR2()
rewiremock('xhr2').with(require('./fake-xhr2'))
rewiremock.enable()

import { thorify } from '../../src'
const web3 = thorify(new Web3())

export {
    web3,
    xhrUtility,
}
