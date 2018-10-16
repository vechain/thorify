'use strict'
import { LogQueryBody, LogQueryOptions, LogQueryRange, StringOrNumber, TopicItem, topicName, TopicSet } from '../types'

import * as utils from './'

export const fromETHBlockNumber = function(blockNumber: StringOrNumber): StringOrNumber {
    if (typeof blockNumber === 'number') {
        return blockNumber
    } else if (typeof blockNumber === 'string') {
        if (blockNumber === 'earliest') {
            return 0
        } else if (blockNumber === 'latest' || blockNumber === 'pending') {
            return 'best'
        } else {
            const num = utils.toInteger(blockNumber)
            return num || num === 0 ? num : 'best'
        }
    } else {
        return 'best'
    }
}

export const fromETHBlockNumberOrHash = function(blockRevision: any): StringOrNumber {
    if (/^(-0x|0x)?[0-9a-fA-F]{64}$/i.test(blockRevision)) {
        return blockRevision
    } else {
        return fromETHBlockNumber(blockRevision)
    }
}

export const formatRange = function(range: any): LogQueryRange | null {
    const ret: LogQueryRange = {}
    if (range.unit !== 'block' && range.unit !== 'time') {
        return null
    } else {
        ret.unit = range.unit
    }
    if (range.hasOwnProperty('from')) {
        const temp = fromETHBlockNumber(range.from)
        if (temp !== 'best') { ret.from = temp as number } else { ret.from = 0 }
    } else {
        ret.from = 0
    }
    if (range.hasOwnProperty('to')) {
        const temp = utils.fromETHBlockNumber(range.to)
        if (temp !== 'best') { ret.to = temp as number } else { ret.to = Number.MAX_SAFE_INTEGER }
    } else {
        ret.to = Number.MAX_SAFE_INTEGER
    }

    return ret
}

export const formatOptions = function(options: any): LogQueryOptions | null {
    const ret: LogQueryOptions = {}
    if (options.hasOwnProperty('limit')) {
        const temp = utils.toInteger(options.limit)
        if (temp) { ret.limit = temp }
    }
    if (options.hasOwnProperty('offset')) {
        const temp = utils.toInteger(options.offset)
        if (temp) { ret.offset = temp }
    }
    if (ret.hasOwnProperty('limit') || ret.hasOwnProperty('offset')) {
        return ret
    } else {
        return null
    }
}

export const formatLogQuery = function(params: any): LogQueryBody {
    const body: LogQueryBody = {
        topicSets: [],
    }

    if (params.range) {
        const ret = formatRange(params.range)
        if (ret) {
            body.range = ret
        }
    }

    if (params.options) {
        const ret = formatOptions(params.options)
        if (ret) {
            body.options = ret
        }
    }

    if (!body.range && (params.hasOwnProperty('fromBlock') || params.hasOwnProperty('toBlock'))) {

        body.range = {
            unit: 'block',
        }

        if (params.hasOwnProperty('fromBlock')) {
            body.range.from = params.fromBlock
        }

        if (params.hasOwnProperty('toBlock')) {
            body.range.to = params.toBlock
        }

        body.range = formatRange(body.range) as LogQueryRange

    }

    body.topicSets = []
    const topics: TopicItem[] = []

    if (params.topics && params.topics.length) {
        for (let i = 0; i < params.topics.length; i++) {
            if (typeof params.topics[i] === 'string') {
                topics.push({
                    name: 'topic' as topicName + i,
                    array: [params.topics[i]],
                })
            } else if (utils.isArray(params.topics[i]) && params.topics[i].length) {
                topics.push({
                    name: 'topic' as topicName + i,
                    array: params.topics[i],
                })
            }
        }
    }

    const outputTopic = function(inputTopics: TopicItem[], index: number, receiver: TopicSet[], current: TopicSet) {
        if (index === inputTopics.length) {
            const o = {}
            Object.assign(o, current)
            receiver.push(o)
            return
        }
        for (const item of inputTopics[index].array) {
            current[inputTopics[index].name as topicName] = item
            outputTopic(inputTopics, index + 1, receiver, current)
        }
    }

    if (topics.length) {
        outputTopic(topics, 0, body.topicSets, {})
    }

    return body
}
