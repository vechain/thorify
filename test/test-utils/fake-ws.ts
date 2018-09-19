'use strict'
import { EventEmitter } from 'eventemitter3'

let data: object | null = null
let error: string | null = null
let url: string | null = null
let isClose: boolean|null = null

class FakeWebSocket extends EventEmitter {
    private interval: NodeJS.Timer

    constructor(wsEndpoint: string) {
        super()
        if (wsEndpoint) {
            url = wsEndpoint.replace('ws://localhost:8669', '')
        }
        this.startMockLoop()
        setTimeout(() => {
            this.emit('open')
        }, 10)
    }

    set onopen(value) {
        this.removeListener('open')
        this.addListener('open', value)
    }

    set onclose(value) {
        this.removeListener('close')
        this.addListener('close', value)
    }

    set onmessage(value) {
        this.removeListener('')
        this.addListener('message', value)
    }

    set onerror(value) {
        this.removeListener('error')
        this.addListener('error', value)
    }

    public resetMockData() {
        data = null
        error = null
        url = null
        isClose = null
    }

    public extractURL() {
        return url
    }

    public emitData(messagePayload: object) {
        data = messagePayload
    }

    public emitAnything(message: any) {
        data = message
    }

    public emitError(errorMessage: string) {
        error = errorMessage
    }

    public emitClose() {
        isClose = true
    }

    public close() {
        this.stopMockLoop()
        setTimeout(() => {
            this.emit('close', { code: 1001, reaseon: 'closed' })
        }, 100)
    }

    private startMockLoop() {
        this.interval = setInterval(() => {
            if (data) {
                this.emit('message', { data: JSON.stringify(data) })
                data = null
            }
            if (error) {
                this.emit('error', {error})
                error = null
            }
            if (isClose) {
                this.close()
                isClose = null
            }
        }, 20)
    }

    private stopMockLoop() {
        if (this.interval) {
            clearInterval(this.interval)
        }
    }

}

export = FakeWebSocket
