"use strict";
/* tslint:disable:max-line-length */

const web3Utils = require("web3-utils");
import { isNumber } from "util";
import { IClause, IEthTransaction, ILogQueryBody, ILogQueryOptions, ILogQueryRange, IThorTransaction, ITopicItem, ITopicSet, StringOrNull, StringOrNumber, topicName } from "../types";
import * as utils from "./";
import {params} from "./params";

export const isArray = function(o: any): boolean {
  return Object.prototype.toString.call(o) === "[object Array]";
};

export const formatBlockNumber = function(blockNumber: StringOrNumber): StringOrNumber {
  if (typeof blockNumber === "number") {
    return blockNumber;
  } else if (typeof blockNumber === "string") {
    if (blockNumber === "earliest") {
      return 0;
    } else if (blockNumber === "latest" || blockNumber === "pending") {
      return "best";
    } else {
      const num = utils.toInteger(blockNumber);
      return num || num === 0 ? num : "best";
    }
  } else {
    return "best";
  }
};

export const formatBlockHash = function(blockHash: string): string {
  if (utils.isHex(blockHash)) {
    return blockHash;
  } else {
    return "best";
  }
};

export const formatRange = function(range: any): ILogQueryRange | null {
  const ret: ILogQueryRange = {};
  if (range.unit !== "block" && range.unit !== "time") {
    return null;
  } else {
    ret.unit = range.unit;
  }
  if (range.hasOwnProperty("from")) {
    const temp = formatBlockNumber(range.from);
    if (temp !== "best") { ret.from = temp as number; } else { ret.from = 0; }
  } else {
    ret.from = 0;
  }
  if (range.hasOwnProperty("to")) {
    const temp = utils.formatBlockNumber(range.to);
    if (temp !== "best") { ret.to = temp as number; } else { ret.to = Number.MAX_SAFE_INTEGER; }
  } else {
    ret.to = Number.MAX_SAFE_INTEGER;
  }

  return ret;
};

export const formatOptions = function(options: any): ILogQueryOptions | null {
  const ret: ILogQueryOptions = {};
  if (options.hasOwnProperty("limit")) {
    const temp = utils.toInteger(options.limit);
    if (temp) { ret.limit = temp; }
  }
  if (options.hasOwnProperty("offset")) {
    const temp = utils.toInteger(options.offset);
    if (temp) { ret.offset = temp; }
  }
  return ret;
};

export const formatLogQuery = function(params: any): ILogQueryBody {
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

    if (params.hasOwnProperty("fromBlock")) {
      const from = formatBlockNumber(params.fromBlock);
      if (from !== "best") {
        body.range = body.range ? body.range : {};
        body.range.from = Number.parseInt(from as string);
      }
    }

    if (params.hasOwnProperty("toBlock")) {
      const to = formatBlockNumber(params.toBlock);
      if (to !== "best") {
        body.range = body.range ? body.range : {};
        body.range.to = Number.parseInt(to as string);
      }
    }

    if (body.range) {
      body.range.unit = "block";
    }

  }

  body.topicSets = [];
  const topics: ITopicItem[] = [];

  if (params.topics && params.topics.length) {
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

const maxUint8 = new web3Utils.BN(2).pow(new web3Utils.BN(8));
const maxUint32 = new web3Utils.BN(2).pow(new web3Utils.BN(32));
const maxUint64 = new web3Utils.BN(2).pow(new web3Utils.BN(64));

export const toUint8 = function(input: number | string): StringOrNull {
  if (typeof input !== "number" && !input) {
    return null;
  }
  return "0x" + web3Utils.toBN(input).mod(maxUint8).toString(16);
};

export const toUint64 = function(input: number | string): StringOrNull {
  if (typeof input !== "number" && !input) {
    return null;
  }
  return "0x" + web3Utils.toBN(input).mod(maxUint64).toString(16);
};

export const toUint32 = function(input: number | string): StringOrNull {
  if (typeof input !== "number" && !input) {
    return null;
  }
  return "0x" + web3Utils.toBN(input).mod(maxUint32).toString(16);
};

export const ethToThorTx = function(ethTx: IEthTransaction): IThorTransaction {
  const thorTx: IThorTransaction = {
    clauses: [],
  };

  if (ethTx.chainTag === 0 || ethTx.chainTag) {
    const chainTag = toUint8(ethTx.chainTag);
    if (chainTag) {
      thorTx.chainTag = chainTag;
    }
  }
  if (ethTx.blockRef === 0 || ethTx.blockRef) {
    const blockRef = toUint64(ethTx.blockRef);
    if (blockRef) {
      thorTx.blockRef = blockRef;
    }
  }
  if (ethTx.expiration === 0 || ethTx.expiration) {
    const expiration = toUint32(ethTx.expiration);
    thorTx.expiration = expiration || utils.params.defaultExpiration;
  } else {
    thorTx.expiration = utils.params.defaultExpiration;
  }
  if (ethTx.gasPriceCoef === 0 || ethTx.gasPriceCoef) {
    const gasPriceCoef = toUint8(ethTx.gasPriceCoef);
    thorTx.gasPriceCoef = gasPriceCoef || utils.params.defaultGasPriceCoef;
  } else {
    thorTx.gasPriceCoef = utils.params.defaultGasPriceCoef;
  }
  if (ethTx.gas) {
    const gas = toUint64(ethTx.gas);
    if (gas) {
      thorTx.gas = gas;
    }
  }
  if (ethTx.dependsOn) {
    if (web3Utils.isHex(ethTx.dependsOn)) {
      thorTx.dependsOn = ethTx.dependsOn;
    }
  }
  if (ethTx.nonce) {
    const nonce = toUint64(ethTx.nonce);
    if (nonce) {
      thorTx.nonce = nonce;
    }
  }

  const clause: IClause = {
    value: 0,
  };

  if (ethTx.to) {
    clause.to = ethTx.to;
  }

  if (ethTx.data) {
    if (!web3Utils.isHex(ethTx.data)) {
      throw new Error("The data field must be HEX encoded data.");
    } else {
      clause.data = ethTx.data;
    }
  }

  const value = web3Utils.numberToHex(ethTx.value);
  if (value) {
    clause.value = value;
  }

  if (clause.data || clause.to) {
    thorTx.clauses.push(clause);
  }
  return thorTx;
};
