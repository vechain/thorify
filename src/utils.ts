'use strict'

const formatBlockNumber = function (blockNumber: Number | String): Number|String {
  if (typeof blockNumber === 'number') {
    return blockNumber;
  } else if (typeof blockNumber === 'string') {
    if (blockNumber === 'earliest')
      return 0;
    else
      return 'best';  
  } else {
    return 'best';
  }
}

export default {
  formatBlockNumber
};