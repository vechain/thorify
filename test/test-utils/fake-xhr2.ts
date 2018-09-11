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
let responseBody: object | null = null
let responseCode = -1
let errorType: null | 'ParseError' | 'TimeoutError' | 'ConnectError' = null

class FakeXHR2 {
    public responseText: string | null
    public readyState: number
    public status: number
    public onreadystatechange: any
    public async: boolean
    public headers: object
    public host: string

    constructor() {
        this.responseText = null
        this.readyState = 4
        this.status = 200
        this.onreadystatechange = null
        this.async = true
        this.headers = {
            'Content-Type': 'application/json',
        }
        this.host = ''
    }

    public setResponse = function(res: any, status = 200) {
        responseBody = res
        responseCode = status
    }

    public extractRequest = function() {
        return request
    }

    public setCachedResponse = function(url: string, res: object) {
        url = 'http://localhost:8669' + url
        cache[url] = res
    }

    public clearCachedResponse = function() {
        cache = {}
    }

    public open = function(method, host, async) {
        expect(method).to.be.oneOf(['GET', 'POST'])
        expect(!!host).to.be.equal(true)
        this.async = typeof async === 'boolean' ? async : true
        this.host = host
        request.url = host.replace('http://localhost:8669', '')
    }

    public setRequestHeader = function(name, value) {
        this.headers[name] = value
    }

    public resetMockData = function() {
        responseBody = null
        responseCode = -1
        request = {}
        errorType = null

        this.status = 200
        this.responseText = null
    }

    public setError = function(error: 'ParseError'| 'TimeoutError'|'ConnectError') {
        errorType = error
    }

    public send = function(payload) {
        request.body = JSON.parse(payload)

        if (cache[this.host]) {
            responseBody = cache[this.host]
        }

        if (responseBody) {
            this.responseText = JSON.stringify(responseBody)
        }

        if (responseCode !== -1) {
            this.status = responseCode
        }

        if (errorType === 'ParseError') {
            this.responseText = '{test'
            this.status = 200
        }

        if (errorType === 'TimeoutError') {
            this.ontimeout()
            return
        }

        if (errorType === 'ConnectError') {
            throw new Error('send failed')
        }

        expect(payload === null || typeof payload === 'string').to.be.equal(true)
        if (this.async) {
            expect(this.onreadystatechange).to.be.a('function')
            this.readyState = 3
            this.onreadystatechange()
            this.readyState = 4
            this.onreadystatechange()
        }
    }
}

export = FakeXHR2
