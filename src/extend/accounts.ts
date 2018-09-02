"use strict";

const web3Utils = require("web3-utils");
const debug = require("debug")("thor:injector");
const EthLib = require("eth-lib/lib");
import { cry, Transaction } from "thor-devkit";
import { Callback, EthTransaction } from "../types";
import * as utils from "../utils";

const extendAccounts = function(web3: any): any {

  // signTransaction supports both callback and promise style
  // tslint:disable-next-line:max-line-length
  web3.eth.accounts.signTransaction = function signTransaction(tx: EthTransaction, privateKey: string, callback: Callback) {
    debug("tx to sign: %O", tx);

    const sign = async function(tx: EthTransaction) {
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

      const clause: Transaction.Clause = {
        value: tx.value || 0,
        to: tx.to || null,
        data: "0x",
      };

      if (tx.data) {
        if (!utils.isHex(tx.data)) {
          throw new Error("The data field must be HEX encoded data.");
        } else {
          clause.data = utils.sanitizeHex(tx.data);
        }
      }

      const body: Transaction.Body = {
        chainTag: utils.validNumberOrDefault(tx.chainTag, 0),
        blockRef: tx.blockRef as string,
        gas: tx.gas as number,
        expiration: utils.validNumberOrDefault(tx.expiration, utils.params.defaultExpiration),
        gasPriceCoef: utils.validNumberOrDefault(tx.gasPriceCoef, utils.params.defaultGasPriceCoef),
        dependsOn: !tx.dependsOn ? null : tx.dependsOn,
        nonce: typeof tx.nonce === "string" ? utils.toPrefixedHex(tx.nonce) : tx.nonce,
        clauses: [clause],
      };

      debug("body: %O", body);

      const ThorTx = new Transaction(body);
      const priKey = Buffer.from(utils.sanitizeHex(privateKey), "hex");
      const signingHash = cry.blake2b256(ThorTx.encode());
      ThorTx.signature = cry.secp256k1.sign(signingHash, priKey);

      const result = {
        rawTransaction: utils.toPrefixedHex(ThorTx.encode().toString("hex")),
        messageHash: signingHash,
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

  web3.eth.accounts.recoverTransaction = function recoverTransaction(encodedRawTx: string) {
    const values = EthLib.RLP.decode(encodedRawTx);

    const signingDataHex = EthLib.RLP.encode(values.slice(0, 9));
    const singingHashBuffer = cry.blake2b256(Buffer.from(utils.sanitizeHex(signingDataHex), "hex"));
    const signature = values[9];

    const signatureBuffer = Buffer.from(utils.sanitizeHex(signature), "hex");
    const pubKey = cry.secp256k1.recover(singingHashBuffer, signatureBuffer);
    const address = cry.publicKeyToAddress(pubKey);

    return utils.toPrefixedHex(address.toString("hex"));
  };

  web3.eth.accounts.hashMessage = function hashMessage(data: string | Buffer) {
    const message = web3Utils.isHexStrict(data) ? web3Utils.hexToBytes(data) : data;
    const messageBuffer = Buffer.from(message);

    return utils.toPrefixedHex(cry.blake2b256(messageBuffer).toString("hex"));
  };

  web3.eth.accounts.sign = function sign(data: string|Buffer, privateKey: string) {
    const hash = this.hashMessage(data);
    const hashBuffer = Buffer.from(utils.sanitizeHex(hash), "hex");
    const privateKeyBuffer = Buffer.from(utils.sanitizeHex(privateKey), "hex");
    const signature = cry.secp256k1.sign(hashBuffer, privateKeyBuffer).toString("hex");

    return {
      message: data,
      messageHash: utils.toPrefixedHex(hash),
      signature: utils.toPrefixedHex(signature),
    };
  };

  web3.eth.accounts.recover = function recover(message: any, signature: string, preFixed: boolean) {
    const args = [].slice.apply(arguments);

    if (utils.isObject(message)) {
      return this.recover(message.messageHash, message.signature, true);
    }

    if (!preFixed) {
      message = this.hashMessage(message);
    }

    const hexBuffer = Buffer.from(utils.sanitizeHex(message), "hex");
    const signatureBuffer = Buffer.from(utils.sanitizeHex(signature), "hex");
    const pubKey = cry.secp256k1.recover(hexBuffer, signatureBuffer);
    const address = cry.publicKeyToAddress(pubKey);

    return utils.toPrefixedHex(address.toString("hex"));
  };

};

export {
  extendAccounts,
};
