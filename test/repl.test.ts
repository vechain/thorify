#!/usr/bin/env node
'use strict';

import ThorHttpProvider from '../src'
import replx = require('repl-x');
const Web3 = require('web3');

const thorProvider = new ThorHttpProvider('http://localhost:8669')
const web3 = new Web3(thorProvider);
const EnergyABI = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": false, "inputs": [{ "name": "_reciever", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalBurned", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "remaining", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_owner", "type": "address" }, { "indexed": true, "name": "_spender", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Approval", "type": "event" }];
const EnergyAddress = '0x0000000000000000000000000000456e65726779';

const energy = new web3.eth.Contract(EnergyABI, EnergyAddress);

web3.eth.accounts.wallet.add('0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65');
web3.eth.accounts.wallet.add('0x321d6443bc6177273b5abf54210fe806d451d6b7973bccc2384ef78bbcd0bf51');
web3.eth.accounts.wallet.add('0x2d7c882bad2a01105e36dda3646693bc1aaaa45b0ed63fb0ce23c060294f3af2');
web3.eth.accounts.wallet.add('0x593537225b037191d322c3b1df585fb1e5100811b71a6f7fc7e29cca1333483e');
web3.eth.accounts.wallet.add('0xca7b25fc980c759df5f3ce17a3d881d6e19a38e651fc4315fc08917edab41058');
web3.eth.accounts.wallet.add('0x88d2d80b12b92feaa0da6d62309463d20408157723f2d7e799b6a74ead9a673b');
web3.eth.accounts.wallet.add('0xfbb9e7ba5fe9969a71c6599052237b91adeb1e5fc0c96727b66e56ff5d02f9d0');
web3.eth.accounts.wallet.add('0x547fb081e73dc2e22b4aae5c60e2970b008ac4fc3073aebc27d41ace9c4f53e9');
web3.eth.accounts.wallet.add('0xc8c53657e41a8d669349fc287f57457bd746cb1fcfc38cf94d235deb2cfca81b');
web3.eth.accounts.wallet.add('0x87e0eba9c86c494d98353800571089f316740b0cb84c9a7cdf2fe5c9997c7966');

thorProvider.extend(web3);

replx.start({ prompt: 'Thor# ' }, () => { return { web3,energy} });