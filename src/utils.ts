'use strict'

const formatBlockNumber = function (blockNumber: Number | String): Number|String {
  if (typeof blockNumber === 'number') {
    return blockNumber;
  } else if (typeof blockNumber === 'string') {
    if (blockNumber === 'earliest')
      return 0;
    else if (blockNumber === 'latest' || blockNumber === 'pending')
      return 'best';
    else
      return blockNumber;  
  } else {
    return 'best';
  }
}

export default {
  formatBlockNumber
};