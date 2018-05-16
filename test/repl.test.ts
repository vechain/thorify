#!/usr/bin/env node
"use strict";
/* tslint:disable:max-line-length */

import replx = require("repl-x");
import { thorify} from "../src";
const Web3 = require("web3");

const web3 = new Web3();

thorify(web3, "http://localhost:8669");

const EnergyABI = [{ constant: true, inputs: [], name: "name", outputs: [{ name: "", type: "string" }], payable: false, stateMutability: "pure", type: "function" }, { constant: false, inputs: [{ name: "_reciever", type: "address" }, { name: "_amount", type: "uint256" }], name: "approve", outputs: [{ name: "success", type: "bool" }], payable: false, stateMutability: "nonpayable", type: "function" }, { constant: true, inputs: [], name: "totalSupply", outputs: [{ name: "", type: "uint256" }], payable: false, stateMutability: "view", type: "function" }, { constant: false, inputs: [{ name: "_from", type: "address" }, { name: "_to", type: "address" }, { name: "_amount", type: "uint256" }], name: "transferFrom", outputs: [{ name: "success", type: "bool" }], payable: false, stateMutability: "nonpayable", type: "function" }, { constant: true, inputs: [], name: "decimals", outputs: [{ name: "", type: "uint8" }], payable: false, stateMutability: "pure", type: "function" }, { constant: true, inputs: [{ name: "_owner", type: "address" }], name: "balanceOf", outputs: [{ name: "balance", type: "uint256" }], payable: false, stateMutability: "view", type: "function" }, { constant: true, inputs: [], name: "symbol", outputs: [{ name: "", type: "string" }], payable: false, stateMutability: "pure", type: "function" }, { constant: false, inputs: [{ name: "_to", type: "address" }, { name: "_amount", type: "uint256" }], name: "transfer", outputs: [{ name: "success", type: "bool" }], payable: false, stateMutability: "nonpayable", type: "function" }, { constant: true, inputs: [], name: "totalBurned", outputs: [{ name: "", type: "uint256" }], payable: false, stateMutability: "view", type: "function" }, { constant: true, inputs: [{ name: "_owner", type: "address" }, { name: "_spender", type: "address" }], name: "allowance", outputs: [{ name: "remaining", type: "uint256" }], payable: false, stateMutability: "view", type: "function" }, { anonymous: false, inputs: [{ indexed: true, name: "_from", type: "address" }, { indexed: true, name: "_to", type: "address" }, { indexed: false, name: "_value", type: "uint256" }], name: "Transfer", type: "event" }, { anonymous: false, inputs: [{ indexed: true, name: "_owner", type: "address" }, { indexed: true, name: "_spender", type: "address" }, { indexed: false, name: "_value", type: "uint256" }], name: "Approval", type: "event" }];
const EnergyAddress = "0x0000000000000000000000000000456e65726779";

const energy = new web3.eth.Contract(EnergyABI, EnergyAddress);

web3.eth.accounts.wallet.add("0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65");
web3.eth.accounts.wallet.add("0x321d6443bc6177273b5abf54210fe806d451d6b7973bccc2384ef78bbcd0bf51");
web3.eth.accounts.wallet.add("0x2d7c882bad2a01105e36dda3646693bc1aaaa45b0ed63fb0ce23c060294f3af2");
web3.eth.accounts.wallet.add("0x593537225b037191d322c3b1df585fb1e5100811b71a6f7fc7e29cca1333483e");
web3.eth.accounts.wallet.add("0xca7b25fc980c759df5f3ce17a3d881d6e19a38e651fc4315fc08917edab41058");
web3.eth.accounts.wallet.add("0x88d2d80b12b92feaa0da6d62309463d20408157723f2d7e799b6a74ead9a673b");
web3.eth.accounts.wallet.add("0xfbb9e7ba5fe9969a71c6599052237b91adeb1e5fc0c96727b66e56ff5d02f9d0");
web3.eth.accounts.wallet.add("0x547fb081e73dc2e22b4aae5c60e2970b008ac4fc3073aebc27d41ace9c4f53e9");
web3.eth.accounts.wallet.add("0xc8c53657e41a8d669349fc287f57457bd746cb1fcfc38cf94d235deb2cfca81b");
web3.eth.accounts.wallet.add("0x87e0eba9c86c494d98353800571089f316740b0cb84c9a7cdf2fe5c9997c7966");

const testContract = new web3.eth.Contract([{ constant: false, inputs: [{ name: "_tokenAddr", type: "address" }, { name: "_tokenSupplier", type: "address" }, { name: "_to", type: "address[]" }, { name: "_value", type: "uint256[]" }], name: "distribute", outputs: [{ name: "_success", type: "bool" }], payable: false, stateMutability: "nonpayable", type: "function" }, { constant: true, inputs: [], name: "owner", outputs: [{ name: "", type: "address" }], payable: false, stateMutability: "view", type: "function" }, { constant: false, inputs: [{ name: "newOwner", type: "address" }], name: "transferOwnership", outputs: [], payable: false, stateMutability: "nonpayable", type: "function" }, { inputs: [], payable: false, stateMutability: "nonpayable", type: "constructor" }, { anonymous: false, inputs: [{ indexed: true, name: "previousOwner", type: "address" }, { indexed: true, name: "newOwner", type: "address" }], name: "OwnershipTransferred", type: "event" }]);

const deploy = testContract.deploy({
  data: "0x608060405234801561001057600080fd5b5060008054600160a060020a033316600160a060020a03199091161790556103808061003d6000396000f3006080604052600436106100565763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416630e054260811461005b5780638da5cb5b14610113578063f2fde38b14610144575b600080fd5b34801561006757600080fd5b5060408051602060046044358181013583810280860185019096528085526100ff958335600160a060020a039081169660248035909216963696956064959294930192829185019084908082843750506040805187358901803560208181028481018201909552818452989b9a9989019892975090820195509350839250850190849080828437509497506101679650505050505050565b604080519115158252519081900360200190f35b34801561011f57600080fd5b506101286102ad565b60408051600160a060020a039092168252519081900360200190f35b34801561015057600080fd5b50610165600160a060020a03600435166102bc565b005b60008054819033600160a060020a0390811691161461018557600080fd5b825184511461019357600080fd5b8351609610156101a257600080fd5b5060005b83518160ff1610156102a15785600160a060020a03166323b872dd86868460ff168151811015156101d357fe5b90602001906020020151868560ff168151811015156101ee57fe5b6020908102909101810151604080517c010000000000000000000000000000000000000000000000000000000063ffffffff8816028152600160a060020a03958616600482015293909416602484015260448301529151606480830193928290030181600087803b15801561026257600080fd5b505af1158015610276573d6000803e3d6000fd5b505050506040513d602081101561028c57600080fd5b5051151560011461029957fe5b6001016101a6565b50600195945050505050565b600054600160a060020a031681565b60005433600160a060020a039081169116146102d757600080fd5b600160a060020a03811615156102ec57600080fd5b60008054604051600160a060020a03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a36000805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a03929092169190911790555600a165627a7a723058204eaf121c508d7c1a7bd36ef137fb7de02bc6c7ead2d51428b359c7077e921dd50029",
});

// web3.eth.sendTransaction({from: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed', to:'0xd3ae78222beadb038203be21ed5ce7c9b1bff602', value: '100', chainTag:'0x50', blockRef:'0x00000001', gas: 21000, nonce: 100})
// web3.eth.sendTransaction({ from: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed', to: '0xd3ae78222beadb038203be21ed5ce7c9b1bff602', value: '100', gas: 21000, nonce: 100 })
// energy.methods.transfer('0xd3ae78222beadb038203be21ed5ce7c9b1bff602', 100).send({from: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed', gas: 210000, nonce: 100 })
// deploy.send({from: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed', gas: 4700000, nonce: 100 })

replx.start({ prompt: "Thor# " }, () => {
  return {
    eth: web3.eth,
    energy,
    web3,
    deploy,
  };
});
