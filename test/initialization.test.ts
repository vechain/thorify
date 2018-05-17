"use strict";

import { thorify } from "../src";
const Web3 = require("web3");

describe("Initialization", () => {
  it("init thorify", () => {
    const web3 = new Web3();
    thorify(web3, "http://localhost:8669");
  });
});
