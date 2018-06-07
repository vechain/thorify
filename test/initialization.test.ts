"use strict";

import {expect} from "chai";
import { thorify } from "../src";
const Web3 = require("web3");

describe("initialization", () => {
  it("init thorify should not throw error", () => {
    const web3 = new Web3();
    thorify(web3, "http://localhost:8669", 0);
  });

  it("init thorify without host", () => {
    const web3 = new Web3();
    thorify(web3);
    expect(web3.currentProvider).to.have.property("host", "http://localhost:8669");
    expect(web3.currentProvider).to.have.property("timeout", 0);
  });

});
