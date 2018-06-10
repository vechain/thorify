"use strict";
/* tslint:disable:max-line-length */
import { expect } from "chai";
import { ThorAPIMapping } from "../src/thor-interceptor";

describe("interceptor", () => {

  it("eth_getBlockByNumber", () => {
    const preparation = ThorAPIMapping.eth_getBlockByNumber.prepare({ params: ["0x64"] });
    expect(preparation.URL).to.be.equal("/blocks/100");
    expect(preparation.Method).to.be.equal("GET");
    expect(preparation.ResFormatter("input")).to.be.equal("input");
  });

  it("eth_getBlockByHash", () => {
    const preparation = ThorAPIMapping.eth_getBlockByHash.prepare({ params: ["0x0002be0c92b2a1d8f47a6e2cab583cbcbb0ae1125a83c31c93521b0e0a2c4fa6"] });
    expect(preparation.URL).to.be.equal("/blocks/0x0002be0c92b2a1d8f47a6e2cab583cbcbb0ae1125a83c31c93521b0e0a2c4fa6");
    expect(preparation.Method).to.be.equal("GET");
    expect(preparation.ResFormatter("input")).to.be.equal("input");
  });

  it("eth_blockNumber", () => {
    const preparation = ThorAPIMapping.eth_blockNumber.prepare({});
    expect(preparation.URL).to.be.equal("/blocks/best");
    expect(preparation.Method).to.be.equal("GET");
    expect(preparation.ResFormatter(null)).to.be.equal(null);
    expect(preparation.ResFormatter({number: 100})).to.be.equal(100);
  });

  it("eth_getBalance", () => {
    const preparation = ThorAPIMapping.eth_getBalance.prepare({ params: ["0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed"]});
    expect(preparation.URL).to.be.equal("/accounts/0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed?revision=best");
    expect(preparation.Method).to.be.equal("GET");
    expect(preparation.ResFormatter(null)).to.be.equal(null);
    expect(preparation.ResFormatter({ balance: 100 })).to.be.equal(100);
  });

  it("eth_getEnergy", () => {
    const preparation = ThorAPIMapping.eth_getEnergy.prepare({ params: ["0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed"] });
    expect(preparation.URL).to.be.equal("/accounts/0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed?revision=best");
    expect(preparation.Method).to.be.equal("GET");
    expect(preparation.ResFormatter(null)).to.be.equal(null);
    expect(preparation.ResFormatter({ energy: 100 })).to.be.equal(100);
  });

  it("eth_getCode", () => {
    const preparation = ThorAPIMapping.eth_getCode.prepare({ params: ["0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed"] });
    expect(preparation.URL).to.be.equal("/accounts/0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed/code?revision=best");
    expect(preparation.Method).to.be.equal("GET");
    expect(preparation.ResFormatter(null)).to.be.equal(null);
    expect(preparation.ResFormatter({ code: "0xdead" })).to.be.equal("0xdead");
  });

  it("eth_getStorageAt", () => {
    const preparation = ThorAPIMapping.eth_getStorageAt.prepare({ params: ["0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed", "0x07855b46a623a8ecabac76ed697aa4e13631e3b6718c8a0d342860c13c30d2fc"] });
    expect(preparation.URL).to.be.equal("/accounts/0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed/storage/0x07855b46a623a8ecabac76ed697aa4e13631e3b6718c8a0d342860c13c30d2fc?revision=best");
    expect(preparation.Method).to.be.equal("GET");
    expect(preparation.ResFormatter(null)).to.be.equal(null);
    expect(preparation.ResFormatter({ value: "0xdead" })).to.be.equal("0xdead");
  });

  it("eth_sendRawTransaction", () => {
    const preparation = ThorAPIMapping.eth_sendRawTransaction.prepare({ params: ["0x07855b46a623a8ecabac76ed697aa4e13631e3b6718c8a0d342860c13c30d2fc"] });
    expect(preparation.URL).to.be.equal("/transactions");
    expect(preparation.Method).to.be.equal("POST");
    expect(preparation.Body).to.have.property("raw", "0x07855b46a623a8ecabac76ed697aa4e13631e3b6718c8a0d342860c13c30d2fc");
    expect(preparation.ResFormatter(null)).to.be.equal(null);
    expect(preparation.ResFormatter({ id: "0xdead" })).to.be.equal("0xdead");
  });

  it("eth_getTransactionByHash", () => {
    const preparation = ThorAPIMapping.eth_getTransactionByHash.prepare({ params: ["0xa5b3d1dbafe79a41dce8ec33a83e68cf506cdcd1df7776c3afd8fc67a76cecf2"] });
    expect(preparation.URL).to.be.equal("/transactions/0xa5b3d1dbafe79a41dce8ec33a83e68cf506cdcd1df7776c3afd8fc67a76cecf2");
    expect(preparation.Method).to.be.equal("GET");
    expect(preparation.ResFormatter(null)).to.be.equal(null);
    expect(preparation.ResFormatter({ block: { number: 100 } })).to.have.property("blockNumber", 100);
  });

  it("eth_getTransactionReceipt", () => {
    const preparation = ThorAPIMapping.eth_getTransactionReceipt.prepare({ params: ["0xa5b3d1dbafe79a41dce8ec33a83e68cf506cdcd1df7776c3afd8fc67a76cecf2"] });
    expect(preparation.URL).to.be.equal("/transactions/0xa5b3d1dbafe79a41dce8ec33a83e68cf506cdcd1df7776c3afd8fc67a76cecf2/receipt");
    expect(preparation.Method).to.be.equal("GET");
    expect(preparation.ResFormatter(null)).to.be.equal(null);
    let receipt = preparation.ResFormatter({
      block: { id: "block-id", number: 100 },
      tx: { id: "tx-id" },
      reverted: false,
      outputs: [{ contractAddress: "contractAddress" }],
    });
    expect(receipt).to.have.property("blockNumber", 100);
    expect(receipt).to.have.property("blockHash", "block-id");
    expect(receipt).to.have.property("transactionHash", "tx-id");
    expect(receipt).to.have.property("status", "0x1");
    expect(receipt).to.have.property("contractAddress", "contractAddress");
    receipt = preparation.ResFormatter({
      block: { id: "block-id", number: 100 },
      tx: { id: "tx-id" },
      reverted: true,
      outputs: [{ contractAddress: "contractAddress" }, { contractAddress: "contractAddress" }],
    });
    expect(receipt).to.have.not.property("contractAddress");
    expect(preparation.ResFormatter({
      block: {id: "block-id", number: 100},
      tx: {id: "tx-id"},
      reverted: true,
      outputs: [{contractAddress: "contractAddress"}],
    })).to.have.property("status", "0x0");
  });

  it("eth_call", () => {
    let preparation = ThorAPIMapping.eth_call.prepare({
      params: [{
        to: "0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed",
        from: "0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed",
        gas: 100,
        value: "0x64",
        gasPrice: "0x64",
      }]});
    expect(preparation.URL).to.be.equal("/accounts/0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed?revision=best");
    expect(preparation.Method).to.be.equal("POST");
    expect(preparation.Body).to.have.property("value", "0x64");
    expect(preparation.Body).to.have.property("gas", 100);
    expect(preparation.Body).to.have.property("gasPrice", "0x64");
    expect(preparation.Body).to.have.property("caller", "0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed");
    expect(preparation.ResFormatter(null)).to.be.equal(null);
    expect(preparation.ResFormatter({ reverted: true })).to.be.equal(null);
    expect(preparation.ResFormatter({ data: "data" })).to.be.equal("data");
    preparation = ThorAPIMapping.eth_call.prepare({
      params: [{
        to: "0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed",
        gas: "0x64",
        value: "0x64",
        gasPrice: "0x64",
      }],
    });
    expect(preparation.Body).to.have.property("gas", 100);
    expect(preparation.Body).to.not.have.property("caller");
    preparation = ThorAPIMapping.eth_call.prepare({
      params: [{
        from: "0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed",
      }],
    });
    expect(preparation.URL).to.be.equal("/accounts?revision=best");
  });

  it("eth_estimateGas", () => {
    let preparation = ThorAPIMapping.eth_estimateGas.prepare({
      params: [{
        to: "0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed",
        from: "0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed",
        value: "0x64",
        gasPrice: "0x64",
      }],
    });
    expect(preparation.URL).to.be.equal("/accounts/0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed?revision=best");
    expect(preparation.Method).to.be.equal("POST");
    expect(preparation.Body).to.have.property("value", "0x64");
    expect(preparation.Body).to.have.property("gasPrice", "0x64");
    expect(preparation.Body).to.have.property("caller", "0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed");
    expect(preparation.ResFormatter(null)).to.be.equal(null);
    expect(preparation.ResFormatter({ reverted: true })).to.be.equal(null);
    expect(preparation.ResFormatter({ gasUsed: 0 })).to.be.equal(21000);
    expect(preparation.ResFormatter({ gasUsed: 10 })).to.be.equal(23111);
    preparation = ThorAPIMapping.eth_estimateGas.prepare({
      params: [{
        from: "0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed",
      }],
    });
    expect(preparation.URL).to.be.equal("/accounts?revision=best");
    preparation = ThorAPIMapping.eth_estimateGas.prepare({
      params: [{
        to: "0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed",
        value: "0x64",
        gasPrice: "0x64",
      }],
    });
    expect(preparation.Body).to.not.have.property("caller");
  });

  it("eth_getLogs", () => {
    let preparation = ThorAPIMapping.eth_getLogs.prepare({
      params: [{
        address: "0x0000000000000000000000417574686f72697479",
        order: "ASC",
    }] });
    expect(preparation.URL).to.be.equal("/events?address=0x0000000000000000000000417574686f72697479&order=ASC");
    expect(preparation.Method).to.be.equal("POST");
    expect(preparation.ResFormatter(null)).to.be.equal(null);
    const ret = preparation.ResFormatter([{
      block: { number: 100, id: "block-id" },
      tx: { id: "tx-id" },
    }]);
    expect(ret).to.have.lengthOf(1);
    expect(ret[0]).to.have.property("blockNumber", 100);
    expect(ret[0]).to.have.property("blockHash", "block-id");
    expect(ret[0]).to.have.property("transactionHash", "tx-id");
    preparation = ThorAPIMapping.eth_getLogs.prepare({
      params: [{
        address: "0x0000000000000000000000417574686f72697479",
        order: "DESC",
      }],
    });
    expect(preparation.URL).to.be.equal("/events?address=0x0000000000000000000000417574686f72697479&order=DESC");
    preparation = ThorAPIMapping.eth_getLogs.prepare({
      params: [{
      }],
    });
    expect(preparation.URL).to.be.equal("/events");
  });

  it("eth_getBlockRef", () => {
    const preparation = ThorAPIMapping.eth_getBlockRef.prepare({});
    expect(preparation.URL).to.be.equal("/blocks/best");
    expect(preparation.Method).to.be.equal("GET");
    expect(preparation.ResFormatter(null)).to.be.equal(null);
    expect(preparation.ResFormatter({})).to.be.equal(null);
    expect(preparation.ResFormatter({ id: "0x0002d18ea07596b0f63402763de425be7c6939b00b712c9d576b41bc2ef60256" })).to.be.equal("0x0002d18ea07596b0");
  });

  it("eth_getChainTag", () => {
    const preparation = ThorAPIMapping.eth_getChainTag.prepare({});
    expect(preparation.URL).to.be.equal("/blocks/0");
    expect(preparation.Method).to.be.equal("GET");
    expect(preparation.ResFormatter(null)).to.be.equal(null);
    expect(preparation.ResFormatter({})).to.be.equal(null);
    expect(preparation.ResFormatter({ id: "0x0002d18ea07596b0f63402763de425be7c6939b00b712c9d576b41bc2ef60256" })).to.be.equal("0x56");
  });

});
