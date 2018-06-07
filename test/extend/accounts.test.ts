"use strict";
/*tslint:disable:max-line-length*/
import { expect } from "chai";
import { ThorAPIMapping } from "../test-utils/fake-interceptor";
import { thorify } from "../test-utils/thorify";

const Web3 = require("web3");

const web3 = new Web3();
thorify(web3);

describe("extend:accounts", () => {

  it("normal sign Transaction", async () => {
    const ret = await web3.eth.accounts.signTransaction({
      to: "0xD3ae78222BEADB038203bE21eD5ce7C9B1BfF602",
      value: "0x3e8",
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

  it("sign Transaction with minimal param should not throw error", async () => {
    ThorAPIMapping.eth_getChainTag = { ret: "0x89" };
    ThorAPIMapping.eth_getBlockRef = { ret: "0x000000352985d99d" };
    ThorAPIMapping.eth_estimateGas = { ret: 53000 };

    const ret = await web3.eth.accounts.signTransaction({
      to: "0xD3ae78222BEADB038203bE21eD5ce7C9B1BfF602",
      value: "0x3e8",
    }, "0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65");
    expect(ret).to.have.property("rawTransaction");
    expect(ret).to.have.property("messageHash");
  });

  it("sign Transaction with callback", (done) => {
    web3.eth.accounts.signTransaction({
      to: "0xD3ae78222BEADB038203bE21eD5ce7C9B1BfF602",
      value: "0x3e8",
      expiration: 720,
      gasPriceCoef: 128,
      chainTag: "0x89",
      blockRef: "0x000000352985d99d",
      gas: 53000,
      nonce: 1198344495087,
    }, "0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65", (error, ret) => {
      try {
        expect(ret).to.have.property("rawTransaction");
        expect(ret).to.have.property("messageHash");
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it("sign Transaction without chainTag", (done) => {
    ThorAPIMapping.eth_getChainTag = { ret: null };

    web3.eth.accounts.signTransaction({
      to: "0xD3ae78222BEADB038203bE21eD5ce7C9B1BfF602",
      value: "0x3e8",
      expiration: 720,
      gasPriceCoef: 128,
      blockRef: "0x000000352985d99d",
      gas: 53000,
      nonce: 1198344495087,
    }, "0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65").catch((e) => {
      try {
        expect(() => { throw e; }).to.throw("error getting chainTag");
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it("sign Transaction with callback should return error in callback", (done) => {
    ThorAPIMapping.eth_getChainTag = { ret: null };

    web3.eth.accounts.signTransaction({
      to: "0xD3ae78222BEADB038203bE21eD5ce7C9B1BfF602",
      value: "0x3e8",
      expiration: 720,
      gasPriceCoef: 128,
      blockRef: "0x000000352985d99d",
      gas: 53000,
      nonce: 1198344495087,
    }, "0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65", (e) => {
      try {
        expect(() => { throw e; }).to.throw("error getting chainTag");
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it("sign Transaction without blockRef", (done) => {
    ThorAPIMapping.eth_getBlockRef = { ret: null };

    web3.eth.accounts.signTransaction({
      to: "0xD3ae78222BEADB038203bE21eD5ce7C9B1BfF602",
      value: "0x3e8",
      expiration: 720,
      gasPriceCoef: 128,
      chainTag: "0x89",
      gas: 53000,
      nonce: 1198344495087,
    }, "0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65").catch((e) => {
      try {
        expect(() => { throw e; }).to.throw("error getting blockRef");
        done();
      } catch (err) {
        done(err);
      }
      });
  });

  it("sign Transaction without gas", (done) => {
    ThorAPIMapping.eth_estimateGas = { ret: null };

    web3.eth.accounts.signTransaction({
      to: "0xD3ae78222BEADB038203bE21eD5ce7C9B1BfF602",
      value: "0x3e8",
      expiration: 720,
      gasPriceCoef: 128,
      chainTag: "0x89",
      blockRef: "0x000000352985d99d",
      nonce: 1198344495087,
    }, "0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65").catch((e) => {
      try {
        expect(() => { throw e; }).to.throw("error getting gas");
        done();
      } catch (err) {
        done(err);
      }
    });

  });

  it("sign Transaction without gas and 0-length clause should not throw error", async () => {
    ThorAPIMapping.eth_estimateGas = { ret: 21000 };
    await  web3.eth.accounts.signTransaction({
      expiration: 720,
      gasPriceCoef: 128,
      chainTag: "0x89",
      blockRef: "0x000000352985d99d",
      nonce: 1198344495087,
    }, "0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65");

    await web3.eth.accounts.signTransaction({
      to: null,
      value: null,
      data: null,
      expiration: 720,
      gasPriceCoef: 128,
      chainTag: "0x89",
      blockRef: "0x000000352985d99d",
      nonce: 1198344495087,
    }, "0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65");
  });

  it("sign Transaction without nonce won\'t throw error", async () => {
    await web3.eth.accounts.signTransaction({
      to: "0xD3ae78222BEADB038203bE21eD5ce7C9B1BfF602",
      value: "0x3e8",
      expiration: 720,
      gasPriceCoef: 128,
      chainTag: "0x89",
      blockRef: "0x000000352985d99d",
      gas: 53000,
    }, "0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65");
  });

  it("recover transaction should return the signer address", async () => {
    const rawTx = "0xf85d818985352985d99d8202d0c0818082cf088086011702e5dfefc0b841d290fa00bc124d1cc22d9a3e6850aab0c9ba15952487dd4c716b4043fbb77a330b0c6f81a6e98f798fa82a86ee717e0f5dbbe72eaca29a6422c1d904e542905e01";
    expect(web3.eth.accounts.recoverTransaction(rawTx)).to.be.equal("0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed");
  });

  it("hash message", async () => {
    const message = "test message";
    expect(web3.eth.accounts.hashMessage(message)).to.be.equal("0xf1d201623965f4a21390705e83ba1fb2c33600a529bd2fab2373c2558bf4cb5e");
  });

  it("hash message with hexadecimal string", async () => {
    const message = "0x74657374206d657373616765";
    expect(web3.eth.accounts.hashMessage(message)).to.be.equal("0xf1d201623965f4a21390705e83ba1fb2c33600a529bd2fab2373c2558bf4cb5e");
  });

  it("sign message", async () => {
    const message = "test message";
    const ret = web3.eth.accounts.sign(message, "0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65");
    expect(ret.message).to.be.equal("test message");
    expect(ret.messageHash).to.be.equal("0xf1d201623965f4a21390705e83ba1fb2c33600a529bd2fab2373c2558bf4cb5e");
    expect(ret.signature).to.be.equal("0xce639afc9733cbffe7a2dd87e096856e5a81fc5094c9292919eb04eb9a751b7747986f7351d562a64b9b9c9d7989eec344570e754b0461a34bb598c1ee262aef00");
  });

  it("recover with not-prefixed message", async () => {
    const message = "test message";
    const signature = "0xce639afc9733cbffe7a2dd87e096856e5a81fc5094c9292919eb04eb9a751b7747986f7351d562a64b9b9c9d7989eec344570e754b0461a34bb598c1ee262aef00";
    expect(web3.eth.accounts.recover(message, signature)).to.be.equal("0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed");
  });

  it("recover with message hash", async () => {
    const messageHash = "0xf1d201623965f4a21390705e83ba1fb2c33600a529bd2fab2373c2558bf4cb5e";
    const signature = "0xce639afc9733cbffe7a2dd87e096856e5a81fc5094c9292919eb04eb9a751b7747986f7351d562a64b9b9c9d7989eec344570e754b0461a34bb598c1ee262aef00";
    expect(web3.eth.accounts.recover(messageHash, signature, true)).to.be.equal("0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed");
  });

  it("recover with object", async () => {
    const messageHash = "0xf1d201623965f4a21390705e83ba1fb2c33600a529bd2fab2373c2558bf4cb5e";
    const signature = "0xce639afc9733cbffe7a2dd87e096856e5a81fc5094c9292919eb04eb9a751b7747986f7351d562a64b9b9c9d7989eec344570e754b0461a34bb598c1ee262aef00";
    expect(web3.eth.accounts.recover({messageHash, signature})).to.be.equal("0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed");
  });

});
