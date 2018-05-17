"use strict";

import { extend } from "../../src/extend";
import { ThorHttpProvider } from "./fake-provider";

const thorify = function(web3Instance: any) {
  const provider = new ThorHttpProvider();
  web3Instance.setProvider(provider);

  extend(web3Instance);
};

export { thorify };
