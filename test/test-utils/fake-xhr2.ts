import { expect } from 'chai'

interface Request {
    url?: string
    body?: object | null
}

interface CachedResponse {
    [index: string]: object
}

let cache: CachedResponse = {}
let request: Request  = {}
let response: object|null = null

const FakeXHR2 = function() {
    this.responseText = null
    this.readyState = 4
    this.status = 200
    this.onreadystatechange = null
    this.async = true
    this.headers = {
        'Content-Type': 'application/json',
    }
    this.host = ''
    request = {}
    response = null
}

FakeXHR2.prototype.setResponse = function(res: any) {
    response = res
}

FakeXHR2.prototype.extractRequest = function() {
    return request
}

FakeXHR2.prototype.setCachedResponse = function(url: string, res: object) {
    url = 'http://localhost:8669' + url
    cache[url] = res
}

FakeXHR2.prototype.clearCachedResponse = function() {
    cache = {}
}

FakeXHR2.prototype.open = function(method, host, async) {
    expect(method).to.be.oneOf(['GET', 'POST'])
    expect(!!host).to.be.equal(true)
    this.async = typeof async === 'boolean' ? async : true
    this.host = host
    request.url = host.replace('http://localhost:8669' , '')
}

FakeXHR2.prototype.setRequestHeader = function(name, value) {
    this.headers[name] = value
}

FakeXHR2.prototype.send = function(payload) {
    request.body = payload

    if (cache[this.host]) {
        response = cache[this.host]
    }

    if (response) {
        this.responseText = JSON.stringify(response)
    }

    // const ret = JSON.parse(payload)
    // if (ret && ret.type === 'invalid response text') {
    //     this.responseText = '{test'
    // } else if (ret && ret.type === 'timeout') {
    //     this.ontimeout()
    //     return
    // } else if (ret && ret.type === 'connect error') {
    //     throw new Error()
    // } else if (ret && ret.type === 'invalid status code') {
    //     this.status = 400
    // } else if (ret && ret.type === 'invalid status code with response text') {
    //     this.status = 400
    //     this.responseText = ret.responseText
    // } else if (ret && ret.type === 'wrong ready state') {
    //     this.readyState = 3
    // } else if (ret && ret.type === 'invalid response') {
    //     this.status = 0
    // } else {
    //     this.responseText = payload
    // }

    expect(payload === null || typeof payload === 'string').to.be.equal(true)
    if (this.async) {
        expect(this.onreadystatechange).to.be.a('function')
        this.onreadystatechange()
    }
}

module.exports = FakeXHR2
