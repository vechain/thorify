"use strict";

const Tx = require("thorjs-tx");
const debug = require("debug")("thor:injector");
const EthLib = require("eth-lib/lib");
import { Callback, IClause, IRawTransaction, ITransaction, StringOrNull, StringOrNumber } from "../types";
import utils from "../utils";

const extendAccounts = function(web3: any): any {

  const proto = Object.getPrototypeOf(web3.eth.accounts);

  // signTransaction supports both callback and promise style
  proto.signTransaction = function signTransaction(tx: IRawTransaction, privateKey: any, callback: Callback) {
    debug("tx to sign: %O", tx);
    utils.checkRawTx(tx);
    // remove properties for compatible with ethereum
    if (tx.hasOwnProperty("gasPrice")) {
      delete tx.gasPrice;
    }
    if (tx.hasOwnProperty("from")) {
      delete tx.from;
    }
    if (tx.hasOwnProperty("to")) {
      delete tx.to;
    }

    const sign = async function(tx: IRawTransaction) {
      if (!tx.ChainTag) {
        const chainTag = await web3.eth.getChainTag();
        if (chainTag) {
          tx.ChainTag = chainTag;
        } else {
          throw new Error("error getting chainTag");
        }
      }
      if (!tx.BlockRef) {
        const blockRef = await web3.eth.getBlockRef();
        if (blockRef) {
          tx.BlockRef = blockRef;
        } else {
          throw new Error("error getting blockRef");
        }
      }
      if (!tx.Gas) {
        const gas = await web3.eth.estimateGas({
          from: EthLib.account.fromPrivate(utils.toPrefixedHex(privateKey)).address,
          to: tx.Clauses[0].to,
          value: tx.Clauses[0].value,
          data: tx.Clauses[0].data,
        });
        if (gas) {
          tx.Gas = gas;
        } else {
          throw new Error("error getting gas");
        }
      }
      debug(tx);
      const thorTx = Tx(tx);
      thorTx.sign(utils.sanitizeHex(privateKey));
      const rawTx = thorTx.serialize();
      const result = {
        rawTransaction: utils.toPrefixedHex(rawTx.toString("hex")),
        tx,
      };

      return result;
    };

    // for supporting both callback and promise
    if (callback instanceof Function) {
      sign(tx).then((ret) => {
        return callback(null, ret);
      }).catch((e) => {
        return callback(e);
      });
    } else {
      return sign(tx);
    }
  };

  proto.recoverTransaction = function recoverTransaction(encodedRawTx: string) {
    const values = EthLib.RLP.decode(encodedRawTx);

    const signingDataHex = EthLib.RLP.encode(values.slice(0, 9));
    const signingHash = utils.hash(Buffer.from(utils.sanitizeHex(signingDataHex), "hex"));
    const signature = values[9];

    const singingHashBuffer = Buffer.from(utils.sanitizeHex(signingHash), "hex");
    const signatureBuffer = Buffer.from(utils.sanitizeHex(signature), "hex");
    const address = utils.ECRecover(singingHashBuffer, signatureBuffer);

    return address;
  };

  proto.hashMessage = function hashMessage(data: string | Buffer) {
    const message = web3.extend.utils.isHexStrict(data) ? web3.extend.utils.hexToBytes(data) : data;
    const messageBuffer = Buffer.from(message);

    return utils.hash(messageBuffer);
  };

  proto.sign = function sign(data: string|Buffer, privateKey: string) {
    const hash = this.hashMessage(data);
    const hashBuffer = Buffer.from(utils.sanitizeHex(hash), "hex");
    const privateKeyBuffer = Buffer.from(utils.sanitizeHex(privateKey), "hex");
    const signature = utils.sign(hashBuffer, privateKeyBuffer);

    return {
      message: data,
      messageHash: utils.toPrefixedHex(hash),
      signature: utils.toPrefixedHex(signature),
    };
  };

  proto.recover = function recover(message: any, signature: string, preFixed: boolean) {
    const args = [].slice.apply(arguments);

    if (web3.extend.utils._.isObject(message)) {
      return this.recover(message.messageHash, message.signature, true);
    }

    if (!preFixed) {
      message = this.hashMessage(message);
    }

    const hexBuffer = Buffer.from(utils.sanitizeHex(message), "hex");
    const signatureBuffer = Buffer.from(utils.sanitizeHex(signature), "hex");
    return utils.ECRecover(hexBuffer, signatureBuffer);
  };

};

export default extendAccounts;
