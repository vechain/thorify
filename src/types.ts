"use strict";
export type StringOrNull = string | null;
export type StringOrNumber = string | number;
export type Callback = (err: Error | null, result?: any) => void;

export interface IThorTransaction {
  chainTag?: number;
  blockRef?: Buffer;
  expiration?: StringOrNumber;
  gasPriceCoef?: StringOrNumber;
  gas?: string;
  dependsOn?: Buffer|null;
  nonce?: string;
  signature?: string;
  clauses: IClause[];
  origin?: string;
  isThorified ?: () => boolean;
}

export interface IClause {
  to?: StringOrNull;
  value: string;
  data?: Buffer;
}

export interface IEthTransaction {
  chainId?: StringOrNumber;
  to?: StringOrNull;
  value?: string;
  data?: string;
  gas?: StringOrNumber;
  gasPrice?: StringOrNumber;
  nonce?: StringOrNumber;
  // allow extra properties from thor's transaction model
  chainTag?: StringOrNumber;
  blockRef?: StringOrNumber;
  expiration?: StringOrNumber;
  gasPriceCoef?: StringOrNumber;
  dependsOn?: string;
}

export type topicName = "topic0" | "topic1" | "topic2" | "topic3" | "topic4";
export interface ITopicItem {
  name: string;
  array: [string];
}

export interface ITopicSet {
  topic0?: string;
  topic1?: string;
  topic2?: string;
  topic3?: string;
  topic4?: string;
}

export interface ILogQueryBody {
  range?: ILogQueryRange;
  options?: ILogQueryOptions;
  topicSets: ITopicSet[];
}

export interface ILogQueryRange {
  unit?: string;
  from?: number;
  to?: number;
}

export interface ILogQueryOptions {
  offset?: number;
  limit?: number;
}
