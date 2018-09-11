'use strict'
const XHR2 = require('xhr2')

// Simple HTTP is an wrapper for xhr that only support JSON format
export type ResponseBody = object|string|null
export interface SimpleResponse {
    Code: number
    Body: ResponseBody
}
export enum Method {
    GET= 0,
    POST,
}

const post = function(url: string, body: object, timeout= 0) {
    return request(Method.POST, url, body, timeout)
}

const get = function(url: string, timeout = 0) {
    return request(Method.GET, url, null, timeout)
}

export const HTTP = {get, post}

const request = function(method: Method, url: string, body: object | null, timeout: number): Promise<SimpleResponse> {

    return new Promise((resolve, reject) => {
        const xhr = new XHR2()
        xhr.timeout = timeout
        xhr.open(Method[method], url)

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                const res: SimpleResponse = {
                    Code: xhr.status as number,
                    Body: null,
                }

                if (xhr.status === 200) {
                    try {
                        res.Body = JSON.parse(xhr.responseText)
                    } catch (e) {
                        return reject(new Error(`[thor-provider]Error parsing the response: ${e.message}`))
                    }
                } else if (xhr.responseText && xhr.responseText.length) {
                    res.Body = xhr.responseText
                }

                return resolve(res)
            }
        }

        xhr.ontimeout = () => {
            return reject(new Error(`[thor-provider]Time out for whatever reason, check your provider`))
        }

        try {
            xhr.send(method === Method.POST ? JSON.stringify(body) : null)
        } catch (e) {
            return reject(new Error(`[thor-provider]Connect error: ${e.message}`))
        }
    })
}
