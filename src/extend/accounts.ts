'use strict';

const Tx = require('thorjs-tx');
const debug = require('debug')('thor:injector');
import utils from '../utils';
import { StringorNull, StringorNumber, RawTransaction, Clause, Transaction, Callback } from '../types';

const extendAccounts = function (web3: any): any {
  
  let proto = Object.getPrototypeOf(web3.eth.accounts);
  
  // signTransaction supoorts both callback and promise style
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
      let rawTx = thorTx.serialize(utils.santizeHex(privateKey));
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

}


export default extendAccounts;