"use strict";

const blake = require("blakejs");
const elliptic = require("elliptic");
const EthLib = require("eth-lib/lib");
const BN = require("bn.js");
/* tslint:disable:max-line-length */
import { ILogQueryBody, ILogQueryOptions, ILogQueryRange, IRawTransaction, ITopicItem, ITopicSet, ITransaction, StringOrNumber, topicName } from "./types";

const MaxUint32 = Math.pow(2, 32) - 1;
const secp256k1 = new elliptic.ec("secp256k1");

// params from thor source code or vechain foundation's suggestion
const params = {
  defaultGasPriceCoef: 128,
  defaultExpiration: 720,
  TxGas: 5000,
  ClauseGas: 21000 - 5000,
  ClauseGasContractCreation: 53000 - 5000,
  TxDataZeroGas: 4,
  TxDataNonZeroGas: 68,
};

const isArray = function(o: any): boolean {
  return Object.prototype.toString.call(o) === "[object Array]";
};

const formatBlockNumber = function(blockNumber: StringOrNumber): StringOrNumber {
  if (typeof blockNumber === "number") {
    return blockNumber;
  } else if (typeof blockNumber === "string") {
    if (blockNumber === "earliest") {
      return 0;
    } else if (blockNumber === "latest" || blockNumber === "pending") {
      return "best";
         } else {
      return blockNumber;
         }
  } else {
    return "best";
  }
};

const formatRange = function(range: any): ILogQueryRange|null {
  const ret: ILogQueryRange = {};
  if (range.unit !== "block" && range.unit !== "time") {
    return null;
  } else {
    ret.unit = range.unit;
  }

  try {
    const from = formatBlockNumber(range.from);
    if (from !== "best") {
      ret.from = Number.parseInt(from as string);
    }
  } catch {
    ret.from = 0;
  }
  try {
    const to = formatBlockNumber(range.to);
    if (to !== "best") {
      ret.to = Number.parseInt(range.to);
    }
  } catch {
    ret.to = MaxUint32;
  }
  return ret;
};

const formatOptions = function(options: any): ILogQueryOptions|null {
  const ret: ILogQueryOptions = {};
  if (options.limit) {
    try {
      ret.limit = Number.parseInt(options.limit);
    } finally { }/* tslint:disable:no-empty */
  }
  if (options.offset) {
    try {
      ret.offset = Number.parseInt(options.offset);
    } finally { }/* tslint:disable:no-empty */
  }
  return ret;
};

const formatLogQuery = function(params: any): ILogQueryBody {
  const body: ILogQueryBody = {
    topicSets: [],
  };

  if (params.range) {
    const ret = formatRange(params.range);
    if (ret) {
      body.range = ret;
    }
  }

  if (params.options) {
    const ret = formatOptions(params.options);
    if (ret) {
      body.options = ret;
    }
  }

  if (!body.range) {
    if (params.fromBlock) {
      try {
        const from = formatBlockNumber(params.fromBlock);
        if (from !== "best") {
          body.range = body.range ? body.range : {};
          body.range.from = Number.parseInt(from as string);
        }
      } finally { }/* tslint:disable:no-empty */
    }
    if (params.toBlock) {
      try {
        const to = formatBlockNumber(params.toBlock);
        if (to !== "best") {
          body.range = body.range ? body.range : {};
          body.range.to = Number.parseInt(to as string);
        }
      } finally { }/* tslint:disable:no-empty */
    }
    if (body.range) {
      body.range.unit = "block";
    }
  }

  body.topicSets = [];
  const topics: ITopicItem[] = [];

  for (let i = 0; i < params.topics.length; i++) {
    if (typeof params.topics[i] === "string") {
      topics.push({
        name: "topic" as topicName + i,
        array: [params.topics[i]],
      });
    } else if (isArray(params.topics[i]) && params.topics[i].length) {
      topics.push({
        name: "topic" as topicName + i,
        array: params.topics[i],
      });
    }
  }

  const outputTopic = function(topics: ITopicItem[], index: number, receiver: ITopicSet[], current: ITopicSet) {
    if (index === topics.length) {
      const o = {};
      Object.assign(o, current);
      receiver.push(o);
      return;
    }
    for (const item of topics[index].array) {
      current[topics[index].name as topicName] = item;
      outputTopic(topics, index + 1, receiver, current);
    }
  };

  if (topics.length) {
    outputTopic(topics, 0, body.topicSets, {});
  }

  return body;
};

const toPrefixedHex = function(hexStr: string): string {
  if (hexStr.indexOf("0x") === 0) {
    return hexStr;
  } else {
    return "0x" + hexStr;
  }
};

const sanitizeHex = function(hexStr: string): string {
  if (hexStr.indexOf("0x") === 0) {
    return hexStr.substr(2);
  } else {
    return hexStr;
  }
};

const isHex = function(hex: string): boolean {
  return ((typeof hex === "string") && /^(-0x|0x)?[0-9a-f]*$/i.test(hex));
};

const checkRawTx = function(tx: IRawTransaction): void {
  if (!tx.Nonce) {
    throw new Error("Nonce is need for transaction");
  }
};

const hash = function(input: string | Buffer): string {
  return "0x" + blake.blake2bHex(input, null, 32);
};

const sign = function(hash: Buffer, privateKey: Buffer): string {
  const signature = secp256k1.keyFromPrivate(privateKey).sign(hash, { canonical: true });
  return "0x" + Buffer.concat([signature.r.toBuffer(), signature.s.toBuffer(), Buffer.from([signature.recoveryParam])]).toString("hex"); /* tslint:disable:max-line-length */
};

const ECRecover = function(hash: Buffer, sig: Buffer): string {
  const recovery = sig[64];
  const signature = {
    r: sig.slice(0, 32),
    s: sig.slice(32, 64),
  };

  const ecPublicKey = secp256k1.recoverPubKey(hash, signature, recovery);
  const publicKey = "0x" + ecPublicKey.encode("hex", false).slice(2);
  const publicHash = EthLib.hash.keccak256(publicKey);
  const address = EthLib.account.toChecksum("0x" + publicHash.slice(-40));
  return address;
};

const calcIntrinsicGas = function(tx: ITransaction): number {
  if (!tx.to && (!tx.data || !sanitizeHex(tx.data))) {
    return params.TxGas + params.ClauseGas;
  }

  let totalGas = params.TxGas;

  // calculate data gas
  if (tx.data) {
    const buffer = new Buffer(sanitizeHex(tx.data), "hex");
    let z = 0;
    let nz = 0;
    for (const byte of buffer) {
      if (byte) {
        nz++;
      } else {
        z++;
      }
    }
    totalGas += params.TxDataZeroGas * z;
    totalGas += params.TxDataNonZeroGas * nz;
  }

  if (!!tx.to) {
    totalGas += params.ClauseGas;
  } else {
    totalGas += params.ClauseGasContractCreation;
  }

  return totalGas;
};

export default {
  formatBlockNumber,
  formatLogQuery,
  isArray,
  toPrefixedHex,
  sanitizeHex,
  isHex,
  params,
  checkRawTx,
  hash,
  ECRecover,
  sign,
  calcIntrinsicGas,
};
