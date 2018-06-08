import { expect } from "chai";

const FakeXHR2 = function() {
  this.responseText = undefined;
  this.readyState = 4;
  this.status = 200;
  this.onreadystatechange = null;
  this.async = true;
  this.headers = {
    "Content-Type": "text/plain",
  };
};

FakeXHR2.prototype.open = function(method, host, async) {
  expect(method).to.be.oneOf(["GET", "POST"]);
  expect(!!host).to.be.equal(true);
  this.async = async;
};

FakeXHR2.prototype.setRequestHeader = function(name, value) {
  this.headers[name] = value;
};

FakeXHR2.prototype.send = function(payload) {
  const ret = JSON.parse(payload);
  if (ret && ret.type === "invalid response text") {
    this.responseText = "{test";
  } else if (ret && ret.type === "timeout") {
    this.ontimeout();
    return;
  } else if (ret && ret.type === "connect error") {
    throw new Error();
  } else if (ret && ret.type === "invalid status code") {
    this.status = 400;
  } else if (ret && ret.type === "wrong ready state") {
    this.readyState = 3;
  } else {
    this.responseText = payload;
  }

  expect(payload === null || typeof payload === "string").to.be.equal(true);
  if (this.async) {
    expect(this.onreadystatechange).to.be.a("function");
    this.onreadystatechange();
  }
};

module.exports = FakeXHR2;
