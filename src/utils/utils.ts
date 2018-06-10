"use strict";
/* tslint:disable:max-line-length */
import { IEthTransaction, ILogQueryBody, ILogQueryOptions, ILogQueryRange, ITopicItem, ITopicSet, StringOrNumber, topicName } from "../types";
import {params} from "./params";

export const calcIntrinsicGas = function(tx: IEthTransaction): number {
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

export const MaxUint32 = Math.pow(2, 32) - 1;

export const toPrefixedHex = function(hexStr: string): string {
  if (hexStr.indexOf("0x") === 0) {
    return hexStr;
  } else {
    return "0x" + hexStr;
  }
};

export const sanitizeHex = function(hexStr: string): string {
  if (hexStr.indexOf("0x") === 0) {
    return hexStr.substr(2);
  } else {
    return hexStr;
  }
};

export const isHex = function(hex: string): boolean {
  return !!hex && ((typeof hex === "string") && /^(-0x|0x)?[0-9a-f]+$/i.test(hex));
};

export const newNonce = function(): number {
  return Math.floor((new Date().getTime() / 0xffff) * Math.random() * 0xffff);
};

export const toInteger = function(input: any): number | null {
  const num = Number.parseInt(input);
  if (Number.isInteger(num)) {
    return num;
  } else {
    return null;
  }
};
