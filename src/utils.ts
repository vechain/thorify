'use strict'

const MaxUint32 = Math.pow(2, 32) - 1;

const isArray = function (o: any) {
  return Object.prototype.toString.call(o) == '[object Array]';
}

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

const formatRange = function (range: any): any{
  let ret:any;
  if (range.unit !== 'block' && range.unit !== 'time')
    return null;
  ret.unit = range.unit;

  try {
    let from = formatBlockNumber(range.from)
    if (from !== 'best')
      ret.from = Number.parseInt(<string>from)
  } catch {
    ret.from = 0
  }
  try {
    let to = formatBlockNumber(range.to)
    if (to !== 'best')
      ret.to = Number.parseInt(range.to)
  } catch{
    ret.to = MaxUint32
  }
  return ret;
}

const formatOptions = function (options: any): any{
  let ret: any
  if (options.limit) {
    try {
      ret.limit = Number.parseInt(options.limit)
    } finally {}
  }
  if (options.offset) {
    try {
      ret.offset = Number.parseInt(options.offset)
    } finally { }
  }
  return ret;
}

const formatLogQuery = function (params: any): any {
  let body: any = {}
  
  if (params.range) {
    let ret = formatRange(params.range);
    ret && (body.range = ret);
  }

  if (params.options) {
    let ret = formatOptions(params.options);
    ret && (body.options = ret);
  }

  if (!body.range) {
    if (params.fromBlock) {
      try {
        let from = formatBlockNumber(params.fromBlock)
        if (from !== 'best') {
          body.range = body.range ? body.range : {}
          body.range.from = Number.parseInt(<string>from)
        }
      } finally{}
    }
    if (params.toBlock) {
      try {
        let to = formatBlockNumber(params.toBlock)
        if (to !== 'best') {
          body.range = body.range ? body.range : {}
          body.range.to = Number.parseInt(<string>to)
        }
      } finally{}
    }
    if (body.range)
      body.range.unit = 'block'
  }

  body.topicSets = [];
  let topics: Array<{name: string;array: [string]}> = [];

  for (let i = 0; i < params.topics.length; i++) {
    if(typeof params.topics[i] === 'string') {
      topics.push({
        name: 'topic' + i,
        array: [params.topics[i]]
      });
    } else if (isArray(params.topics[i]) && params.topics[i].length) {
      topics.push({
        name: 'topic' + i,
        array: params.topics[i]
      });
    }
  }

  let outputTopic = function (topics: any, index: number, receiver: any, current: any) {
    if (index == topics.length) {
      let o = {};
      Object.assign(o, current);
      receiver.push(o);
      return;
    }
    for (let item of topics[index].array) {
      current[topics[index].name] = item;
      outputTopic(topics, index + 1, receiver, current);
    }
  }

  if (topics.length) {
    outputTopic(topics, 0, body.topicSets, {});
  }
  
  return body;
}

export default {
  formatBlockNumber,
  formatLogQuery
}