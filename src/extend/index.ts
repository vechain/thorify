"use strict";

import extendAccounts from "./accounts";
import extendContracts from "./contract";
import extendFormatters from "./formatters";
import extendMethods from "./method";

const extend = function(web3: any) {
  extendAccounts(web3);
  extendFormatters(web3);
  extendMethods(web3);
  extendContracts(web3);
};

export default extend;
