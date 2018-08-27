"use strict";
/* tslint:disable:max-line-length */

const web3Utils = require("web3-utils");
import { Address, BigInt, Bytes32, Transaction } from "thor-model-kit";
import { IClause, IEthTransaction, ILogQueryBody, ILogQueryOptions, ILogQueryRange, IThorTransaction, ITopicItem, ITopicSet, StringOrNumber, topicName } from "../types";
import * as utils from "./";

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
  if (ret.hasOwnProperty("limit") || ret.hasOwnProperty("offset")) {
    return ret;
  } else {
    return null;
  }
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

  if (!body.range && (params.hasOwnProperty("fromBlock") || params.hasOwnProperty("toBlock"))) {

    body.range = {
      unit: "block",
    };

    if (params.hasOwnProperty("fromBlock")) {
      body.range.from = params.fromBlock;
    }

    if (params.hasOwnProperty("toBlock")) {
      body.range.to = params.toBlock;
    }

    body.range = formatRange(body.range) as ILogQueryRange;

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

export const mustToBN = function(value: any) {
  if (web3Utils._.isNull(value) || web3Utils._.isUndefined(value)) {
    throw new Error("input can't be null or undefined");
  }

  const num = web3Utils.toBN(value);
  return num.abs();
};

export const validNumberOrDefault = function(value: any, defaultValue: number) {
  if (typeof value === "number" && Number.isInteger(value) ) {
    return Math.abs(value);
  }
  if (Number.isNaN(Number.parseInt(value)) === false) {
    return Math.abs(Number.parseInt(value));
  }
  return defaultValue;
};

export const leftPadBuffer = function(buf: Buffer, length: number) {
  if (buf.length > length) {
    return buf;
  }
  return Buffer.concat([Buffer.alloc(length - buf.length), buf]);
};

export const ethToThorTx = function(ethTx: IEthTransaction): Transaction {
  const thorTx: IThorTransaction = {
    clauses: [],
  };

  thorTx.chainTag = validNumberOrDefault(ethTx.chainTag, 0);
  thorTx.blockRef = leftPadBuffer(mustToBN(ethTx.blockRef).toBuffer() as Buffer, 8);
  thorTx.gas = utils.toPrefixedHex(mustToBN(ethTx.gas).toString(16));
  thorTx.expiration = validNumberOrDefault(ethTx.expiration, utils.params.defaultExpiration);
  thorTx.gasPriceCoef = validNumberOrDefault(ethTx.gasPriceCoef, utils.params.defaultGasPriceCoef);
  thorTx.dependsOn = !ethTx.dependsOn ? null : mustToBN(ethTx.dependsOn).toBuffer();
  thorTx.nonce = utils.toPrefixedHex(mustToBN(ethTx.nonce).toString(16));

  const clause: IClause = {
    value: ethTx.value || "0",
    to: null,
  };

  if (ethTx.to) {
    clause.to = ethTx.to;
  }

  if (ethTx.data) {
    if (!utils.isHex(ethTx.data)) {
      throw new Error("The data field must be HEX encoded data.");
    } else {
      clause.data = Buffer.from(utils.sanitizeHex(ethTx.data), "hex");
    }
  } else {
    clause.data = Buffer.alloc(0);
  }

  if (ethTx.value) {
    clause.value = ethTx.value;
  }

  if (ethTx.data || ethTx.to) {
    thorTx.clauses.push(clause);
  }

  const body: Transaction.Body = {
    chainTag: thorTx.chainTag,
    blockRef: thorTx.blockRef,
    expiration: thorTx.expiration,
    gasPriceCoef: thorTx.gasPriceCoef,
    gas: BigInt.from(thorTx.gas),
    clauses: [],
    dependsOn: thorTx.dependsOn ? new Bytes32(thorTx.dependsOn) : null ,
    nonce: BigInt.from(thorTx.nonce),
    reserved: [],
  };
  if (thorTx.clauses.length) {
    body.clauses.push({
      to: thorTx.clauses[0].to ? Address.fromHex(thorTx.clauses[0].to as string) : null,
      value: BigInt.from(thorTx.clauses[0].value),
      data: thorTx.clauses[0].data as Buffer,
    });
  }
  return new Transaction(body);
};
