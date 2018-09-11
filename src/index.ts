'use strict'

import { extend } from './extend'
import { ThorProvider } from './provider'

const thorify = function(web3Instance: any, host = 'http://localhost:8669', timeout = 0) {
    const provider = new ThorProvider(host, timeout)
    web3Instance.setProvider(provider)

    extend(web3Instance)

    return web3Instance
}

export { thorify }
