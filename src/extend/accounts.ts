"use strict";

const web3Utils = require("web3-utils");
const debug = require("debug")("thor:injector");
const EthLib = require("eth-lib/lib");
import { Bytes32, Secp256k1 } from "thor-model-kit";
import { Callback, IClause, IEthTransaction } from "../types";
import * as utils from "../utils";

const extendAccounts = function(web3: any): any {

  const proto = Object.getPrototypeOf(web3.eth.accounts);

  // signTransaction supports both callback and promise style
  proto.signTransaction = function signTransaction(tx: IEthTransaction, privateKey: string, callback: Callback) {
    debug("tx to sign: %O", tx);

    const sign = async function(tx: IEthTransaction) {
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
          to: tx.to ? tx.to : "",
          value: tx.value ? tx.value  : 0,
          data: utils.isHex(tx.data as string) ? tx.data : "0x",
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

      const thorTx = utils.ethToThorTx(tx);
      const priKey = new Bytes32(Buffer.from(utils.sanitizeHex(privateKey), "hex"));

      thorTx.signature = Secp256k1.sign(thorTx.signingHash, priKey);

      const rawTx = thorTx.encode();
      const result = {
        rawTransaction: utils.toPrefixedHex(rawTx.toString("hex")),
        messageHash: thorTx.signingHash.toString("0x"),
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
    const address = utils.recover(singingHashBuffer, signatureBuffer);

    return address;
  };

  proto.hashMessage = function hashMessage(data: string | Buffer) {
    const message = web3Utils.isHexStrict(data) ? web3Utils.hexToBytes(data) : data;
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

    if (web3Utils._.isObject(message)) {
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

export {
  extendAccounts,
};
