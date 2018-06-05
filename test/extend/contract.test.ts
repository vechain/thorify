"use strict";
/* tslint:disable:max-line-length */

import { expect } from "chai";
import { thorify } from "../test-utils/thorify";

const Web3 = require("web3");
const web3 = new Web3();
thorify(web3);

const ABI = [{anonymous: false, inputs: [{indexed: true, name: "_from", type: "address"}, {indexed: true, name: "_to", type: "address"}, {indexed: false, name: "_value", type: "uint256"}], name: "Transfer", type: "event"}];
const Address = "0x0000000000000000000000000000456e65726779";
const contract = new web3.eth.Contract(ABI, Address);

describe("web3.contract", () => {

  it("getPastEvents without parameter", async () => {
    const ret = await contract.getPastEvents("Transfer");
    const req = ret[0].reqBody;
    expect(req).to.have.nested.property("params[0]");
    expect(req.params[0].topics).to.be.an.instanceof(Array);
    expect(req.params[0]).to.not.have.property("range");
    expect(req.params[0]).to.not.have.property("options");
  });

  it("getPastEvents", async () => {
    const ret = await contract.getPastEvents("Transfer", { range: {}, options: {}, order: "ASC"});
    const req = ret[0].reqBody;
    expect(req).to.have.nested.property("params[0]");
    expect(req.params[0].topics).to.be.an.instanceof(Array);
    expect(req.params[0]).to.have.property("range");
    expect(req.params[0]).to.have.property("options");
    expect(req.params[0]).to.have.property("order");
  });

});
