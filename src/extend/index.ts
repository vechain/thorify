'use strict';

import extendAccounts from './accounts';
import extendFormatters from './formatters';
import extendMethods from './method';
import extendContracts from './contract';

const extend = function (web3: any) {
  extendAccounts(web3);
  extendFormatters(web3);
  extendMethods(web3);
  extendContracts(web3);
}

export default extend;