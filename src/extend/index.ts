'use strict'

import { extendAccounts } from './accounts'
import { extendContracts } from './contracts'
import { extendFormatters } from './formatters'
import { extendMethods } from './methods'

const extend = function(web3: any) {
    extendAccounts(web3)
    extendFormatters(web3)
    extendMethods(web3)
    extendContracts(web3)
}

export {
    extend,
}
