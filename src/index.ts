"use strict";

import {extend} from "./extend";
import { ThorHttpProvider } from "./http-provider";

const thorify = function(web3Instance: any, host = "http://localhost:8669", timeout= 0) {
  const provider = new ThorHttpProvider(host, timeout);
  web3Instance.setProvider(provider);

  extend(web3Instance);
};

export {thorify};
