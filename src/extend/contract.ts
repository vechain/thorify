"use strict";
const debug = require("debug")("thor:injector");
import { Clause, RawTransaction, StringOrNull, StringOrNumber, Transaction } from "../types";
import utils from "../utils";

const extendContract = function(web3: any) {
  const _encodeEventABI = web3.eth.Contract.prototype._encodeEventABI;
  web3.eth.Contract.prototype._encodeEventABI = function(event: any, options: any): any {
    debug("_encodeEventABI");
    const result = _encodeEventABI.call(this, event, options);
    if (options.options) {
      result.options = options.options;
    }
    if (options.range) {
      result.range = options.range;
    }
    if (options.order) {
      result.order = options.order;
    }
    return result;
  };
};

export default extendContract;
