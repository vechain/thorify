"use strict";
const XHR2 = require("xhr2");

type Method = "GET" | "POST";
interface SimpleResponse {
    Code: number;
    ResponseBody: object|null;
}

// Simple HTTP is an wrapper for xhr that only support JSON format
class SimpleHTTP {
    private timeout: number;

    constructor(timeout = 0) {
        this.timeout = timeout;
    }

    public post(url: string, body: object) {
        return this.request("POST", url, body);
    }

    public get(url: string) {
        return this.request("GET", url, null);
    }

    private request(method: Method, url: string, body: object|null): Promise<SimpleResponse> {

        return new Promise((resolve, reject) => {
            const xhr = new XHR2();
            xhr.timeout = this.timeout;
            xhr.open(method, url);

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {

                    const res: SimpleResponse = {
                        Code: xhr.status as number,
                        ResponseBody: null,
                    };

                    if (xhr.responseText) {
                        try {
                            res.ResponseBody = JSON.parse(xhr.responseText);
                        } catch (e) {
                            return reject(new Error(`[thorify-provider]Error parsing the response: ${ e.message }`));
                        }
                    }

                    return resolve(res);
                }
            };

            xhr.ontimeout = () => {
                return reject(new Error(`[thorify-provider]Time out for whatever reason, check your provider).`));
            };

            try {
                xhr.send(method === "POST" ? JSON.stringify(body) : null);
            } catch (e) {
                return reject(new Error(`[thorify-provider]Connect error: ${e.message }`));
            }
        });

    }
}

export {SimpleHTTP};
