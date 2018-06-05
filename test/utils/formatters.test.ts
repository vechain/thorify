"use strict";
/*tslint:disable:no-unused-expression*/
/* tslint:disable:max-line-length */
import { expect } from "chai";
import * as utils from "../../src/utils";

describe("utils:eth Tx to thor Tx", () => {
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
      expiration: "100",
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

describe("utils:toNumber series", () => {

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

describe("utils:formatBlockNumber", () => {

  it("with number", () => {
    expect(utils.formatBlockNumber(100)).to.be.equal(100);
  });

  it("with valid string", () => {
    expect(utils.formatBlockNumber("earliest")).to.be.equal(0);
    expect(utils.formatBlockNumber("latest")).to.be.equal("best");
    expect(utils.formatBlockNumber("pending")).to.be.equal("best");
  });

  it("with invalid string", () => {
    expect(utils.formatBlockNumber("invalid string")).to.be.equal("best");
  });

  it("with invalid type", () => {
    expect(utils.formatBlockNumber({})).to.be.equal("best");
  });

});

describe("utils:formatBlockHash", () => {

  it("with valid hex string", () => {
    expect(utils.formatBlockHash("0x0002be0c92b2a1d8f47a6e2cab583cbcbb0ae1125a83c31c93521b0e0a2c4fa6")).to.be.equal("0x0002be0c92b2a1d8f47a6e2cab583cbcbb0ae1125a83c31c93521b0e0a2c4fa6");
  });

  it("with invalid type", () => {
    expect(utils.formatBlockHash({})).to.be.equal("best");
  });

});

describe("utils:formatRange", () => {

  it("empty input", () => {
    expect(utils.formatRange({})).to.be.null;
  });

  it("minimal input", () => {
    const ret = utils.formatRange({ unit: "block" });
    expect(ret.unit).to.be.equal("block");
    expect(ret.from).to.be.equal(0);
    expect(ret.to).to.be.equal(Number.MAX_SAFE_INTEGER);
  });

  it("normal input", () => {
    const ret = utils.formatRange({ unit: "block" , from: 0 , to: 1000});
    expect(ret.unit).to.be.equal("block");
    expect(ret.from).to.be.equal(0);
    expect(ret.to).to.be.equal(1000);
  });

  it("invalid input", () => {
    const ret = utils.formatRange({ unit: "time", from: "invalid-number", to: "invalid-number"});
    expect(ret.unit).to.be.equal("time");
    expect(ret.from).to.be.equal(0);
    expect(ret.to).to.be.equal(Number.MAX_SAFE_INTEGER);
  });
});

describe("utils:formatOptions", () => {

  it("empty input", () => {
    const ret = utils.formatOptions({});
    expect(ret).to.not.have.property("limit");
    expect(ret).to.not.have.property("offset");
  });

  it("valid input", () => {
    const ret = utils.formatOptions({ limit: 100, offset: 100 });
    expect(ret.limit).to.be.equal(100);
    expect(ret.offset).to.be.equal(100);
  });

});

describe("utils:formatLogQuery", () => {

  it("empty input", () => {
    const ret = utils.formatLogQuery({});
    expect(ret).to.not.have.property("options");
    expect(ret).to.not.have.property("range");
  });

  it("valid options", () => {
    const ret = utils.formatLogQuery({ options: { limit: 100, offset: 100 } });
    expect(ret.options.limit).to.be.equal(100);
    expect(ret.options.offset).to.be.equal(100);
  });

  it("valid range", () => {
    const ret = utils.formatLogQuery({ range: { unit: "block", from: 0, to: 1000 } });
    expect(ret.range.unit).to.be.equal("block");
    expect(ret.range.from).to.be.equal(0);
    expect(ret.range.to).to.be.equal(1000);
  });

  it("valid from block", () => {
    const ret = utils.formatLogQuery({ fromBlock: "0x64" });
    expect(ret.range.unit).to.be.equal("block");
    expect(ret.range.from).to.be.equal(100);
    expect(ret.range).to.not.have.property("to");
  });

  it("valid to block", () => {
    const ret = utils.formatLogQuery({ toBlock: "0x64" });
    expect(ret.range.unit).to.be.equal("block");
    expect(ret.range.to).to.be.equal(100);
    expect(ret.range).to.not.have.property("from");
  });

  it("valid from & to block", () => {
    const ret = utils.formatLogQuery({ fromBlock: "0x64", toBlock: "0x65" });
    expect(ret.range.unit).to.be.equal("block");
    expect(ret.range.from).to.be.equal(100);
    expect(ret.range.to).to.be.equal(101);
  });

  it("with valid topics", () => {
    const ret = utils.formatLogQuery({
      topics: [
        ["topic00", "topic01"],
        ["topic10", "topic11"],
        "topic2",
      ],
    });

    expect(ret).to.have.property("topicSets");
    expect(ret.topicSets).to.be.instanceof(Array);
    expect(ret.topicSets).to.have.length(2 * 2 * 1);
    for (let i = 0; i < 3; i++) {
      expect(ret.topicSets[i]).to.have.property("topic0");
      expect(ret.topicSets[i]).to.have.property("topic1");
      expect(ret.topicSets[i]).to.have.property("topic2");
    }
    expect(ret.topicSets[0].topic2).to.be.equal("topic2");

    expect(ret.topicSets[0].topic1).to.be.equal("topic10");
    expect(ret.topicSets[1].topic0).to.be.equal("topic00");
    expect(ret.topicSets[2].topic0).to.be.equal("topic01");
    expect(ret.topicSets[3].topic1).to.be.equal("topic11");
  });

});

describe("utils:others", () => {

  it("isArray with valid input", () => {
    expect(utils.isArray([])).to.be.true;
  });

  it("isArray with invalid input", () => {
    expect(utils.isArray({})).to.be.false;
  });

});
