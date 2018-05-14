"use strict";
const blake = require("blakejs");
const elliptic = require("elliptic");
const EthLib = require("eth-lib/lib");

const secp256k1 = new elliptic.ec("secp256k1");

export const hash = function(input: string | Buffer): string {
  return "0x" + blake.blake2bHex(input, null, 32);
};

export const sign = function(hash: Buffer, privateKey: Buffer): string {
  const signature = secp256k1.keyFromPrivate(privateKey).sign(hash, { canonical: true });
  return "0x" + Buffer.concat([signature.r.toBuffer(), signature.s.toBuffer(), Buffer.from([signature.recoveryParam])]).toString("hex"); /* tslint:disable:max-line-length */
};

export const recover = function(hash: Buffer, sig: Buffer): string {
  const recovery = sig[64];
  const signature = {
    r: sig.slice(0, 32),
    s: sig.slice(32, 64),
  };

  const ecPublicKey = secp256k1.recoverPubKey(hash, signature, recovery);
  const publicKey = "0x" + ecPublicKey.encode("hex", false).slice(2);
  const publicHash = EthLib.hash.keccak256(publicKey);
  const address = EthLib.account.toChecksum("0x" + publicHash.slice(-40));
  return address;
};
