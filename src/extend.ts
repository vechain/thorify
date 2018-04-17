'use strict';

import _ = require('lodash'); 
const debug = require('debug')('thor:injector')

const extendFormatters = function (web3: any) {
  web3.extend.formatters.outputTransactionFormatter = function (tx: any) {
    debug('outputTransactionFormatter')
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

  web3.extend.formatters.outputTransactionReceiptFormatter = function (receipt: any) {
    debug('outputTransactionReceiptFormatter')
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

    for (let output of receipt.outputs) {
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

const extendMethods = function (web3: any) {
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
        outputFormatter: web3.extend.formatters.outputTransactionFormatter
      }),
      new web3.extend.Method({
        name: 'getTransactionReceipt',
        call: 'eth_getTransactionReceipt',
        params: 1,
        inputFormatter: [null],
        outputFormatter: web3.extend.formatters.outputTransactionReceiptFormatter
      })
    ]
  })
}

const extendContracts = function (web3: any) { 
  let _encodeEventABI = web3.eth.Contract.prototype._encodeEventABI;
  web3.eth.Contract.prototype._encodeEventABI = function (event:any, options:any):any {
    let result = _encodeEventABI.call(this, event, options);
    if(result.options)
      result.options = options.options;
    if (result.range)
      result.range = options.range;
    if (result.order)
      result.order = options.order;
    return result;
  }
}

const extend = function (web3: any) {
  extendFormatters(web3);
  extendMethods(web3);
  extendContracts(web3);
}

export default extend;