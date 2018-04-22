'use strict';
const debug = require('debug')('thor:injector');
import utils from './utils';
import extendAccounts from './accounts';



type StringorNull = string | null;
type StringorNumber = string | number;
interface RawTransaction {
  ChainTag?: StringorNumber;
  BlockRef?: StringorNumber;
  Expiration?: StringorNumber;
  GasPriceCoef?: StringorNumber;
  Gas?: StringorNumber;
  DependsOn?: string;
  Nonce?: StringorNumber;
  Signature?: string;
  Clauses: Array<Clause>;
  from?: string;
  gasPrice?: StringorNumber;
}

interface Clause{
  to?: StringorNull;
  value: StringorNumber;
  data?: string;
}

interface Transaction {
  chainTag?: StringorNumber;
  blockRef?: StringorNumber;
  expiration?: StringorNumber;
  gasPriceCoef?: StringorNumber;
  gas?: StringorNumber;
  dependsOn?: string;
  nonce?: StringorNumber;
  origin: string;
  clauses: Array<Clause>;
  // for competibale with web3, add from, to, value
  to?: string;
  from?: string;
  value?: number;
  data?: string;
}

const extendFormatters = function (web3: any) {

  const maxUint8 = new web3.extend.utils.BN(2).pow(new web3.extend.utils.BN(8));
  const maxUint32 = new web3.extend.utils.BN(2).pow(new web3.extend.utils.BN(32));
  const maxUint64 = new web3.extend.utils.BN(2).pow(new web3.extend.utils.BN(64));

  const toUint8 = function (input: number | string): StringorNull {
    if (!input) {
      return null;
    }else if (typeof input === 'number') {
      return new web3.extend.utils.BN(input).mod(maxUint8).toString(10);
    }else if (utils.isHex(input)) {
      return new web3.extend.utils.BN(utils.santizeHex(input), 16).mod(maxUint8).toString(10);
    } else {
      return new web3.extend.utils.BN(input).mod(maxUint8).toString(10);
    }
  }

  const toUint64 = function (input: number | string): StringorNull {
    if (!input) {
      return null;
    } else if (typeof input === 'number') {
      return new web3.extend.utils.BN(input).mod(maxUint64).toString(10);
    } else if (utils.isHex(input)) {
      return new web3.extend.utils.BN(utils.santizeHex(input), 16).mod(maxUint64).toString(10);
    } else {
      return new web3.extend.utils.BN(input).mod(maxUint64).toString(10);
    }
  }

  const toUint32 = function (input: number | string): StringorNull {
    if (!input) {
      return null;
    } else if (typeof input === 'number') {
      return new web3.extend.utils.BN(input).mod(maxUint32).toString(10);
    } else if (utils.isHex(input)) {
      return new web3.extend.utils.BN(utils.santizeHex(input), 16).mod(maxUint32).toString(10);
    } else {
      return new web3.extend.utils.BN(input).mod(maxUint32).toString(10);
    }
  }

  const formatCluases = function (clauses: Array<Clause>): Array<Clause> | null {
    if (!web3.extend.utils._.isAddress(clauses))
      return null;  
    for (let clause of clauses) {
      if (clause.to) { // it might be contract creation
        clause.to = web3.extend.formatters.inputAddressFormatter(clause.to);
      }

      if (clause.data && !web3.extend.utils.isHex(clause.data)) {
        throw new Error('The data field must be HEX encoded data.');
      }

      clause.value = web3.extend.utils.numberToHex(clause.value)
    }
    return clauses;
  }

  web3.extend.formatters.outputTransactionFormatter = function (tx: Transaction) {
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
      if (web3.extend.utils._.isArray(output.logs)) {
        output.logs = output.logs.map(web3.extend.formatters.outputLogFormatter);
      }

      if (output.contractAddress) {
        output.contractAddress = web3.utils.toChecksumAddress(output.contractAddress);
      }
    }

    return receipt;
  }

  web3.extend.formatters.inputTransactionFormatter = function (tx: Transaction): RawTransaction{
    let rawTx: RawTransaction = {
      Clauses:[]
    };
    if (tx.chainTag === 0||tx.chainTag) {
      let chainTag = toUint8(tx.chainTag);
      if (chainTag) {
        rawTx.ChainTag = chainTag;
      }
    }
    if (tx.blockRef===0||tx.blockRef) {
      let blockRef = toUint64(tx.blockRef);
      if (blockRef) {
        rawTx.BlockRef = blockRef;
      }
    }
    // TODO:default value
    if (tx.expiration===0||tx.expiration) {
      let expiration = toUint32(tx.expiration);
      if (expiration) {
        rawTx.Expiration = expiration;
      }
    }
    // TODO:default value
    if (tx.gasPriceCoef === 0||tx.gasPriceCoef) {
      let gasPriceCoef = toUint8(tx.gasPriceCoef);
      if (gasPriceCoef) {
        rawTx.GasPriceCoef = gasPriceCoef;
      }
    }
    if (tx.gas) {
      let gas = toUint64(tx.gas);
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
      let nonce = toUint64(tx.nonce);
      if (nonce) {
        rawTx.Nonce = nonce;
      }
    }
    if (tx.clauses) {
      let clauses = formatCluases(tx.clauses);
      if (clauses) {
        rawTx.Clauses = clauses;
      }
    } else {
      let clause: Clause = {
        value: 0
      };

      if (tx.to) { // it might be contract creation
        clause.to = web3.extend.formatters.inputAddressFormatter(tx.to);
      }

      if (tx.data && !web3.extend.utils.isHex(tx.data)) {
        throw new Error('The data field must be HEX encoded data.');
      }

      clause.value = web3.extend.utils.numberToHex(tx.value)
      rawTx.Clauses.push(clause);
    }
    /* need to be competible when sending tx in ethereum's format
      from: for sendTransaction method to recognize which account is sending tranaction and load privatekey from eth.account.wallet
      gasPrice: for sendTransaction method to ignore gasPrice
      TODO: new Contract and get receipt
    */

    rawTx.from = tx.from;
    rawTx.gasPrice = 1;

    return rawTx;
  }

  web3.extend.formatters.outputLogFormatter = function (log: any) {
    debug('outputLogFormatter');
    if (log.hasOwnProperty('transactionIndex:'))
      delete log.transactionIndex;
    if (log.hasOwnProperty('logIndex'))
      delete log.logIndex;
    if (log.hasOwnProperty('id'))
      delete log.id;

    if (log.blockNumber !== null)
      log.blockNumber = web3.extend. utils.hexToNumber(log.blockNumber);

    if (log.address) {
      log.address = web3.extend.utils.toChecksumAddress(log.address);
    }

    return log;
  };
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
      }),
      new web3.extend.Method({
        name: 'sendTransaction',
        call: 'eth_sendTransaction',
        accounts: web3.eth.accounts,
        params: 1,
        inputFormatter: [web3.extend.formatters.inputTransactionFormatter]
      })
    ]
  })
}

const extendContracts = function (web3: any) { 
  let _encodeEventABI = web3.eth.Contract.prototype._encodeEventABI;
  web3.eth.Contract.prototype._encodeEventABI = function (event: any, options: any): any {
    debug('_encodeEventABI');
    let result = _encodeEventABI.call(this, event, options);
    if (options.options)
      result.options = options.options;
    if (options.range)
      result.range = options.range;
    if (options.order)
      result.order = options.order;
    return result;
  }
}

const extend = function (web3: any) {
  extendAccounts(web3);
  extendFormatters(web3);
  extendMethods(web3);
  extendContracts(web3);
}

export default extend;

/*

Accout
  'signTransaction',

  'create',
  'recoverTransaction',
  'hashMessage',
  'sign',
  'recover',


  _addAccountFunctions',
  
  'privateKeyToAccount',

  'decrypt',
  'encrypt'
Wallet 
  'create',
  'add',
  'remove',
  'clear',
  'encrypt',
  'decrypt
 */