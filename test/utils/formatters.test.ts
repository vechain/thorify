"use strict";
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import * as utils from "../../src/utils";

describe("EthTx to ThorTx", () => {
  it("Empty Object", () => {
    const ret = utils.ethToThorTx({});
    expect(ret.clauses).to.have.lengthOf(0);
    expect(ret.expiration).to.be.equal(utils.params.defaultExpiration);
    expect(ret.gasPriceCoef).to.be.equal(utils.params.defaultGasPriceCoef);
  });

  it("With valid properties", () => {
    const ret = utils.ethToThorTx({
      chainTag: 0,
      blockRef: 100,
      expiration: 100,
      gasPriceCoef: 100,
      gas: 100,
      dependsOn: "0xa975938d77903a388a2c2bd89fa8f76e5b54d5b7a0daf8a58452707bdd5c894c",
      nonce: 100,
      to: "0x7567d83b7b8d80addcb281a71d54fc7b3364ffed",
      value: 100,
    });
    expect(ret.chainTag).to.be.equal("0x0");
    expect(ret.blockRef).to.be.equal("0x64");
    expect(ret.expiration).to.be.equal("0x64");
    expect(ret.expiration).to.be.equal("0x64");
    expect(ret.dependsOn).to.be.equal("0xa975938d77903a388a2c2bd89fa8f76e5b54d5b7a0daf8a58452707bdd5c894c");
    expect(ret.nonce).to.be.equal("0x64");
    expect(ret.clauses).to.have.lengthOf(1);
    expect(ret.clauses[0].to).to.be.equal("0x7567d83b7b8d80addcb281a71d54fc7b3364ffed");
    expect(ret.clauses[0].value).to.be.equal("0x64");
    expect(ret.clauses[0].value).to.be.equal("0x64");
    expect(ret.clauses[0]).to.not.have.property("data");
  });

  it("With invalid dependsOn", () => {
    const ret = utils.ethToThorTx({ dependsOn: "invalid dependsOn" });
    expect(ret).to.not.have.property("dependsOn");
  });

  it("With valid data", () => {
    const ret = utils.ethToThorTx({ data: "0xdead", to: null });
    expect(ret.clauses[0].data).to.be.equal("0xdead");
  });

  it("With invalid data", () => {
    expect(() => utils.ethToThorTx({ data: "invalid data" })).to.throw("The data field must be HEX encoded data.");
  });

});

describe("toNumber series", () => {

  it("toUint8 With invalid type", () => {
    expect(utils.toUint8(null)).to.be.null;
  });

  it("toUint32 With invalid type", () => {
    expect(utils.toUint32(null)).to.be.null;
  });

  it("toUint64 With invalid type", () => {
    expect(utils.toUint64(null)).to.be.null;
  });

});

describe("Others", () => {

  it("isArray with valid input", () => {
    expect(utils.isArray([])).to.be.true;
  });

  it("isArray with invalid input", () => {
    expect(utils.isArray({})).to.be.false;
  });

});
