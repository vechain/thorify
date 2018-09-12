'use strict'
export type StringOrNull = string | null
export type StringOrNumber = string | number
export type Callback = (err: Error | null, result?: any) => void

export interface ThorTransaction {
    chainTag?: number
    blockRef?: Buffer
    expiration?: StringOrNumber
    gasPriceCoef?: StringOrNumber
    gas?: string
    dependsOn?: Buffer | null
    nonce?: string
    signature?: string
    clauses: Clause[]
    origin?: string
    isThorified?: () => boolean
}

export interface Clause {
    to?: StringOrNull
    value: string
    data?: Buffer
}

export interface EthTransaction {
    chainId?: StringOrNumber
    to?: StringOrNull
    value?: string
    data?: string
    gas?: StringOrNumber
    gasPrice?: StringOrNumber
    nonce?: StringOrNumber
    // allow extra properties from thor's transaction model
    chainTag?: StringOrNumber
    blockRef?: StringOrNumber
    expiration?: StringOrNumber
    gasPriceCoef?: StringOrNumber
    dependsOn?: string
}

export type topicName = 'topic0' | 'topic1' | 'topic2' | 'topic3' | 'topic4'
export interface TopicItem {
    name: string
    array: [string]
}

export interface TopicSet {
    topic0?: string
    topic1?: string
    topic2?: string
    topic3?: string
    topic4?: string
}

export interface LogQueryBody {
    range?: LogQueryRange
    options?: LogQueryOptions
    topicSets: TopicSet[]
}

export interface LogQueryRange {
    unit?: string
    from?: number
    to?: number
}

export interface LogQueryOptions {
    offset?: number
    limit?: number
}

export interface LogFilterOptions {
    address?: string
    pos?: string
    t0?: string
    t1?: string
    t2?: string
    t3?: string
    t4?: string
}

export interface TransferFilterOptions {
    pos?: string
    txOrigin?: string
    sender?: string
    recipient?: string
}
