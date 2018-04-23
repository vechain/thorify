'use strict';

const Tx = require('thorjs-tx');
const debug = require('debug')('thor:injector');
import utils from './utils';
import { StringorNull, StringorNumber, RawTransaction, Clause, Transaction, Callback } from './types';
import { resolve } from 'url';




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
    
    return Promise.all([
      new Promise((resolve, reject) => {
        if (tx.ChainTag) {
          return Promise.resolve(tx.ChainTag);
        } else {
          web3.eth.getChainTag().then(function (chainTag: string) {
            console.log('get chain tag');
            return resolve(web3.extend.utils.toBN(chainTag).toString(10));
          })
        }
      }),
      new Promise((resolve, reject) => {
        if (tx.BlockRef) {
          return Promise.resolve(tx.BlockRef);
        } else {
          web3.eth.getBlockRef().then(function (blockRef: string) {
            console.log('get blockref');
            return resolve(web3.extend.utils.toBN(blockRef).toString(10));
          })
        }
      })
    ]).then((ret: any) => {
      tx.ChainTag = <string>ret[0];
      tx.BlockRef = <string>ret[1];
      
      let thorTx = Tx(tx);
      let rawTx = thorTx.serialize(utils.santizeHex(privateKey));
      let result = {
        rawTransaction: utils.toPrefixedHex(rawTx.toString('hex'))
      };

      if (callback) {
        callback(null, result);
      }

      return result;
    }).catch((e) => {
      return Promise.reject(e);
    });
  }

}


export default extendAccounts;