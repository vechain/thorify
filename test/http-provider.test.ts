// "use strict";
// /* tslint:disable:max-line-length */
// import { expect } from "chai";
// import rewiremock from "rewiremock";

// // inject xhr2 with fake xhr2 to perform test
// rewiremock("xhr2").with(require("./test-utils/fake-xhr2"));
// rewiremock.enable();
// import { ThorHttpProvider } from "../src/http-provider";

// describe("http-provider", () => {

//   it("should throw error if called without empty host", () => {
//     expect(() => { const provider = new ThorHttpProvider(""); return provider; }).to.throw(Error);
//   });

//   it("not supported method should throw error", (done) => {
//     const provider = new ThorHttpProvider("host");
//     provider.sendAsync({
//       method: "not supported method",
//     }, (err) => {
//       try {
//         expect(err).to.be.an("error");
//         expect(() => { throw err; }).to.throw("Method not supported!");
//       } catch (e) {
//         return done(e);
//       }
//       done();
//     });
//   });

//   it("eth_sendTransaction method should throw error", (done) => {
//     const provider = new ThorHttpProvider("host");
//     provider.sendAsync({
//       method: "eth_sendTransaction",
//     }, (err) => {
//       try {
//         expect(err).to.be.an("error");
//         expect(() => { throw err; }).to.throw("The private key corresponding to from filed can\'t be found in local eth.accounts.wallet!");
//       } catch (e) {
//         return done(e);
//       }
//       done();
//     });
//   });

//   it("normal request should not throw error", (done) => {
//     const provider = new ThorHttpProvider("host");
//     provider.sendAsync({
//       method: "thor_test",
//     }, (err, ret) => {
//       try {
//         expect(err).to.not.be.an("error");
//       } catch (e) {
//         return done(e);
//       }
//       done();
//     });
//   });

//   it("normal request should return result", (done) => {
//     const provider = new ThorHttpProvider("host");
//     provider.sendAsync({
//       method: "thor_test",
//       testMethod: "POST",
//     }, (err, ret) => {
//       try {
//         expect(ret).to.have.property("result");
//         expect(ret.result).to.have.property("isThorified", true);
//       } catch (e) {
//         return done(e);
//       }
//       done();
//     });
//   });

//   it("invalid response text return throw error", (done) => {
//     const provider = new ThorHttpProvider("host");
//     provider.sendAsync({
//       method: "thor_test",
//       testMethod: "POST",
//       testBody: {
//         type: "invalid response text",
//       },
//     }, (err) => {
//       try {
//         expect(err).to.be.an("error");
//         expect(() => { throw err; }).to.throw("[thorify-provider-http] Error parsing the response :Unexpected token t in JSON at position 1");
//       } catch (e) {
//         return done(e);
//       }
//       done();
//     });
//   });

//   it("invalid response", (done) => {
//     const provider = new ThorHttpProvider("host");
//     provider.sendAsync({
//       method: "thor_test",
//       testMethod: "POST",
//       testBody: {
//         type: "invalid response",
//       },
//     }, (err) => {
//       try {
//         expect(err).to.be.an("error");
//         expect(() => { throw err; }).to.throw("[thorify-provider-http] Invalid response, check the host");
//       } catch (e) {
//         return done(e);
//       }
//       done();
//     });
//   });

//   it("isThorified with object", (done) => {
//     const provider = new ThorHttpProvider("host");
//     provider.sendAsync({
//       method: "thor_test",
//       testMethod: "POST",
//       testResult: {
//         test: true,
//       },
//     }, (err, ret) => {
//       try {
//         expect(ret).to.have.property("result");
//         expect(ret.result).to.have.property("isThorified", true);
//       } catch (e) {
//         return done(e);
//       }
//       done();
//     });
//   });

//   it("isThorified with array", (done) => {
//     const provider = new ThorHttpProvider("host");
//     provider.sendAsync({
//       method: "thor_test",
//       testMethod: "POST",
//       testResult: [{
//         test: true,
//       }],
//     }, (err, ret) => {
//       try {
//         expect(ret).to.have.property("result");
//         expect(ret.result[0]).to.have.property("isThorified", true);
//       } catch (e) {
//         return done(e);
//       }
//       done();
//     });
//   });

//   it("timeout", (done) => {
//     const provider = new ThorHttpProvider("host");
//     provider.sendAsync({
//       method: "thor_test",
//       testMethod: "POST",
//       testBody: {
//         type: "timeout",
//       },
//     }, (err) => {
//       try {
//         expect(err).to.be.an("Error");
//         expect(() => { throw err; }).to.throw("[thorify-provider-http] CONNECTION TIMEOUT:");
//       } catch (e) {
//         return done(e);
//       }
//       done();
//     });
//   });

//   it("connect error", (done) => {
//     const provider = new ThorHttpProvider("host");
//     provider.sendAsync({
//       method: "thor_test",
//       testMethod: "POST",
//       testBody: {
//         type: "connect error",
//       },
//     }, (err) => {
//       try {
//         expect(err).to.be.an("Error");
//         expect(() => { throw err; }).to.throw("[thorify-provider-http] CONNECTION ERROR: Couldn't connect to node");
//       } catch (e) {
//         return done(e);
//       }
//       done();
//     });
//   });

//   it("invalid status code", (done) => {
//     const provider = new ThorHttpProvider("host");
//     provider.sendAsync({
//       method: "thor_test",
//       testMethod: "POST",
//       testBody: {
//         type: "invalid status code",
//       },
//     }, (err) => {
//       try {
//         expect(err).to.be.an("Error");
//         expect(() => { throw err; }).to.throw("[thorify-provider-http] Invalid response code from provider:");
//       } catch (e) {
//         return done(e);
//       }
//       done();
//     });
//   });

//   it("invalid status code with response text", (done) => {
//     const provider = new ThorHttpProvider("host");
//     provider.sendAsync({
//       method: "thor_test",
//       testMethod: "POST",
//       testBody: {
//         type: "invalid status code with response text",
//         responseText: "bad request",
//       },
//     }, (err) => {
//       try {
//         expect(err).to.be.an("Error");
//         expect(() => { throw err; }).to.throw("[thorify-provider-http] Invalid response code from provider: 400, response: bad request");
//       } catch (e) {
//         return done(e);
//       }
//       done();
//     });
//   });

//   it("wrong ready state should not callback", (done) => {
//     const provider = new ThorHttpProvider("host");
//     provider.sendAsync({
//       method: "thor_test",
//       testMethod: "POST",
//       testBody: {
//         type: "wrong ready state",
//       },
//     }, () => {
//       done(new Error());
//     });
//     setTimeout(done, 50);
//   });

//   after(() => { rewiremock.disable(); });

// });
