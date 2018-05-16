"use strict";

const Tx = require("thorjs-tx");
const debug = require("debug")("thor:injector");
import { Callback, IClause, StringOrNull, StringOrNumber } from "../types";
import * as utils from "../utils";

const extendMethods = function(web3: any) {
  web3.extend({
    property: "eth",
    methods: [
      new web3.extend.Method({
        name: "getEnergy",
        call: "eth_getEnergy",
        params: 2,
        inputFormatter: [web3.extend.utils.toAddress, web3.extend.formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: web3.extend.formatters.outputBigNumberFormatter,
      }),
      new web3.extend.Method({
        name: "getTransaction",
        call: "eth_getTransactionByHash",
        params: 1,
        inputFormatter: [null],
        outputFormatter: web3.extend.formatters.outputTransactionFormatter,
      }),
      new web3.extend.Method({
        name: "getTransactionReceipt",
        call: "eth_getTransactionReceipt",
        params: 1,
        inputFormatter: [null],
        outputFormatter: web3.extend.formatters.outputTransactionReceiptFormatter,
      }),
      new web3.extend.Method({
        name: "sendTransaction",
        call: "eth_sendTransaction",
        accounts: web3.eth.accounts,
        params: 1,
        inputFormatter: [web3.extend.formatters.inputTransactionFormatter],
      }),
      new web3.extend.Method({
        name: "getBlockRef",
        call: "eth_getBlockRef",
        params: 0,
      }),
      new web3.extend.Method({
        name: "getChainTag",
        call: "eth_getChainTag",
        params: 0,
      }),
    ],
  });
};

export {
  extendMethods,
};
