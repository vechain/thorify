'use strict';

import _ = require('lodash'); 

const outputTransactionFormatter = function (web3: any) {
  return function (tx: any) {
    tx.gas = web3.extend.utils.hexToNumber(tx.gas);
    tx.chainTag = web3.extend.utils.numberToHex(tx.chainTag)

    if (tx.origin) {
      tx.origin = web3.extend.utils.toChecksumAddress(tx.origin);
    }

    for (let clause of tx.clauses) {
      clause.value = web3.extend.formatters.outputBigNumberFormatter(clause.value);
      if (clause.to && web3.extend.utils.isAddress(clause.to)) { // tx.to could be `0x0` or `null` while contract creation
        clause.to = web3.extend.utils.toChecksumAddress(clause.to);
      } else {
          clause.to = null; // set to `null` if invalid address
      }
    }

    return tx; 
  }
}

var outputTransactionReceiptFormatter = function (web3: any) {
  return function (receipt: any) {
    if (typeof receipt !== 'object') {
      throw new Error('Received receipt is invalid: ' + receipt);
    }

    if (receipt.hasOwnProperty('transactionIndex'))
      delete receipt.transactionIndex
    if (receipt.hasOwnProperty('cumulativeGasUsed'))
      delete receipt.cumulativeGasUsed

    receipt.gasUsed = web3.extend.utils.hexToNumber(receipt.gasUsed);

    if (receipt.gasPayer) {
      receipt.gasPayer = web3.extend.utils.toChecksumAddress(receipt.gasPayer);
    }
    if (receipt.tx.origin) {
      receipt.tx.origin = web3.extend.utils.toChecksumAddress(receipt.tx.origin);
    }

    for (let output of receipt.outputs){
      if (_.isArray(output.logs)) {
        output.logs = output.logs.map(web3.extend.formatters.outputLogFormatter);
      }

      if (output.contractAddress) {
        output.contractAddress = web3.utils.toChecksumAddress(output.contractAddress);
      }
    }

    return receipt;
  }  
};

const extend = function (web3: any) {
  web3.extend({
    property: 'eth',
    methods: [
      new web3.extend.Method({
        name: 'getEnergy',
        call: 'eth_getEnergy',
        params: 2,
        inputFormatter: [web3.extend.utils.toAddress, web3.extend.formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: web3.extend.formatters.outputBigNumberFormatter
      }),
      new web3.extend.Method({
        name: 'getTransaction',
        call: 'eth_getTransactionByHash',
        params: 1,
        inputFormatter: [null],
        outputFormatter: outputTransactionFormatter(web3)
      }),
      new web3.extend.Method({
        name: 'getTransactionReceipt',
        call: 'eth_getTransactionReceipt',
        params: 1,
        inputFormatter: [null],
        outputFormatter: outputTransactionReceiptFormatter(web3)
      })
    ]
  })

}

export default extend;