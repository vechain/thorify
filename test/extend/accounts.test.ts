"use strict";
import { expect } from "chai";
import { thorify } from "../../src";
const Web3 = require("web3");

const web3 = new Web3();
thorify(web3, "http://localhost:8669");

describe("extend:accounts", () => {

  it("normal sign Transaction", async () => {
    const ret = await web3.eth.accounts.signTransaction({
      clauses: [{
        to: "0xD3ae78222BEADB038203bE21eD5ce7C9B1BfF602",
        value: "0x3e8",
      }],
      expiration: 720,
      gasPriceCoef: 128,
      chainTag: "0x89",
      blockRef: "0x000000352985d99d",
      gas: 53000,
      nonce: 1198344495087,
    }, "0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65");
    expect(ret).to.have.property("rawTransaction");
    expect(ret).to.have.property("messageHash");
  });

  it("sign Transaction with callback", () => {
    web3.eth.accounts.signTransaction({
      clauses: [{
        to: "0xD3ae78222BEADB038203bE21eD5ce7C9B1BfF602",
        value: "0x3e8",
      }],
      expiration: 720,
      gasPriceCoef: 128,
      chainTag: "0x89",
      blockRef: "0x000000352985d99d",
      gas: 53000,
      nonce: 1198344495087,
    }, "0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65", (ret) => {
      expect(ret).to.have.property("rawTransaction");
      expect(ret).to.have.property("messageHash");
    });

  });

});
