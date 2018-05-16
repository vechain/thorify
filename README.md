## Thorify

A web3 adaptor for VeChain Thor RESTful HTTP API.

## Install

``` bash
npm install --save thorify
```

## Usage

``` javascript
import { thorify } from "thorify";
const Web3 = require("web3");

const web3 = new Web3();
thorify(web3, "http://localhost:8669");

web3.eth.getBlock("latest").then(ret=>console.log(ret));
// Best block info will be displayed
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

In Thor official implementation , the client **DOES NOT** manage user's private-key/keyStore and using private key to sign a Transaction. unfortunately , thorify can not directly perform eth_sendTransaction but there is another way to sign a transaction. 

In [web3.js accounts](https://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html#eth-accounts), it gives the opportunity to add your private-key (Node.js , stored in memory; Browser , stored in memory/local storage) to accounts module. when you trying to send a transaction , the module will check the private key correspond with `from` parameter. when private key and `from` are matched , then the module will sign the transaction. 

The APIs that follows the mechanism are:

+ `web3.eth.sendTransaction()`
+ `contract.method.myMethod.send()`

``` javascript
// Initiate the web3 instance
web3.eth.accounts.wallet.add("0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65");

web3.eth.sendTransaction({
  from: "0x7567d83b7b8d80addcb281a71d54fc7b3364ffed",
  to: "0xd3ae78222beadb038203be21ed5ce7c9b1bff602",
  value: 100,
}).then(ret=>console.log(ret));
// Transaction receipt will be displayed

// Initiate the contract instance
ERC20Contract.methods.transfer("0xd3ae78222beadb038203be21ed5ce7c9b1bff602",100).send({
 from: "0x7567d83b7b8d80addcb281a71d54fc7b3364ffed",
});
// Transaction receipt will be displayed
```

### Parameters 

`Object` - The transaction object to send:
  - `from` - `String|Number`: The address for the sending account. Or an address or index of a local wallet in `web3.eth.accounts.wallet `.
  - `to` - `String`: (optional) The destination address of the message, left undefined for a contract-creation transaction.
  - `value`- `Number|String|BN|BigNumber`: (optional) The value transferred for the transaction in `wei`, also the endowment if it's a contract-creation transaction.
  - `gas`  - `Number`: (optional) The amount of gas to use for the transaction (unused gas is refunded).
  - `data` - `String`: (optional) Either a [ABI byte string](http://solidity.readthedocs.io/en/latest/abi-spec.html) containing the data of the function call on a contract, or in the case of a contract-creation transaction the initialisation code.
  - `nonce` - `Number`: (optional) Integer of a nonce. This is different from ethereum's nonce as it's a transaction count,in Thor it's a random number. 
  - `chainTag` - `Number`: (optional) **last byte** of the genesis block ID.
  - `blockRef` - `String`: (optional, Default first 8 bytes from **best block**) The BlockRef(an eight-byte array) includes two parts: the first four bytes contains the block height (number) and the rest four bytes a part of the referred block’s ID.if its future block should input blockNumber + "00000000".
  - `expiration` - `Number`: (optional, Default 0, Suggested 720) Number of blocks that can be used to specify when the transaction expires.Specifically, expiration+blockRef defines the height of the latest block that the transaction can be packed into.
  - `gasPriceCoef` - `Number`: (optional, Default 0, Suggested 128, range of [0,256) Coefficient used to calculate the total gas price.
  - `dependsOn` - `String`: (optional) ID of the transaction on which the current transaction depends. When it's setted this transaction will be packed after the the depended transaction executed successfully(`revert` in receipt must be `false`).


> This is not the only way for developers signing a transaction! <br>
> We encourage developers find a proper way to store private key and sign a transaction.


## Notes

- There are three special block number in Ethereum: `earliest`,`latest`,`pending`. In VeChain Thor, we introduced `best` block and there is no `pending` block, so they will be replaced with `0` (aka genesis), `best`, `best`

## Compatibility

  TODO

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
