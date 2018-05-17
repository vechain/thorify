"use strict";
import { expect } from "chai";
import { thorify } from "./test-utils/thorify";

const Web3 = require("web3");
const web3 = new Web3();
thorify(web3);

describe("web3.eth", () => {

  it("getBlock without parameter", async () => {
    const ret = await web3.eth.getBlock();
    const req = ret.getReqBody();
    expect(req).to.have.nested.property("params[0]");
    expect(req.params[0]).to.equal(undefined);
  });

  it("getBlock with earliest", async () => {
    const ret = await web3.eth.getBlock("earliest");
    const req = ret.getReqBody();
    expect(req).to.have.nested.property("params[0]");
    expect(req.params[0]).to.equal("earliest");
  });

  it("getBlock with latest", async () => {
    const ret = await web3.eth.getBlock("latest");
    const req = ret.getReqBody();
    expect(req).to.have.nested.property("params[0]");
    expect(req.params[0]).to.equal("latest");
  });

  it("getBlock with pending", async () => {
    const ret = await web3.eth.getBlock("pending");
    const req = ret.getReqBody();
    expect(req).to.have.nested.property("params[0]");
    expect(req.params[0]).to.equal("pending");
  });

  it("getBlock with blockHash", async () => {
    const ret = await web3.eth.getBlock("0x00003800dfbcc35f2010ebcc26f28f009268b1df58886a0c698545ed07bd1c7b");
    const req = ret.getReqBody();
    expect(req).to.have.nested.property("params[0]");
    expect(req.method).to.equal("eth_getBlockByHash");
    expect(req.params[0]).to.equal("0x00003800dfbcc35f2010ebcc26f28f009268b1df58886a0c698545ed07bd1c7b");
  });

  it("getBlock with blockNumber", async () => {
    const ret = await web3.eth.getBlock(1);
    const req = ret.getReqBody();
    expect(req).to.have.nested.property("params[0]");
    expect(req.params[0]).to.equal("0x1");
  });

});
