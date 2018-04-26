'use strict';

const Tx = require('thorjs-tx');
const debug = require('debug')('thor:injector');
const EthLib = require("eth-lib/lib");
import utils from '../utils';
import { StringOrNull, StringOrNumber, RawTransaction, Clause, Transaction, Callback } from '../types';

const extendAccounts = function (web3: any): any {
  
  let proto = Object.getPrototypeOf(web3.eth.accounts);
  
  // signTransaction supports both callback and promise style
  proto.signTransaction = function signTransaction(tx: RawTransaction, privateKey: any, callback: Callback) {
    debug('tx to sign: %O', tx);
    utils.checkRawTx(tx);
    // remove 
    if (tx.hasOwnProperty('gasPrice'))
      delete tx.gasPrice;
    if (tx.hasOwnProperty('from'))
      delete tx.gasPrice;
    
    let sign = async function (tx: RawTransaction) {
      if (!tx.ChainTag) {
        let chainTag = await web3.eth.getChainTag();
        if (chainTag) {
          tx.ChainTag = chainTag;
        } else {
          throw new Error('error getting chainTag');
        }
      }
      if (!tx.BlockRef) {
        let blockRef = await web3.eth.getBlockRef();
        if (blockRef) {
          tx.BlockRef = blockRef;
        } else {
          throw new Error('error getting blockRef');
        }
      }
      debug(tx);
      let thorTx = Tx(tx);
      let rawTx = thorTx.serialize(utils.sanitizeHex(privateKey));
      let result = {
        rawTransaction: utils.toPrefixedHex(rawTx.toString('hex'))
      };

      return result;
    }

    // for supporting both callback and promise
    if (callback instanceof Function) {
      sign(tx).then(ret => {
        return callback(null, ret);
      }).catch(e => {
        return callback(e);
      })
    } else {
      return sign(tx);
    }
  }

  proto.recoverTransaction = function recoverTransaction(encodedRawTx:string) {
    let values = EthLib.RLP.decode(encodedRawTx);

    let signingDataHex = EthLib.RLP.encode(values.slice(0, 9));
    let signingHash = utils.hash(Buffer.from(utils.sanitizeHex(signingDataHex), 'hex'));
    let signature = values[9];

    let address = utils.ECRecover(Buffer.from(utils.sanitizeHex(signingHash), 'hex'), Buffer.from(utils.sanitizeHex(signature), 'hex'))

    return address;
  };

  proto.hashMessage = function hashMessage(data: string | Buffer) {
    var message = web3.extend.utils.isHexStrict(data) ? web3.extend.utils.hexToBytes(data) : data;
    var messageBuffer = Buffer.from(message);

    return utils.hash(messageBuffer);
  };
  
  proto.sign = function sign(data:string|Buffer, privateKey:string) {
    let hash = this.hashMessage(data);
    let signature = utils.sign(Buffer.from(utils.sanitizeHex(hash), 'hex'), Buffer.from(utils.sanitizeHex(privateKey), 'hex'));

    return {
      message: data,
      messageHash: utils.toPrefixedHex(hash),
      signature: utils.toPrefixedHex(signature)
    };
  };

  proto.recover = function recover(message: any, signature: string, preFixed: boolean) {
    var args = [].slice.apply(arguments);


    if (web3.extend.utils._.isObject(message)) {
      return this.recover(message.messageHash, message.signature, true);
    }

    if (!preFixed) {
      message = this.hashMessage(message);
    }


    return utils.ECRecover(Buffer.from(utils.sanitizeHex(message), 'hex'), Buffer.from(utils.sanitizeHex(signature), 'hex'));
  }

}

export default extendAccounts;