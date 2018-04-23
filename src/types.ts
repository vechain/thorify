'use strict';
export type StringorNull = string | null;
export type StringorNumber = string | number;
export type Callback = (err: Error | null, result?: any) => void

export interface RawTransaction {
  ChainTag?: StringorNumber;
  BlockRef?: StringorNumber;
  Expiration?: StringorNumber;
  GasPriceCoef?: StringorNumber;
  Gas?: StringorNumber;
  DependsOn?: string;
  Nonce?: StringorNumber;
  Signature?: string;
  Clauses: Array<Clause>;
  from?: string;
  to?: StringorNull;
  gasPrice?: StringorNumber;
  data?: StringorNull;
}

export interface Clause {
  to?: StringorNull;
  value: StringorNumber;
  data?: string;
}

export interface Transaction {
  chainTag?: StringorNumber;
  blockRef?: StringorNumber;
  expiration?: StringorNumber;
  gasPriceCoef?: StringorNumber;
  gas?: StringorNumber;
  dependsOn?: string;
  nonce?: StringorNumber;
  origin: string;
  clauses: Array<Clause>;
  // for competibale with web3, add from, to, value
  to?: string;
  from?: string;
  value?: number;
  data?: string;
}