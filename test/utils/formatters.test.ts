"use strict";
/*tslint:disable:no-unused-expression*/
/* tslint:disable:max-line-length */
import { expect } from "chai";
import * as utils from "../../src/utils";

describe("utils:eth Tx to thor Tx", () => {
  it("input without blockRef should throw error!", () => {
    expect(() => { utils.ethToThorTx({}); }).to.throw("input can\'t be null or undefined");
  });

  it("With valid properties", () => {
    const ret = utils.ethToThorTx({
      chainTag: 100,
      blockRef: "0x64",
      expiration: 100,
      gasPriceCoef: 100,
      gas: 21000,
      dependsOn: "0xa975938d77903a388a2c2bd89fa8f76e5b54d5b7a0daf8a58452707bdd5c894c",
      nonce: "0x975938d7",
      to: "0x7567d83b7b8d80addcb281a71d54fc7b3364ffed",
      value: "100",
    });
    expect(ret.body.chainTag).to.be.equal(0x64);
    expect(ret.body.blockRef.toString("hex")).to.be.equal("0000000000000064");
    expect(ret.body.expiration).to.be.equal(100);
    expect(ret.body.dependsOn.toString("")).to.be.equal("a975938d77903a388a2c2bd89fa8f76e5b54d5b7a0daf8a58452707bdd5c894c");
    expect(ret.body.nonce.toString(16)).to.be.equal("0x975938d7");
    expect(ret.body.clauses).to.have.lengthOf(1);
    expect(ret.body.clauses[0].to.toString("0x")).to.be.equal("0x7567d83b7b8d80addcb281a71d54fc7b3364ffed");
    expect(ret.body.clauses[0].value.toString(16)).to.be.equal("0x64");
    expect(ret.body.clauses[0].data).deep.equal(Buffer.alloc(0));
  });

  it("With invalid data", () => {
    const ret = utils.ethToThorTx({
      chainTag: 100,
      blockRef: "0x64",
      expiration: 100,
      gasPriceCoef: 100,
      gas: 21000,
      dependsOn: "0xa975938d77903a388a2c2bd89fa8f76e5b54d5b7a0daf8a58452707bdd5c894c",
      nonce: "0x975938d7",
      value: "100",
      data: "0xdead",
    });
    expect(ret.body.clauses[0].to).to.be.equal(null);

  });

  it("With valid data and without to", () => {
    expect(() => {
      utils.ethToThorTx({
        chainTag: 100,
        blockRef: "0x64",
        expiration: 100,
        gasPriceCoef: 100,
        gas: 21000,
        dependsOn: "0xa975938d77903a388a2c2bd89fa8f76e5b54d5b7a0daf8a58452707bdd5c894c",
        nonce: "0x975938d7",
        to: "0x7567d83b7b8d80addcb281a71d54fc7b3364ffed",
        value: "100",
        data: "rrrr",
      });
    }).to.throw("The data field must be HEX encoded data.");
  });

  // it("With invalid dependsOn", () => {
  //   const ret = utils.ethToThorTx({ dependsOn: "invalid dependsOn" });
  //   expect(ret).to.not.have.property("dependsOn");
  // });

  // it("With valid data", () => {
  //   const ret = utils.ethToThorTx({ data: "0xdead", to: null });
  //   expect(ret.clauses[0].data).to.be.equal("0xdead");
  // });

  // it("With invalid data", () => {
  //   expect(() => { utils.ethToThorTx({ chainTag: "0x9a", gas: 21000, nonce: "0xdead", data: "invalid data" }); }).to.throw("The data field must be HEX encoded data.");
  // });

});

describe("utils:formatBlockNumber", () => {

  it("with number", () => {
    expect(utils.formatBlockNumber(100)).to.be.equal(100);
  });

  it("with number 0", () => {
    expect(utils.formatBlockNumber(0)).to.be.equal(0);
  });

  it("with string 0x0", () => {
    expect(utils.formatBlockNumber("0x0")).to.be.equal(0);
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

describe("utils:mustToBN", () => {

  it("input null", () => {
    expect(() => { utils.mustToBN(null); }).to.throw("input can't be null or undefined");
  });

  it("input undefined", () => {
    expect(() => { utils.mustToBN(undefined); }).to.throw("input can't be null or undefined");
  });

  it("input number", () => {
    const ret = utils.mustToBN(100);
    expect(ret.toString()).to.be.equal("100");
  });

  it("input string", () => {
    const ret = utils.mustToBN("100");
    expect(ret.toString()).to.be.equal("100");
  });

  it("input hex string", () => {
    const ret = utils.mustToBN("0x64");
    expect(ret.toString()).to.be.equal("100");
  });

});

describe("utils:validNumberOrDefault", () => {

  it("input hex string", () => {
    const ret = utils.validNumberOrDefault("0x64", 1);
    expect(ret).to.be.equal(100);
  });

  it("input string", () => {
    const ret = utils.validNumberOrDefault("100", 1);
    expect(ret).to.be.equal(100);
  });

  it("input negative string", () => {
    const ret = utils.validNumberOrDefault("-100", 1);
    expect(ret).to.be.equal(100);
  });

  it("input negative number", () => {
    const ret = utils.validNumberOrDefault(-100, 1);
    expect(ret).to.be.equal(100);
  });

  it("input number", () => {
    const ret = utils.validNumberOrDefault(100, 1);
    expect(ret).to.be.equal(100);
  });

  it("input NaN", () => {
    const ret = utils.validNumberOrDefault(NaN, 1);
    expect(ret).to.be.equal(1);
  });

});

describe("utils:leftPadBuffer", () => {

  it("normal input", () => {
    const ret = utils.leftPadBuffer(Buffer.from("64", "hex"), 4);
    expect(ret.toString("hex")).to.be.equal("00000064");
  });

  it("buffer length more than length", () => {
    const ret = utils.leftPadBuffer(Buffer.from("00000064", "hex"), 3);
    expect(ret.toString("hex")).to.be.equal("00000064");
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
