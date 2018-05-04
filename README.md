## Thorify

A web3 adaptor for VeChain Thor RESTful HTTP API.

## Install

```
npm install --save thorify
```

## Usage

``` js
import Thorify from 'thorify'
const Web3 = require('web3');

const thorProvider = new Thorify.ThorHttpProvider('http://localhost:8669');
const web3 = new Web3(thorProvider);

Thorify.extend(web3);

web3.eth.getBlock('latest').then(v=>console.log(v));
```

## Special Reminder

- There are three special blocknumber in Ethereum: `earliest`,`latest`,`pending`. In VeChain Thor, we introduced `best` block and there is no `pending` block, so they will be replaced with `0` (aka genesis), `best`, `best`

## Current Web3 method supported:

- [x] eth_getBlockByNumber
- [x] eth_getBlockByHash
- [x] eth_blockNumber
- [x] eth_getBalance
- [x] eth_getCode
- [x] eth_getStorageAt
- [x] eth_sendRawTransaction
- [x] eth_getTransactionByHash
- [x] eth_getTransactionReceipt
- [x] eth_call
- [x] eth_getLogs
- [x] eth_sendTransaction(transaction signed with presetted wallet, the real API called behind is `eth_sendRawTransaction`)

## Extended Web3 method

- [x] eth_getEnergy
- [x] eth_getChainTag
- [x] eth_getBlockRef

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
