'use strict'
import { EventCriteriaSet, LogQueryBody, LogQueryOptions, LogQueryRange, Order, StringOrNumber, TopicItem, topicName } from '../types'

import * as utils from './'

const OBJhas = (obj: Object, p: string)=>{
    return obj.hasOwnProperty(p)
}

export const fromETHBlockNumber = function (blockNumber: StringOrNumber): StringOrNumber {
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

export const fromETHBlockNumberOrHash = function (blockRevision: any): StringOrNumber {
    if (/^(-0x|0x)?[0-9a-fA-F]{64}$/i.test(blockRevision)) {
        return blockRevision
    } else {
        return fromETHBlockNumber(blockRevision)
    }
}

export const formatRange = function (range: any): LogQueryRange {
    const defaultUnit = 'block'
    
    const ret: LogQueryRange = {
        unit: range.unit || defaultUnit,
        from: 0,
        to: Number.MAX_SAFE_INTEGER
    }

    if (ret.unit !== 'block' && ret.unit !== 'time') {
        ret.unit = defaultUnit
    }


    if (range.unit === 'block') {
        if (OBJhas(range, 'from')) {
            const t = fromETHBlockNumber(range.from)
            if (t === 'best') {
                ret.from = Number.MAX_SAFE_INTEGER
            } else {
                ret.from = t as number
            }
        }
        if (OBJhas(range, 'to')) {
            const t = fromETHBlockNumber(range.to)
            if (t === 'best') {
                ret.to = Number.MAX_SAFE_INTEGER
            } else {
                ret.to = t as number
            }
        }
        return ret
    }

    if (OBJhas(range, 'from')) {
        const t = utils.toInteger(range.from)
        if (t !== null) {
            ret.from = t
        }
    }

    if (OBJhas(range, 'to')) {
        const t = utils.toInteger(range.to)
        if (t !== null) {
            ret.to = t
        }
    }

    return ret
}

export const formatOptions = function (options: any): LogQueryOptions {
    const ret: LogQueryOptions = {
        offset: 0,
        limit: utils.params.defaultLogLimit,
    }

    if (OBJhas(options, 'offset')) {
        const temp = utils.toInteger(options.offset)
        if (temp) { ret.offset = temp }
    }
    if (OBJhas(options, 'limit')) {
        const temp = utils.toInteger(options.limit)
        if (temp) { ret.limit = temp }
    }

    if (ret.limit > utils.params.maxLogLimit){
        ret.limit = utils.params.maxLogLimit
    }

    return ret
}

export const formatLogQuery = function (params: any): LogQueryBody {
    let address = ''
    let order: Order = 'ASC'
    if (params.address) {
        address = params.address
    }
    if (params.order && (params.order.toUpperCase() === 'ASC' || params.order.toUpperCase() === 'DESC')) {
        order = params.order.toUpperCase()
    }

    const body: LogQueryBody = {
        criteriaSet: [],
        order,
    }

    
    if (params.options) {
        body.options = formatOptions(params.options)
    }   

    // discard fromBlock and toBlock if range presents
    if (params.range) {
        body.range = formatRange(params.range)
    } else {
        const range = {
            unit: 'block',
            from: params.fromBlock || 0,
            to: params.toBlock || Number.MAX_SAFE_INTEGER
        }
        body.range = formatRange(range)
    }

    const topics: TopicItem[] = []

    if (params.topics && params.topics.length) {
        for (let i = 0; i < params.topics.length; i++) {
            if (typeof params.topics[i] === 'string') {
                topics.push({
                    name: 'topic' + i,
                    array: [params.topics[i]],
                })
            } else if (utils.isArray(params.topics[i]) && params.topics[i].length) {
                topics.push({
                    name: 'topic' + i,
                    array: params.topics[i],
                })
            }
        }
    }

    const outputTopic = function (inputTopics: TopicItem[], index: number, receiver: EventCriteriaSet[], current: EventCriteriaSet) {
        if (index === inputTopics.length) {
            const o = {}
            if (address) {
                current.address = address
            }
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
        outputTopic(topics, 0, body.criteriaSet, {})
    }

    if (!body.criteriaSet.length && address) {
        body.criteriaSet.push({
            address,
        })
    }

    return body
}
