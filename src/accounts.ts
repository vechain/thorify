'use strict';

const Accounts = require('web3-eth-accounts');
const Tx = require('thorjs-tx');
const debug = require('debug')('thor:injector');
import utils from './utils';

type Callback = (err:Error|null, result?:any)=>void


const extendAccounts = function (web3: any): any {
  
  let proto = Object.getPrototypeOf(web3.eth.accounts);
  
  // signTransaction supoorts both callback and promise style
  proto.signTransaction = function signTransaction(tx: any, privateKey: any, callback: Callback) {

    // remove 
    if (tx.hasOwnproperty('gasPrice'))
      delete tx.gasPrice;
    if (tx.hasOwnproperty('from'))
      delete tx.gasPrice;

    let thorTx = Tx(tx);
    let rawTx = thorTx.serialize(utils.santizeHex(privateKey));
    let result = {
      rawTransaction: utils.toPrefixedHex(rawTx.toString('hex'))
    };
    
    if (callback) {
      return callback(null, result);
    }

    return Promise.resolve(result);


    // var _this = this,
    //   error = null,
    //   result;

    // callback = callback || function () { };

    // if (!tx) {
    //   error = new Error('No transaction object given!');

    //   callback(error);
    //   return Promise.reject(error);
    // }

    // function signed(tx) {

    //   if (!tx.gas && !tx.gasLimit) {
    //     error = new Error('"gas" is missing');
    //   }

    //   if (tx.nonce < 0 ||
    //     tx.gas < 0 ||
    //     tx.gasPrice < 0 ||
    //     tx.chainId < 0) {
    //     error = new Error('Gas, gasPrice, nonce or chainId is lower than 0');
    //   }

    //   if (error) {
    //     callback(error);
    //     return Promise.reject(new Error('"gas" is missing'));
    //   }

    //   try {
    //     tx = helpers.formatters.inputCallFormatter(tx);

    //     var transaction = tx;
    //     transaction.to = tx.to || '0x';
    //     transaction.data = tx.data || '0x';
    //     transaction.value = tx.value || '0x';
    //     transaction.chainId = utils.numberToHex(tx.chainId);

    //     var rlpEncoded = RLP.encode([
    //       Bytes.fromNat(transaction.nonce),
    //       Bytes.fromNat(transaction.gasPrice),
    //       Bytes.fromNat(transaction.gas),
    //       transaction.to.toLowerCase(),
    //       Bytes.fromNat(transaction.value),
    //       transaction.data,
    //       Bytes.fromNat(transaction.chainId || "0x1"),
    //       "0x",
    //       "0x"]);


    //     var hash = Hash.keccak256(rlpEncoded);

    //     var signature = Account.makeSigner(Nat.toNumber(transaction.chainId || "0x1") * 2 + 35)(Hash.keccak256(rlpEncoded), privateKey);

    //     var rawTx = RLP.decode(rlpEncoded).slice(0, 6).concat(Account.decodeSignature(signature));

    //     rawTx[6] = makeEven(trimLeadingZero(rawTx[6]));
    //     rawTx[7] = makeEven(trimLeadingZero(rawTx[7]));
    //     rawTx[8] = makeEven(trimLeadingZero(rawTx[8]));

    //     var rawTransaction = RLP.encode(rawTx);

    //     var values = RLP.decode(rawTransaction);
    //     result = {
    //       messageHash: hash,
    //       v: trimLeadingZero(values[6]),
    //       r: trimLeadingZero(values[7]),
    //       s: trimLeadingZero(values[8]),
    //       rawTransaction: rawTransaction
    //     };

    //   } catch (e) {
    //     callback(e);
    //     return Promise.reject(e);
    //   }

    //   callback(null, result);
    //   return result;
    // }

    // // Resolve immediately if nonce, chainId and price are provided
    // if (tx.nonce !== undefined && tx.chainId !== undefined && tx.gasPrice !== undefined) {
    //   return Promise.resolve(signed(tx));
    // }

    // // Resolve immediately if nonce, chainId and price are provided
    // if (tx.nonce !== undefined && tx.chainId !== undefined && tx.gasPrice !== undefined) {
    //   return Promise.resolve(signed(tx));
    // }


    // // Otherwise, get the missing info from the Ethereum Node
    // return Promise.all([
    //   isNot(tx.chainId) ? _this._ethereumCall.getId() : tx.chainId,
    //   isNot(tx.gasPrice) ? _this._ethereumCall.getGasPrice() : tx.gasPrice,
    //   isNot(tx.nonce) ? _this._ethereumCall.getTransactionCount(_this.privateKeyToAccount(privateKey).address) : tx.nonce
    // ]).then(function (args) {
    //   if (isNot(args[0]) || isNot(args[1]) || isNot(args[2])) {
    //     throw new Error('One of the values "chainId", "gasPrice", or "nonce" couldn\'t be fetched: ' + JSON.stringify(args));
    //   }
    //   return signed(_.extend(tx, { chainId: args[0], gasPrice: args[1], nonce: args[2] }));
    // });
  }

  return Accounts;
}


export default extendAccounts;