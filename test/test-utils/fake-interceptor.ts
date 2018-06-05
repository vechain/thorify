"use strict";

export const ThorAPIMapping = {
  eth_getBlockByNumber: {ret: {}},
  eth_getBlockByHash: {ret: {}},
  eth_blockNumber: {ret: {}},
  eth_getBalance: {ret: {}},
  eth_getEnergy: {ret: {}},
  eth_getCode: {ret: {}},
  eth_getStorageAt: {ret: {}},
  eth_sendRawTransaction: {ret: {}},
  eth_getTransactionByHash: {ret: {}},
  eth_getTransactionReceipt: {ret: {}},
  eth_call: {ret: {}},
  eth_estimateGas: {ret: {}},
  eth_getLogs: {
    ret: [{
        address: "0x3becba56f35eea87ab3f6e299d431c7dee90405f",
        topics: [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x0000000000000000000000001c7931f18c027ace696e4e8e33ff899a367a22dd",
          "0x000000000000000000000000e0d0dc778dcbb24d909686b90b63cc574af17b8a",
        ],
        data: "0x0000000000000000000000000000000000000000000000000001eefc517ec733",
        blockNumber: "0x56e87f",
        transactionHash: "0xac0218329ba219e2c1882257f2b75c04692f7fbc74d96cb0e7affa9a5d27e6d1",
        transactionIndex: "0x13",
        blockHash: "0xf7e2fb83191da98ab0dbc59596113058ed5d393634c87b5efac7f609bf010538",
        logIndex: "0x7",
        removed: false,
      }],
  },
  eth_getBlockRef: {ret: {}},
  eth_getChainTag: {ret: {}},
};
