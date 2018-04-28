"use strict";
const debug = require("debug")("thor:injector");
import { IClause, IRawTransaction, ITransaction, StringOrNull, StringOrNumber } from "../types";
import utils from "../utils";
/* tslint:disable:max-line-length */

const extendFormatters = function(web3: any) {

  const maxUint8 = new web3.extend.utils.BN(2).pow(new web3.extend.utils.BN(8));
  const maxUint32 = new web3.extend.utils.BN(2).pow(new web3.extend.utils.BN(32));
  const maxUint64 = new web3.extend.utils.BN(2).pow(new web3.extend.utils.BN(64));

  const toUint8 = function(input: number | string): StringOrNull {
    if (typeof input !== "number" && !input) {
      return null;
    }
    return "0x" + web3.extend.utils.toBN(input).mod(maxUint8).toString(16);
  };

  const toUint64 = function(input: number | string): StringOrNull {
    if (typeof input !== "number" && !input) {
      return null;
    }
    return "0x" + web3.extend.utils.toBN(input).mod(maxUint64).toString(16);
  };

  const toUint32 = function(input: number | string): StringOrNull {
    if (typeof input !== "number" && !input) {
      return null;
    }
    return "0x" + web3.extend.utils.toBN(input).mod(maxUint32).toString(16);
  };

  const formatClauses = function(clauses: IClause[]): IClause[] | null {
    if (!web3.extend.utils._.isAddress(clauses)) {
      return null;
    }
    for (const clause of clauses) {
      if (clause.to) { // it might be contract creation
        clause.to = web3.extend.formatters.inputAddressFormatter(clause.to);
      }

      if (clause.data && !web3.extend.utils.isHex(clause.data)) {
        throw new Error("The data field must be HEX encoded data.");
      }

      clause.value = web3.extend.utils.numberToHex(clause.value);
    }
    return clauses;
  };

  web3.extend.formatters.outputTransactionFormatter = function(tx: ITransaction) {
    debug("outputTransactionFormatter");
    tx.gas = web3.extend.utils.hexToNumber(tx.gas);
    tx.chainTag = web3.extend.utils.numberToHex(tx.chainTag);

    if (tx.origin) {
      tx.origin = web3.extend.utils.toChecksumAddress(tx.origin);
    }

    for (const clause of tx.clauses) {
      clause.value = web3.extend.formatters.outputBigNumberFormatter(clause.value);
      if (clause.to && web3.extend.utils.isAddress(clause.to)) { // tx.to could be `0x0` or `null` while contract creation
        clause.to = web3.extend.utils.toChecksumAddress(clause.to);
      } else {
        clause.to = null; // set to `null` if invalid address
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

  web3.extend.formatters.inputTransactionFormatter = function(tx: ITransaction): IRawTransaction {
    const rawTx: IRawTransaction = {
      Clauses: [],
    };
    if (tx.chainTag === 0 || tx.chainTag) {
      const chainTag = toUint8(tx.chainTag);
      if (chainTag) {
        rawTx.ChainTag = chainTag;
      }
    }
    if (tx.blockRef === 0 || tx.blockRef) {
      const blockRef = toUint64(tx.blockRef);
      if (blockRef) {
        rawTx.BlockRef = blockRef;
      }
    }
    if (tx.expiration === 0 || tx.expiration) {
      const expiration = toUint32(tx.expiration);
      rawTx.Expiration = expiration || utils.defaultExpiration;
    } else {
      rawTx.Expiration = utils.defaultExpiration;
    }
    if (tx.gasPriceCoef === 0 || tx.gasPriceCoef) {
      const gasPriceCoef = toUint8(tx.gasPriceCoef);
      rawTx.GasPriceCoef = gasPriceCoef || utils.defaultGasPriceCoef;
    } else {
      rawTx.GasPriceCoef = utils.defaultGasPriceCoef;
    }
    if (tx.gas) {
      const gas = toUint64(tx.gas);
      if (gas) {
        rawTx.Gas = gas;
      }
    }
    if (tx.dependsOn) {
      if (web3.extend.utils.isHex(tx.dependsOn)) {
        rawTx.DependsOn = tx.dependsOn;
      }
    }
    if (tx.nonce) {
      const nonce = toUint64(tx.nonce);
      if (nonce) {
        rawTx.Nonce = nonce;
      }
    }
    // TODO: accept clauses
    const clause: IClause = {
      value: 0,
    };

    if (tx.to) { // it might be contract creation
      clause.to = web3.extend.formatters.inputAddressFormatter(tx.to);
    }

    if (tx.data) {
      if (!web3.extend.utils.isHex(tx.data)) {
        throw new Error("The data field must be HEX encoded data.");
      } else {
        rawTx.data = tx.data;
        clause.data = tx.data;
      }
    }

    const value = web3.extend.utils.numberToHex(tx.value);
    if (value) {
      clause.value = value;
    }
    rawTx.Clauses.push(clause);

    /* need to be compatible when sending tx in ethereum's format
      from: for sendTransaction method to recognize which account is sending transaction and load private-key from eth.account.wallet
      gasPrice: for sendTransaction method to ignore gasPrice
    */

    rawTx.from = tx.from;
    rawTx.gasPrice = 1;

    return rawTx;
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
