## Thorify &nbsp;&nbsp; [![Gitter](https://badges.gitter.im/vechain/thor.svg)](https://gitter.im/vechain/thor?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![NPM Version](https://badge.fury.io/js/thorify.svg)](https://www.npmjs.com/package/thorify)
[![Build Status](https://travis-ci.org/vechain/thorify.svg)](https://travis-ci.org/vechain/thorify)
[![Coverage Status](https://coveralls.io/repos/github/vechain/thorify/badge.svg?branch=master)](https://coveralls.io/github/vechain/thorify?branch=master)

A web3 adaptor for VeChain [Thor](https://github.com/vechain/thor) RESTful API.


## Table of contents

* [Install](#install)
* [Usage](#usage)
* [Web3 method supported](#web3-method-supported)
* [Send transaction](#send-transaction)
* [Documentation](https://vechain.github.io/thorify)
* [Play with multi-clause](#play-with-multi-clause)
* [FAQ](#faq)
  * [Method not supported](#method-not-supported)
* [Notes](#notes)
* [Compatibility](#compatibility)
* [License](#License)

## Install

``` bash
npm install --save thorify
npm install --save web3 # Web3 is needed as dependency.
```


## Usage

``` javascript
// ES6 style
import { thorify } from "thorify";
const Web3 = require("web3");		// Recommend using require() instead of import here

const web3 = thorify(new Web3(), "http://localhost:8669");

web3.eth.getBlock("latest").then(res => console.log(res));
// Best block info will be displayed
```

If you would like to write code in ES5, check below for the initialization code.

``` javascript
// ES5 style
const thorify = require("thorify").thorify;
const Web3 = require("web3");

const web3 = thorify(new Web3(), "http://localhost:8669");

web3.eth.getBlock("latest").then(res => console.log(res));
// Best block info will be displayed
```

## Web3 method supported

```
web3 instance
├── eth
│   ├── getBlockNumber
│   ├── getBalance
│   ├── getStorageAt
│   ├── getCode
│   ├── getBlock
│   ├── getTransaction
│   ├── getTransactionReceipt
│   ├── sendTransaction
│   ├── sendSignedTransaction
│   ├── call
│   ├── estimateGas
│   ├── getPastLogs
│   ├── getEnergy
│   ├── getChainTag
│   ├── getBlockRef
│   ├── accounts
│   └── Contract
│       ├── Constructor(new Contract())
│       ├── clone
│       ├── deploy
│       ├── methods
│       ├── methods.myMethod.call
│       ├── methods.myMethod.send
│       ├── methods.myMethod.estimateGas
│       ├── methods.myMethod.encodeABI
│       └── getPastEvents
└── utils

```

## Send Transaction

In Thor official implementation , the client **DOES NOT** neither manage user's private-key/keyStore nor use private key to sign a Transaction. Unfortunately, thorify can not directly perform `eth_sendTransaction` but there is another way to sign a transaction.

In [web3.js accounts](https://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html#eth-accounts), it gives the opportunity to add your private-key, stored in your runtime context (In Node.js context, it's stored in memory while in Browser context, it's stored in memory/local storage), to accounts module. When you are trying to send a transaction, the module will check the private key associated with from field. Once the private key and from have been matched, the module will sign the transaction.
The APIs that follows the mechanism are:

+ `web3.eth.sendTransaction()`
+ `contract.deploy.send()`
+ `contract.methods.myMethod.send()`

## Documentation

[API Reference](https://vechain.github.io/thorify/#/?id=api-reference)

## Play with multi-clause

1. [thor-model-kit](https://github.com/vechain/thor-model-kit) supports multi-clause and sign transaction
2. send signed transaction using [sendSignedTransaction](https://vechain.github.io/thorify/#/?id=send-signed-transaction)

## FAQ

### Method not supported

The RESTful API of Thor is different with Ethereum's JSON-RPC, therefore, there are some methods in web3 are not supported by thorify, feel free to open an issue discuss the features.

There is a possibility that when you trying to call `sendTransaction` or `send` functions, thorify will return `Method not supported` under version 0.3.1, due to account module will check the private key associated with `from` field. After upgrade to version 0.3.1 or newer, thorify will show `The private key corresponding to from filed can't be found in local eth.accounts.wallet ` to make an error more specific.

## Notes

- There are three special block number in Ethereum: `earliest`,`latest`,`pending`. In VeChain Thor, we introduced `best` block and there is no `pending` block, so they will be replaced with `0` (aka genesis), `best`, `best`

## Compatibility

   Currently, `thorify` is compatible with `web3@1.0*`.

## License

This project is licensed under the MIT license, Copyright (c) 2017 VeChain Foundation. For more information see [LICENSE.md](LICENSE.md).

```
The MIT License

Copyright (c) 2017 VeChain Foundation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```


