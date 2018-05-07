## Thorify

A web3 adaptor for VeChain Thor RESTful HTTP API.

## Install

``` bash
npm install --save thorify
```

## Usage

``` js
import Thorify from 'thorify'
const Web3 = require('web3');

const thorProvider = new Thorify.ThorHttpProvider('http://localhost:8669');
const web3 = new Web3(thorProvider);

// Must be called with web3 instance
Thorify.extend(web3);

web3.eth.getBlock('latest').then(v=>console.log(v));
```

## Current Web3 method supported:

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
│   ├── sign
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

  In thor's official implementation, unlike ethereum's, the client doesn't manage user's private key storage and transaction signing. So in thorify, web3 can't perform `eth_sendTransaction` and `contract.method.myMethod.send()`, thanks to `web3.eth.accounts` there is a way for developers sending transaction without dealing with transaction signing.Check the steps below:

  + Add wallet via `web3.eth.accounts.wallet.add('privateKey')` or `web3.eth.accounts.wallet.create(numberOfAccounts [, entropy])` 
  + Call `web3.eth.sendTransaction({from: 'AccountAddress'})`, `AccountAddress` should be present in  `web3.eth.accounts.wallet`， so that the web3 instance can sign the transaction within `web3.eth.accounts`

  > This is not the only way for developers signing a transaction! <br>
  > We encourage developers find a proper way to store private key and sign a transaction.


## Notes

- There are three special block number in Ethereum: `earliest`,`latest`,`pending`. In VeChain Thor, we introduced `best` block and there is no `pending` block, so they will be replaced with `0` (aka genesis), `best`, `best`

## Compatibility

  TODO

## License

This project is licensed under the MIT license, Copyright (c) 2017 VeChain Foundation. For more information see LICENSE.md.

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
