"use strict";
const debug = require("debug")("thor:injector");
import { IClause, IEthTransaction, IThorTransaction, StringOrNull, StringOrNumber } from "../types";
import * as utils from "../utils";
/* tslint:disable:max-line-length */

const extendFormatters = function(web3: any) {

  web3.extend.formatters.outputTransactionFormatter = function(tx: IThorTransaction) {
    debug("outputTransactionFormatter");
    tx.gas = web3.extend.utils.hexToNumber(tx.gas);
    tx.chainTag = web3.extend.utils.numberToHex(tx.chainTag);

    if (tx.origin) {
      tx.origin = web3.extend.utils.toChecksumAddress(tx.origin);
    }
    if (tx.clauses) {
      for (const clause of tx.clauses) {
        clause.value = web3.extend.formatters.outputBigNumberFormatter(clause.value);
        if (clause.to && web3.extend.utils.isAddress(clause.to)) { // tx.to could be `0x0` or `null` while contract creation
          clause.to = web3.extend.utils.toChecksumAddress(clause.to);
        } else {
          clause.to = null; // set to `null` if invalid address
        }
      }
    }
    return tx;
  };

  web3.extend.formatters.outputTransactionReceiptFormatter = function(receipt: any) {
    debug("outputTransactionReceiptFormatter");
    if (typeof receipt !== "object") {
      throw new Error("Received receipt is invalid: " + receipt);
    }

    if (receipt.hasOwnProperty("transactionIndex")) {
      delete receipt.transactionIndex;
    }
    if (receipt.hasOwnProperty("cumulativeGasUsed")) {
      delete receipt.cumulativeGasUsed;
    }

    receipt.gasUsed = web3.extend.utils.hexToNumber(receipt.gasUsed);

    if (receipt.gasPayer) {
      receipt.gasPayer = web3.extend.utils.toChecksumAddress(receipt.gasPayer);
    }
    if (receipt.tx.origin) {
      receipt.tx.origin = web3.extend.utils.toChecksumAddress(receipt.tx.origin);
    }

    for (const output of receipt.outputs) {
      if (web3.extend.utils._.isArray(output.logs)) {
        output.logs = output.logs.map(web3.extend.formatters.outputLogFormatter);
      }

      if (output.contractAddress) {
        output.contractAddress = web3.utils.toChecksumAddress(output.contractAddress);
      }
    }

    return receipt;
  };

  web3.extend.formatters.outputLogFormatter = function(log: any) {
    debug("outputLogFormatter");
    if (log.hasOwnProperty("transactionIndex:")) {
      delete log.transactionIndex;
    }
    if (log.hasOwnProperty("logIndex")) {
      delete log.logIndex;
    }
    if (log.hasOwnProperty("id")) {
      delete log.id;
    }

    if (log.blockNumber !== null) {
      log.blockNumber = web3.extend.utils.hexToNumber(log.blockNumber);
    }

    if (log.address) {
      log.address = web3.extend.utils.toChecksumAddress(log.address);
    }

    return log;
  };
};

export default extendFormatters;
