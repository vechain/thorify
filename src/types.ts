"use strict";
export type StringOrNull = string | null;
export type StringOrNumber = string | number;
export type Callback = (err: Error | null, result?: any) => void;

export interface IRawTransaction {
  ChainTag?: StringOrNumber;
  BlockRef?: StringOrNumber;
  Expiration?: StringOrNumber;
  GasPriceCoef?: StringOrNumber;
  Gas?: StringOrNumber;
  DependsOn?: string;
  Nonce?: StringOrNumber;
  Signature?: string;
  Clauses: IClause[];
  from?: string;
  to?: StringOrNull;
  gasPrice?: StringOrNumber;
  data?: StringOrNull;
}

export interface IClause {
  to?: StringOrNull;
  value: StringOrNumber;
  data?: string;
}

export interface ITransaction {
  chainTag?: StringOrNumber;
  blockRef?: StringOrNumber;
  expiration?: StringOrNumber;
  gasPriceCoef?: StringOrNumber;
  gas?: StringOrNumber;
  dependsOn?: string;
  nonce?: StringOrNumber;
  origin: string;
  clauses: IClause[];
  // for compatible with web3, add from, to, value
  to?: string;
  from?: string;
  value?: number;
  data?: string;
}
