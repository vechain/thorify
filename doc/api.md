# API

## Table of contents

* [Get account balance ](#get-account-balance)
* [Get account VTHO balance](#get-account-vtho-balance)
* [Get chainTag](#get-chain-tag)
* [Get block number](#get-block-number)
* [Get block](#get-block)
* [Get transaction ](#get-transaction )
* [Get transaction receipt](#get-transaction-receipt)
* [Send raw transaction](#send-raw-transaction)
* [Send transaction](#send-transaction)
* [Contract call](#contract-call)

## Get account balance

Query the balance of an address.

``` javascript
eth.getBalance(address[,blockNumberOrHash]).then(result => {
	console.log(result)
})
> "1000000000000000000"
```

**Parameters**

- `address` - `String`: The address to get the balance of.
- `blockNumberOrHash` - `Number | String`(optional):  If you pass this parameter it will not use the default block set with `latest`

`BlockNumberOrHash` parameters can be one of the following:

+ `Number` : Block number
+ `0` : The genesis block 
+ `earliest` : The genesis block
+ `latest`:The latest block
+ `String`: Block hash
	

**Returns**

`Promise` returns `String`: The balance of account in `wei`(number in string)

## Get account VTHO balance

Query the VTHO balance of an address

``` javascript
eth.getEnergy(address[,blockNumberOrHash]).then(result => {
	console.log(result)
})
> "1000000000000000000"
```

**Parameters**

- `address` - `String`: The address to get the VTHO balance of.
- `blockNumberOrHash` - `Number | String`(optional):  If you pass this parameter it will not use the default block set with `latest`

`BlockNumberOrHash` parameters can be one of the following:

+ `Number` : Block number
+ `0` : The genesis block 
+ `earliest` : The genesis block
+ `latest`:The latest block
+ `String`: Block hash
	
**Returns**

`Promise` returns `String`: The balance of VTHO in `wei`(number in string)

## Get chain tag

Return genesis block information , chain tag is the last byte of the genesis block ID.

``` javascript
eth.getChainTag().then(result => {
	console.log(result)
})
> "0x27"
```

**Returns**

`Promise` returns `String`: The chain tag

## Get block number

Query the current best block number

``` javascript
eth.getBlockNumber().then(result => {
	console.log(result)
})
> 100
```

**Returns**

`Promise` returns `Number`: The current best block number

## Get block

Get a block matching the block number or block hash.

``` javascript
eth.getBlock(blockNumberOrHash).then(result => {
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

- `blockNumberOrHash` - `Number | String`(optional):  If you pass this parameter it will not use the default block set with `latest`

`BlockNumberOrHash` parameters can be one of the following:

+ `Number` : Block number
+ `0` : The genesis block 
+ `earliest` : The genesis block
+ `latest`:The latest block
+ `String`: Block hash

**Returns**

`Promise` returns `Block Object`:

+ `number` - `Uint32`: Number of block
+ `id` - `String`: Identifier of the block(bytes32)
+ `parentID` - `String`: ID of parent block(bytes32)
+ `timestamp` - `Uint64`: Unix timestamp of block
+ `gasLimit` - `Uint64`: Gas limit of the block
+ `beneficiary` - `String`: Address of account to receive block reward
+ `gasUsed` - `Uint64`: Actual gas used of block
+ `totalScore` - `Uint64`: Score of the main chain
+ `txRoot` - `String`: Root hash of transaction in the block(bytes32)
+ `stateRoot` - `String`: Root hash of state(bytes32)
+ `singer` - `String`: Address of who signed the block(bytes20)
+ `isTrunk` - `Boolean`: Whether the block is in trunk
+ `transactions` - `Array of String`: Array of transaction IDs

## Get transaction 

Get a transaction matching transaction Hash.

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
    meta:
     { blockID: "0x000008b91fe9e0654c4fdd7eee4ed8b6e3e09b953993f2e2d91092e086b70423",
       blockNumber: 2233,
       blockTimestamp: 1528451080 },
    blockNumber: 2233 
}
```

**Parameters**

- `transactionID` : `String`

**Returns**
 
`Promise` returns `Transaction Object`:

+ `id` - `String`: Identifier of the transaction
+ `size` - `Uint32`: Byte size of the transaction that is RLP encoded
+ `chainTag` - `Uint8`: Last byte of genesis block ID  
+ `expiration` - `Uint32` : Expiration relative to blockRef(in unit block)
+ `clauses` - `Array of Clause Object` 
+ `gasPriceCoef` - `Uint8`: Coefficient used to calculate the final gas price
+ `gas`  - `Uint8`: Maximum of gas can be consumed to execute this transaction
+ `dependsOn` - `String|Null`: ID of the transaction which the current transaction depends(bytes32)
+ `nonce` - `String`: Transaction nonce
+ `meta` - `Meta Object`
+ `blockNumber`: Same as `meta.blockNumer`

`Clause Object`

+ `to` - `String|Null`: Recipient of clause ,`Null` for contract deployment (byte32) 
+ `value` - `String`: Hex form of token to be transferred
+ `data` - `String`: Input data (bytes)

`Meta Object`

+ `blockID` - `String`: Identifier of the block(bytes32)
+ `blockNumber` - `Unit32`: Number of block 
+ `blockTimestamp` - `Uint64`: Unix timestamp of block

## Get transaction receipt

Get a transaction receipt matching transaction Hash.

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
    meta:
        { blockID: "0x000008d168c7d5ca180a0f5cf0aba148982b9d5bed263ee8bdc94e6863962a86",
        blockNumber: 2257,
        blockTimestamp: 1528451320,
        txID: "0x0d79ef6830ee3a8ad55d31b4c30e53ebf2252da90db6074f9304889c682f0490",
        txOrigin: "0x4f6FC409e152D33843Cf4982d414C1Dd0879277e" },
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

`Promise` return `TransactionReceipt Object`:

+ `gasUsed` - `Uint64`: Actual gas used
+ `gasPayer` - `String`: Address of account who paid used gas
+ `paid` - `String`: Hex form of amount of paid energy
+ `reward` - `String`: Hex form of amount of reward
+ `reverted` - `Boolean`: true means the transaction was reverted
+ `meta` - `Meta Object`
+ `outputs` - `Array of TransactionReceipt Output Object`: Clause"s corresponding output
+ `blockNumber`: Same as `block.number`
+ `blockHash`: Same as `block.id`
+ `transactionHash`: Same as `tx.id`
+ `status`: `0x0` when `revert` is true and `0x1` when `revert` is false

`Meta Object`

+ `blockID` - `String`: Identifier of the block(bytes32)
+ `blockNumber` - `Unit32`: Number of block 
+ `blockTimestamp` - `Uint64`: Unix timestamp of block
+ `txID` - `String`: Identifier of the transaction
+ `txOrigin` - `String`: The one who signed the transaction

` TransactionReceipt Output Object`

+ `contractAddress` - `String`: Deployed contract address, if the corresponding clause is a contract deployment clause
+ `events` - `Array of Event Log Object`: Event log objects produced during clause execution
+ `transfer` - `Array of Transfer Object`: Transfer produced during clause execution

`Event Log Object`

+ `address` - `String`: The address of contract which produces the event (bytes20)
+ `topics` - `Array of String`: an array with max 4 32 Byte topics, topic 1-3 contains indexed parameters of the log.
+ `data` - `String`: The data containing non-indexed log parameter.

`Transfer Object`

+ `sender` - `String`: Adress that sends tokens
+ `recipient` - `String`: Address that receives tokens
+ `amount` - `String`: Amount of vet in `wei`

## Send raw transaction

Send a raw transaction to the network.

``` javascript
eth.sendSignedTransaction(signedTransaction).then(result => {
	console.log(result)
})
> "TransactionID will be displayed if sent successfully"
```

**Parameters**

- `signedTransaction` - `String`: Signed transaction in hex format

**Returns**

`PromiseEvent`(same as web3): A promise combined event emitter. Will be resolved when the transaction receipt is available. Additionally the following events are available:

+ `transactionHash` returns `String`: Is fired right after the transaction is send and a transaction hash is available.
+ `receipt` returns `TransactionReceipt Object`: Is fired when the transaction receipt is available.
+ `confirmation` returns `Number`, `TransactionReceipt Object`: Is fired for every confirmation up to the 12th confirmation. Receives the confirmation number as the first and the receipt as the second argument. Fired from confirmation 0 on, which is the block where its minded.
+ `error` returns `Error`: Is fired if an error occurs during sending. If a out of gas error, the second parameter is the receipt.


## Send transaction

!> **Before starting with sendTransaction, please be sure you have read the `sendTransaction` part in [README.md](../README.md#send-transaction)**

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
+ `data` - `String`: (optional) Either the [ABI byte string](http://solidity.readthedocs.io/en/latest/abi-spec.html) containing the data of the function call on a contract, or the initialization code of a contract-creation transaction.
+ `nonce` - `Number`: (optional) A random 64-bit scalar value that is different from ethereum"s nonce which is a transaction count. 
+ `chainTag` - `Number`: (optional) **The last byte** of the genesis block ID representing the identity of a chain.
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


!> **This is not the only way for developers signing a transaction! <br>
We encourage developers find a proper way to store private key and sign a transaction.**

## Contract call

Executes a message call, which is directly executed in the VM based on the current best block's state, but he never committed to the blockchain.

``` javascript
eth.call(callObject [, blockNumberOrHash]).then(result => {
	console.log(result)
})
> "result will be displayed"
```

**Parameters**

- `callObject` - `Transaction Object`
- `blockNumberOrHash` - `Number | String`(optional):  If you pass this parameter it will not use the default block set with `latest`

`Transaction Object`:
+ `from` - `String|Number`:(optional) Either The address of transaction sender"s account or the address/index of a local wallet in `web3.eth.accounts.wallet `.
+ `to` - `String`: (optional) The destination address of the message, left undefined for a contract-creation transaction.
+ `value`- `Number|String|BN|BigNumber`: (optional) The value, with an unit of `wei`, transferred through the transaction. Specifically, it plays the role of endowment when the transaction is contract-creation type.
+ `gas`  - `Number`: (optional) The maximum amount of gas that can be used by the transaction (unused gas is going to be refunded right after the transaction execution).
+ `data` - `String`: (optional) Either the [ABI byte string](http://solidity.readthedocs.io/en/latest/abi-spec.html) containing the data of the function call on a contract, or the initialization code of a contract-creation transaction.
+ `gasPrice` - `Number|String|BN|BigNumber`: (optional) The price of gas for this transaction in `wei`.

`BlockNumberOrHash` parameters can be one of the following:

+ `Number` : Block number
+ `0` : The genesis block 
+ `earliest` : The genesis block
+ `latest`:The latest block
+ `String`: Block hash

**Returns**

`Promise` returns `String`: The returned data of the call(hex string), e.g. a smart contract functions return value.