## Thorify

[![NPM Version](https://badge.fury.io/js/thorify.svg)](https://www.npmjs.com/package/thorify)
[![Build Status](https://travis-ci.org/vechain/thorify.svg)](https://travis-ci.org/vechain/thorify)
[![Coverage Status](https://coveralls.io/repos/github/vechain/thorify/badge.svg?branch=master)](https://coveralls.io/github/vechain/thorify?branch=master)

A web3 adaptor for VeChain [Thor](https://github.com/vechain/thor) RESTful API.

## Install

``` bash
npm install --save thorify
```


## Usage

``` javascript
// ES6 style
import { thorify } from "thorify";
const Web3 = require("web3");		// recommand use require() instead of import here

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

## Methods

### Get account balance 

Get the balance of an address.

``` javascript
eth.getBalance("address","defaultBlockNumber").then(result => {
	console.log(result)
})
> "1000000000000000000"
```

**Parameters**

- `Address` : String
- `defaultBlockNumber` :  Number | String

Default block parameters can be one of the following:

+ `Number` : a block Number
+ `0` : The genesis block 
+ `earliest` : The genesis block
+ `latest`:the latest block
	

**Returns**

The balance of account in wei(number in string)

### Get account VTHO balance

Get the VTHO balance of an address

``` javascript
eth.getEnergy("address","defaultBlock").then(result => {
	console.log(result)
})
> "1000000000000000000"
```

**Parameters**

- `Address` : String
- `defaultBlock` :  Number | String

Default block parameters can be one of the following:

+ `Number` : a block Number
+ `0` : The genesis block 
+ `earliest` : The genesis block
+ `latest`:the latest block
	
**Returns**

The balance of VTHO (number in string)

### Get transaction 

Show a transaction matching transaction Hash.

``` javascript
eth.getTransaction(transactionID).then(result => {
	console.log(result)
})
> { 
    id: "0xb4601cc338aad0ff2d32565fcb9ed06e5a556da8cffe03866e73ba06c4812cf0",
    size: 132,
    chainTag: "0x9a",
    blockRef: "0x000008b8092aff75",
    expiration: 720,
    clauses:
     [ { to: "0x4f6FC409e152D33843Cf4982d414C1Dd0879277e",
         value: "5000000000000000000000000000",
         data: "0x" } ],
    gasPriceCoef: 128,
    gas: 21000,
    dependsOn: null,
    nonce: "0x1538f9a34aa",
    origin: "0xe59D475Abe695c7f67a8a2321f33A856B0B4c71d",
    block:
     { id: "0x000008b91fe9e0654c4fdd7eee4ed8b6e3e09b953993f2e2d91092e086b70423",
       number: 2233,
       timestamp: 1528451080 },
    blockNumber: 2233 
}
```

**Parameters**

- `transactionID` : `String`

**Returns**
 
 returns `Transaction Object`:

+ `id` - `String`: identifier of the transaction
+ `size` - `Uint32`:  byte size of the transaction that is RLP encoded
+ `chainTag` - `Uint8`: last byte of genesis block ID  
+ `expiration` - `Uint32` : expiration relative to blockRef(in unit block)
+ `clauses` - `Array of Clause Object` 
+ `gasPriceCoef` - `Uint8`: coefficient used to calculate the final gas price
+ `gas`  - `Uint8`: maximum of gas can be consumed to execute this transaction
+ `dependsOn` - `String|Null`: ID of the transaction which the current transaction depends(bytes32)
+ `nonce` - `String`: transaction nonce
+ `block` - `BlockContext Object`
+ `blockNumber`: same as `block.numer`

`Clause Object`

+ `to` - `String|Null`: Recipient of clause ,`Null` for contract deployment (byte32) 
+ `value` - `String`: hex form of token to be transferred
+ `data` - `String`: input data (bytes)

`BlockContext Object`

+ `id` - `String`: Identifier of the block(bytes32)
+ `number` - `Unit32`: Number of block 
+ `timestamp` - `Uint64`: Unix timestamp of block

###  Get transaction receipt

Show a transaction receipt matching transaction Hash.

``` javascript
eth.getTransactionReceipt(transactionHash).then(result => {
	console.log(result)
})
> { 
    gasUsed: 66846,
    gasPayer: "0x4f6FC409e152D33843Cf4982d414C1Dd0879277e",
    paid: "0x39facb2d5afc30000",
    reward: "0x1164d68d9b4ba8000",
    reverted: false,
    block:
        { id: "0x000008d168c7d5ca180a0f5cf0aba148982b9d5bed263ee8bdc94e6863962a86",
        number: 2257,
        timestamp: 1528451320 },
    tx:
       { id: "0x0d79ef6830ee3a8ad55d31b4c30e53ebf2252da90db6074f9304889c682f0490",
         origin: "0x4f6FC409e152D33843Cf4982d414C1Dd0879277e" },
    outputs:[
        { contractAddress: null,
          events:
           [ { address: "0x0000000000000000000000000000456E65726779",
               topics: [Array],
               data: "0x00000000000000000000000000000000000000000000010f0cf064dd59200000" } ],
          transfers: [] },
        { contractAddress: null,
          events: [],
          transfers:
           [ { sender: "0x4f6fc409e152d33843cf4982d414c1dd0879277e",
               recipient: "0x7567d83b7b8d80addcb281a71d54fc7b3364ffed",
               amount: "0x10f0cf064dd59200000" } ] }
        ],
      blockNumber: 2257,
      blockHash: "0x000008d168c7d5ca180a0f5cf0aba148982b9d5bed263ee8bdc94e6863962a86",
      transactionHash: "0x0d79ef6830ee3a8ad55d31b4c30e53ebf2252da90db6074f9304889c682f0490",
      status: "0x1" 
}
```

**Parameters**

- `TransactionHash`: `String`

**Returns**

return `TransactionReceipt Object`:

+ `gasUsed` - `Uint64`: Actual gas used
+ `gasPayer` - `String`: address of account who paid used gas
+ `paid` - `String`: hex form of amount of paid energy
+ `reward` - `String`: hex form of amount of reward
+ `reverted` - `Boolean`: true means the transaction was reverted
+ `block` - `BlockContext Object`
+ `tx` - `TransactionContext Object`
+ `outputs` - `Array of TransactionReceipt Output Object`: clause"s corresponding output
+ `blockNumber`: same as `block.number`
+ `blockHash`: same as `block.id`
+ `transactionHash`: same as `tx.id`
+ `status`: `0x0` when `revert` is true and `0x1` when `revert` is false

`BlockContext Object`

+ `id` - `String`: Identifier of the block(bytes32)
+ `number` - `Unit32`: Number of block 
+ `timestamp` - `Uint64`: Unix timestamp of block

`TransactionContext Object`

+ `id` - `String`: identifier of the transaction
+ `origin` - `String`: the one who signed the transaction

` TransactionReceipt Output Object`

+ `contractAddress` - `String`: deployed contract address, if the corresponding clause is a contract deployment clause
+ `events` - `Array of Event Log Object`: event log objects produced during clause execution
+ `transfer` - `Array of Transfer Object`: transfer produced during clause execution

`Event Log Object`

+ `address` - `String`: the address of contract which produces the event (bytes20)
+ `topics` - `Array of String`: An array with max 4 32 Byte topics, topic 1-3 contains indexed parameters of the log.
+ `data` - `String`: The data containing non-indexed log parameter.

`Transfer Object`

+ `sender` - `String`: address that sends tokens
+ `recipient` - `String`: address that receives tokens
+ `amount` - `String`: amount of vet in wei

### Get block

Get a block matching the block number or block hash.

``` javascript
eth.getBlock("defaultBlockNumber").then(result => {
	console.log(result)
})
> {
    number: 19183,
    id: "0x00004aef378c84fcbd64341cd635aa03b24ad6304acceeaf1196158870e63f2e",
    size: 238,
    parentID: "0x00004aee9f0270ca602f05e8ed8a1f362b59f9b452af9b23e9429e7b006749de",
    timestamp: 1528620660,
    gasLimit: 10000000,
    beneficiary: "0x25ae0ef84da4a76d5a1dfe80d3789c2c46fee30a",
    gasUsed: 0,
    totalScore: 37385,
    txsRoot: "0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0",
    stateRoot: "0x5dfcf545f0b9aca25c0037dc8b0eb95b7ad1751cc5e6f782b234bd286cf081fd",
    receiptsRoot: "0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0",
    signer: "0x25ae0ef84da4a76d5a1dfe80d3789c2c46fee30a",
    isTrunk: true,
    transactions: [] 
}
```

**Parameters**

- `defaultBlock`:  `Number|String`

Default block parameters can be one of the following:

+ `Number` : a block Number
+ `0` : The genesis block 
+  `earliest` : The genesis block
+  `latest`:the latest block

**Returns**

returns `Block Object`

+ `number` - `Uint32`: number of block
+ `id` - `String`: Identifier of the block(bytes32)
+ `parentID` - `String`: ID of parent block(bytes32)
+ `timestamp` - `Uint64`: Unix timestamp of block
+ `gasLimit` - `Uint64`: Gas limit of the block
+ `beneficiary` - `String`: address of account to receive block reward
+ `gasUsed` - `Uint64`: actual gas used of block
+ `totalScore` - `Uint64`: score of the main chain
+ `txRoot` - `String`: root hash of transaction in the block(bytes32)
+ `stateRoot` - `String`: root hash of state(bytes32)
+ `singer` - `String`:address of who signed the block(bytes20)
+ `isTrunk` - `Boolean`: whether the block is in trunck
+ `transactions` - `Array of String`: array of transaction IDs

### Get chainTag

Return genesis block information , chain tag is the last byte of the genesis block ID.

``` javascript
eth.getChainTag().then(result => {
	console.log(result)
})
> "0x27"
```

###  Send raw transaction

Send a raw transaction to the network.

``` javascript
eth.sendSignedTransaction(signedTransaction).then(result => {
	console.log(result)
})
> "TransactionID will be displayed if sent successfully"
```

**Parameters**

- `signedTransaction` - `String`: signed transaction in hex format

**Returns**

`PromiseEvent`(same as web3): A promise combined event emitter. Will be resolved when the transaction receipt is available. Additionally the following events are available:

+ `transactionHash` returns `String`: Is fired right after the transaction is send and a transaction hash is available.
+ `receipt` returns `TransactionReceipt Object`: Is fired when the transaction receipt is available.
+ `confirmation` returns `Number`, `TransactionReceipt Object`: Is fired for every confirmation up to the 12th confirmation. Receives the confirmation number as the first and the receipt as the second argument. Fired from confirmation 0 on, which is the block where its minded.
+ `error` returns `Error`: Is fired if an error occurs during sending. If a out of gas error, the second parameter is the receipt.


### Send Transaction

In Thor official implementation , the client **DOES NOT** neither manage user's private-key/keyStore nor use private key to sign a Transaction. Unfortunately , thorify can not directly perform `eth_sendTransaction` but there is another way to sign a transaction. 

In [web3.js accounts](https://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html#eth-accounts), it gives the opportunity to add your private-key, stored in your runtime context (In Node.js context, it's stored in memory while in Browser context, it's stored in memory/local storage), to accounts module. When you are trying to send a transaction, the module will check the private key associated with from field. Once the private key and from have been matched, the module will sign the transaction.
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
}).then(ret=>console.log(ret));
// Transaction receipt will be displayed
```

**Parameters**

`Transaction Object` - The transaction object to send:
  
+ `from` - `String|Number`: Either The address of transaction sender"s account or the address/index of a local wallet in `web3.eth.accounts.wallet `.
+ `to` - `String`: (optional) The destination address of the message, left undefined for a contract-creation transaction.
+ `value`- `Number|String|BN|BigNumber`: (optional) The value, with an unit of `wei`, transferred through the transaction. Specifically, it plays the role of endowment when the transaction is contract-creation type.
+ `gas`  - `Number`: (optional) The maximum amount of gas that can be used by the transaction (unused gas is going to be refunded right after the transaction execution).
+ `data` - `String`: (optional) Either the [ABI byte string](http://solidity.readthedocs.io/en/latest/abi-spec.html) containing the data of the function call on a contract, or the initialisation code of a contract-creation transaction.
+ `nonce` - `Number`: (optional) A random 64-bit scalar value that is different from ethereum"s nonce which is a transaction count. 
+ `chainTag` - `Number`: (optional) **the last byte** of the genesis block ID representing the identity of a chain.
+ `blockRef` - `String`: (optional, by default, the first 8 bytes of **best block** ID). The BlockRef (an eight-byte array) includes two parts: the first four bytes contains the block height (number) and the rest four bytes is part of the referred block’s ID. If the referred block is future block, blockNumber + "00000000" should be added.
+ `expiration` - `Number`: (optional, Default 0, Suggested 720) Number of  blocks that can be used to specify when the transaction expires. Specifically, expiration+blockRef defines the height of the latest block that the transaction can be packed into.
+ `gasPriceCoef` - `Number`: (optional, by default 0, Suggested 128, with the range of [0,256) Coefficient that is used to calculate the total gas price.
+ `dependsOn` - `String`: (optional) ID of the transaction on which the current transaction depends. When it's set this transaction will be packed after the depended transaction is executed successfully (in this case, the `revert` in depended transaction receipt must be `false`).

**Returns**

`PromiseEvent`(same as web3): A promise combined event emitter. Will be resolved when the transaction receipt is available. Additionally the following events are available:

+ `transactionHash` returns `String`: Is fired right after the transaction is send and a transaction hash is available.
+ `receipt` returns `TransactionReceipt Object`: Is fired when the transaction receipt is available.
+ `confirmation` returns `Number`, `TransactionReceipt Object`: Is fired for every confirmation up to the 12th confirmation. Receives the confirmation number as the first and the receipt as the second argument. Fired from confirmation 0 on, which is the block where its minded.
+ `error` returns `Error`: Is fired if an error occurs during sending. If a out of gas error, the second parameter is the receipt.


> This is not the only way for developers signing a transaction! <br>
> We encourage developers find a proper way to store private key and sign a transaction.


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


