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
* [Documentation](https://thorify.vecha.in)
* [Play with multi-clause](#play-with-multi-clause)
* [Which Stack Should I Choose Regarding Connex,Thorify And Web3-Gear](#which-stack-should-i-choose-regarding-connexthorify-and-web3-gear)
* [FAQ](#faq)
    * [Web3-Gear vs Thorify](#web3-gear-vs-thorify)
    * [How do I send VTHO token](#how-do-i-send-vtho-token)
    * [Multi party payment protocol or sponsored contract](#multi-party-payment-protocol-or-sponsored-contract)
    * [Method not supported](#method-not-supported)
    * [Subscriptions support](#subscriptions-support)
* [Notes](#notes)
* [Compatibility](#compatibility)
* [Debugging](#debugging)
* [License](#License)

## Install

``` bash
npm i thorify web3@1.* # Web3 is needed as dependency.
```

Furthermore, if you would like to change web3 version after installation, for example `1.6`, run `npm i web3@1.6 web3-core-subscriptions@1.6` as `subscriptions` is a peer dependency.

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
│   ├── subscribe
│   ├── clearSubscriptions
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
│       ├── events
│       ├── once
│       ├── events.myEvent
│       ├── events.allEvents
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

[API Reference](https://thorify.vecha.in/#/?id=api-reference)

## Play with multi-clause

1. [thor-devkit.js](https://github.com/vechain/thor-devkit.js) supports multi-clause and sign transaction
2. send signed transaction using [sendSignedTransaction](https://thorify.vecha.in/#/?id=send-signed-transaction)

## Which Stack Should I Choose Regarding Connex,Thorify And Web3-Gear

+ [Connex](https://github.com/vechain/connex#connex-): The standard interface to connect VeChain apps with VeChain blockchain and user.
+ [Web3-Gear](https://github.com/vechain/web3-gear#web3-gear): Proxy Thor's RESTful API to Eth's JSON-RPC, to support Remix, Truffle and more.

Below is an reference when you are planning your technical stack:

![tech-stack](https://raw.githubusercontent.com/vechain/thorify/master/tech-stack.png)

Here are some most common scenarios:

1. Develop a web application: `Connex` + [Connex powered VeChain wallets](https://env.vechain.org/)
2. Backend service in Node.js: `Thorify + Web3`
3. Contract development in [Truffle](https://truffleframework.com/): `Web3 + Web3-Gear`
4. Contract development in [Remix-IDE](https://remix.ethereum.org/): `Web3 + Web3-Gear`

## FAQ

### How do I send VTHO token

VTHO is a token that compatible with VIP180(ERC-20), you can build a contract instance using `web3` and do what ever you want.

+ [VTHO source code](https://github.com/vechain/thor/blob/master/builtin/gen/energy.sol)
+ Contract Address: `0x0000000000000000000000000000456E65726779`

### Multi party payment protocol or sponsored contract

It's done by calling the functions of prototype contract, check [wiki page](https://github.com/vechain/thor/wiki/Prototype(EN)) for detailed info about prototype contract.

### Method not supported

The RESTful API of Thor is different with Ethereum's JSON-RPC, therefore, there are some methods in web3 are not supported by thorify, feel free to open an issue discuss the features.

## Notes

- There are three special block number in Ethereum: `earliest`,`latest`,`pending`. In VeChain Thor, we introduced `best` block and there is no `pending` block, so they will be replaced with `0` (aka genesis), `best`, `best`

## Compatibility

Currently, `Thorify` is compatible with `web3@1.*`, tested versions are `1.2~1.7.1`.

## Debugging

```shell
DEBUG=thor:* ts-node index.ts 
```

`ts-node index.ts` can be replaced with command to run your code, this example is only for Node.js environment. For more detailed info, please refer to [debug](https://www.npmjs.com/package/debug).


## License

This project is licensed under the MIT license, Copyright (c) 2017 VeChain Foundation. For more information see [LICENSE.md](LICENSE.md).
