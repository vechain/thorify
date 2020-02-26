'use strict'

import { expect } from 'chai'
import { web3, xhrUtility } from '../test-utils/init'

const ABI = [{ anonymous: false, inputs: [{ indexed: true, name: '_from', type: 'address' }, { indexed: true, name: '_to', type: 'address' }, { indexed: false, name: '_value', type: 'uint256' }], name: 'Transfer', type: 'event' }]
const Address = '0x0000000000000000000000000000456e65726779'
const contract = new web3.eth.Contract(ABI, Address)

describe('web3.contract', () => {
    beforeEach(() => {
        xhrUtility.resetMockData()
    })

    it('getPastEvents without parameter', async () => {
        await contract.getPastEvents('Transfer')
        const { url, body } = xhrUtility.extractRequest()

        expect(url).to.be.equal('/logs/event')
        expect(body).to.have.property('criteriaSet')
        expect((body as any).criteriaSet).to.be.an('array').to.have.lengthOf(1)
        expect((body as any).criteriaSet[0]).to.have.property('address', Address)

        expect(body).to.not.have.property('range')
        expect(body).to.not.have.property('options')
    })

    it('getPastEvents', async () => {
        await contract.getPastEvents('Transfer', { range: {}, options: {}, order: 'ASC' })

        const { url, body } = xhrUtility.extractRequest()

        expect(url).to.be.equal('/logs/event')
        expect(body).to.have.property('order', 'ASC')
      })

})
