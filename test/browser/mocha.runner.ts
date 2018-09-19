'use strict'

mocha.setup('bdd')

import '../web3/initialization.test'
import './required-module.test'

mocha.checkLeaks()
mocha.run()
