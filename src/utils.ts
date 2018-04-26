'use strict';

const blake = require('blakejs');
const elliptic = require('elliptic');
const EthLib = require("eth-lib/lib");
import { RawTransaction } from "./types";

const MaxUint32 = Math.pow(2, 32) - 1;
const secp256k1 = new elliptic.ec("secp256k1");

type topicName = 'topic0' | 'topic1' | 'topic2' | 'topic3' | 'topic4';
interface topicItem{
  name: string;
  array: [string]
}

export interface topicSet{
  topic0?: string;
  topic1?: string;
  topic2?: string;
  topic3?: string;
  topic4?: string;
}

export interface logQueryBody{
  range?: logQueryRange;
  options?: logQueryOptions;
  topicSets: Array<topicSet>;
}

export interface logQueryRange{
  unit ?: string;
  from ?: number;
  to ?: number;
}

export interface logQueryOptions { 
  offset?: number;
  limit?: number;
}

const defaultGasPriceCoef = 128;
const defaultExpiration = 720;

const isArray = function (o: any):boolean {
  return Object.prototype.toString.call(o) == '[object Array]';
}

const formatBlockNumber = function (blockNumber: Number | String): Number|String {
  if (typeof blockNumber === 'number') {
    return blockNumber;
  } else if (typeof blockNumber === 'string') {
    if (blockNumber === 'earliest')
      return 0;
    else if (blockNumber === 'latest' || blockNumber === 'pending')
      return 'best';
    else
      return blockNumber;  
  } else {
    return 'best';
  }
}

const formatRange = function (range: any): logQueryRange|null{
  let ret: logQueryRange = {};
  if (range.unit !== 'block' && range.unit !== 'time')
    return null;
  else
    ret.unit = range.unit;

  try {
    let from = formatBlockNumber(range.from)
    if (from !== 'best')
      ret.from = Number.parseInt(<string>from)
  } catch {
    ret.from = 0
  }
  try {
    let to = formatBlockNumber(range.to)
    if (to !== 'best')
      ret.to = Number.parseInt(range.to)
  } catch{
    ret.to = MaxUint32
  }
  return ret;
}

const formatOptions = function (options: any): logQueryOptions|null{
  let ret: logQueryOptions = {};
  if (options.limit) {
    try {
      ret.limit = Number.parseInt(options.limit)
    } finally {}
  }
  if (options.offset) {
    try {
      ret.offset = Number.parseInt(options.offset)
    } finally { }
  }
  return ret;
}

const formatLogQuery = function (params: any): logQueryBody {
  let body: logQueryBody = {
    topicSets:[]
  };
  
  if (params.range) {
    let ret = formatRange(params.range);
    ret && (body.range = ret);
  }

  if (params.options) {
    let ret = formatOptions(params.options);
    ret && (body.options = ret);
  }

  if (!body.range) {
    if (params.fromBlock) {
      try {
        let from = formatBlockNumber(params.fromBlock)
        if (from !== 'best') {
          body.range = body.range ? body.range : {}
          body.range.from = Number.parseInt(<string>from)
        }
      } finally{}
    }
    if (params.toBlock) {
      try {
        let to = formatBlockNumber(params.toBlock)
        if (to !== 'best') {
          body.range = body.range ? body.range : {}
          body.range.to = Number.parseInt(<string>to)
        }
      } finally{}
    }
    if (body.range)
      body.range.unit = 'block'
  }

  body.topicSets = [];
  let topics: Array<topicItem> = [];

  for (let i = 0; i < params.topics.length; i++) {
    if(typeof params.topics[i] === 'string') {
      topics.push({
        name: <topicName>'topic' + i,
        array: [params.topics[i]]
      });
    } else if (isArray(params.topics[i]) && params.topics[i].length) {
      topics.push({
        name: <topicName>'topic' + i,
        array: params.topics[i]
      });
    }
  }

  let outputTopic = function (topics: Array<topicItem>, index: number, receiver: Array<topicSet>, current: topicSet) {
    if (index == topics.length) {
      let o = {};
      Object.assign(o, current);
      receiver.push(o);
      return;
    }
    for (let item of topics[index].array) {
      current[<topicName>topics[index].name] = item;
      outputTopic(topics, index + 1, receiver, current);
    }
  }

  if (topics.length) {
    outputTopic(topics, 0, body.topicSets, {});
  }
  
  return body;
}

const toPrefixedHex = function (hexStr: string): string{
  if (hexStr.indexOf('0x') === 0)
    return hexStr;
  else
    return '0x' + hexStr;  
}

const sanitizeHex = function (hexStr: string): string {
  if (hexStr.indexOf('0x') === 0)
    return hexStr.substr(2);
  else
    return hexStr;
}

const isHex = function (hex:string):boolean {
  return ((typeof hex === 'string') && /^(-0x|0x)?[0-9a-f]*$/i.test(hex));
};

const checkRawTx = function (tx: RawTransaction):void {
  if (!tx.Nonce) {
    throw new Error('Nonce is need for transaction')
  }
}

const hash = function (input: string | Buffer): string {
  return '0x' + blake.blake2bHex(input, null, 32);
}

const sign = function (hash: Buffer, privateKey: Buffer): string {
  let signature = secp256k1.keyFromPrivate(privateKey).sign(hash, { canonical: true });
  return '0x' + Buffer.concat([signature.r.toBuffer(), signature.s.toBuffer(), Buffer.from([signature.recoveryParam])]).toString('hex');
}

const ECRecover = function (hash: Buffer, sig: Buffer): string {
  let recovery = sig[64];
  let signature = {
    r: sig.slice(0, 32),
    s: sig.slice(32, 64)
  };

  let ecPublicKey = secp256k1.recoverPubKey(hash, signature, recovery);
  let publicKey = "0x" + ecPublicKey.encode("hex", false).slice(2);
  let publicHash = EthLib.hash.keccak256(publicKey);
  let address = EthLib.account.toChecksum("0x" + publicHash.slice(-40));
  return address;
}

export default {
  formatBlockNumber,
  formatLogQuery,
  isArray,
  toPrefixedHex,
  sanitizeHex,
  isHex,
  defaultGasPriceCoef,
  defaultExpiration,
  checkRawTx,
  hash,
  ECRecover,
  sign
}