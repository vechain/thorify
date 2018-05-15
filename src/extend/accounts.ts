"use strict";

const Tx = require("thorjs-tx");
const debug = require("debug")("thor:injector");
const EthLib = require("eth-lib/lib");
import { Callback, IClause, IEthTransaction, IThorTransaction, StringOrNull, StringOrNumber } from "../types";
import * as utils from "../utils";

const extendAccounts = function(web3: any): any {

  const proto = Object.getPrototypeOf(web3.eth.accounts);

  // signTransaction supports both callback and promise style
  proto.signTransaction = function signTransaction(tx: IEthTransaction, privateKey: string, callback: Callback) {
    debug("tx to sign: %O", tx);

    const thorTx = utils.ethToThorTx(tx);

    const sign = async function(tx: IThorTransaction) {
      if (!tx.chainTag) {
        const chainTag = await web3.eth.getChainTag();
        if (chainTag) {
          tx.chainTag = chainTag;
        } else {
          throw new Error("error getting chainTag");
        }
      }
      if (!tx.blockRef) {
        const blockRef = await web3.eth.getBlockRef();
        if (blockRef) {
          tx.blockRef = blockRef;
        } else {
          throw new Error("error getting blockRef");
        }
      }
      if (!tx.gas) {
        const gas = await web3.eth.estimateGas({
          from: EthLib.account.fromPrivate(utils.toPrefixedHex(privateKey)).address,
          to: tx.clauses.length ? tx.clauses[0].to : "",
          value: tx.clauses.length ? tx.clauses[0].value : 0,
          data: tx.clauses.length ? tx.clauses[0].data : "0x",
        });
        if (gas) {
          tx.gas = gas;
        } else {
          throw new Error("error getting gas");
        }
      }
      if (!tx.nonce) {
        tx.nonce = utils.newNonce();
      }
      debug(tx);
      const thorTx = Tx({
        ChainTag: tx.chainTag,
        BlockRef: tx.blockRef,
        Expiration: tx.expiration,
        Clauses: tx.clauses,
        GasPriceCoef: tx.gasPriceCoef,
        Gas: tx.gas,
        DependsOn: tx.dependsOn,
        Nonce: tx.nonce,
      });
      thorTx.sign(utils.sanitizeHex(privateKey));
      const rawTx = thorTx.serialize();
      const result = {
        rawTransaction: utils.toPrefixedHex(rawTx.toString("hex")),
        messageHash: utils.toPrefixedHex(thorTx.signatureHash()),
      };

      return result;
    };

    // for supporting both callback and promise
    if (callback instanceof Function) {
      sign(thorTx).then((ret) => {
        return callback(null, ret);
      }).catch((e) => {
        return callback(e);
      });
    } else {
      return sign(thorTx);
    }
  };

  proto.recoverTransaction = function recoverTransaction(encodedRawTx: string) {
    const values = EthLib.RLP.decode(encodedRawTx);

    const signingDataHex = EthLib.RLP.encode(values.slice(0, 9));
    const signingHash = utils.hash(Buffer.from(utils.sanitizeHex(signingDataHex), "hex"));
    const signature = values[9];

    const singingHashBuffer = Buffer.from(utils.sanitizeHex(signingHash), "hex");
    const signatureBuffer = Buffer.from(utils.sanitizeHex(signature), "hex");
    const address = utils.recover(singingHashBuffer, signatureBuffer);

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
    return utils.recover(hexBuffer, signatureBuffer);
  };

};

export default extendAccounts;
