"use strict";
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import * as utils from "../../src/utils";

describe("utils:utilities", () => {

  it("calcIntrinsicGas with empty code contract creation", () => {
    const ret = utils.calcIntrinsicGas({});
    expect(ret).to.be.equal(53000);
  });

  it("calcIntrinsicGas with normal tx", () => {
    const ret = utils.calcIntrinsicGas({ to: "0x7567d83b7b8d80addcb281a71d54fc7b3364ffed", value: "0x64"});
    expect(ret).to.be.equal(21000);
  });

  it("calcIntrinsicGas with data", () => {
    const ret = utils.calcIntrinsicGas({data: "0x0001"});
    expect(ret).to.be.equal(53072);
  });

  it("toPrefixedHex with 0x prefix", () => {
    expect(utils.toPrefixedHex("0x0001")).to.be.equal("0x0001");
  });

  it("toPrefixedHex without 0x prefix", () => {
    expect(utils.toPrefixedHex("0001")).to.be.equal("0x0001");
  });

  it("isHex", () => {
    expect(utils.isHex("0001")).to.be.true;
  });

  it("newNonce", () => {
    expect(utils.newNonce()).is.a("number");
  });

  it("sanitizeHex", () => {
    expect(utils.sanitizeHex("0001")).to.be.equal("0001");
  });

  it("toInteger with valid input", () => {
    expect(utils.toInteger("0x64")).to.be.equal(100);
  });

  it("toInteger with invalid input", () => {
    expect(utils.toInteger("invalid input")).to.be.null;
  });

});
