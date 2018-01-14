import { Service } from "../../../apis/mercadobitcoin/service"
import * as unirest from "unirest";
import * as querystring from "querystring";
import { logger } from "../../../logger/basic"
import { exec } from "child_process";
logger.transports["console"].silent = true

const currency = "LTC"
const secret = "123456"
const key = "QIWU1F7DY3BG"
const coinPair = "BTCBRL"
const dataApi = "DATAAPI.COM/"
const tradeApi = "TRADEAPI.COM"

const service = new Service(currency, secret, key, coinPair)
service.dataApi = dataApi
service.tradeApi = tradeApi

jest.mock("unirest")
unirest.get = jest.fn().mockReturnThis()
unirest.post = jest.fn().mockReturnThis()

describe("service tests", () => {

    it("data api must call correct api method", () => {

        unirest.headers = jest.fn().mockReturnThis()
        unirest.end = jest.fn().mockImplementationOnce((callback) => { })

        const method = "test"
        service.call("test")

        expect(unirest.get).toHaveBeenCalledTimes(1)
        expect(unirest.get.mock.calls[0][0]).toBe(dataApi + method)
    });

    it("data api must reject promise if json not parseable", () => {

        const resp = { "raw_body": "fail to fetch" }

        unirest.headers = jest.fn().mockReturnThis()

        unirest.end = jest.fn().mockImplementationOnce((callback) => {
            callback(resp)
        })

        expect(service.call("test")).rejects.toContain("Unexpected error")

        expect(unirest.end).toHaveBeenCalledTimes(1)
    });

    it("data api must resolve promise if json parseable", () => {

        const resp = { "raw_body": "{\"success\": true}" }

        unirest.headers = jest.fn().mockReturnThis()

        unirest.end = jest.fn().mockImplementationOnce((callback) => {
            callback(resp)
        })

        expect(service.call("test")).resolves.toEqual(JSON.parse(resp.raw_body))

        expect(unirest.end).toHaveBeenCalledTimes(1)
    });

    it("trade api must call correct api method", () => {

        unirest.headers = jest.fn().mockReturnThis()
        unirest.send = jest.fn().mockReturnThis()
        unirest.end = jest.fn().mockImplementationOnce((callback) => { })

        service.callSecure("test", {})

        expect(unirest.post).toHaveBeenCalledTimes(1)
        expect(unirest.post.mock.calls[0][0]).toBe(tradeApi)
    });

    it("trade api must reject promise if error", () => {

        const resp = { "statusCode": 400 }

        unirest.headers = jest.fn().mockReturnThis()
        unirest.send = jest.fn().mockReturnThis()

        unirest.end = jest.fn().mockImplementationOnce((callback) => {
            callback(resp)
        })

        expect(service.callSecure("test", {})).rejects.toContain("Unexpected error code")

        expect(unirest.end).toHaveBeenCalledTimes(1)
    });

    it("trade api must reject promise if api error", () => {

        const resp = { "statusCode": 200, "body": { "status_code": 500, "error_message": "failed" } }

        unirest.headers = jest.fn().mockReturnThis()
        unirest.send = jest.fn().mockReturnThis()

        unirest.end = jest.fn().mockImplementationOnce((callback) => {
            callback(resp)
        })

        expect(service.callSecure("test", {})).rejects.toContain("failed")

        expect(unirest.end).toHaveBeenCalledTimes(1)
    });

    it("trade api must resolve promise if success", () => {

        const resp = { "statusCode": 200, "body": { "status_code": 100, "response_data": "success!" } }

        unirest.headers = jest.fn().mockReturnThis()
        unirest.send = jest.fn().mockReturnThis()

        unirest.end = jest.fn().mockImplementationOnce((callback) => {
            callback(resp)
        })

        expect(service.callSecure("test", {})).resolves.toEqual("success!")

        expect(unirest.end).toHaveBeenCalledTimes(1)
    });

    it("trade api must call generate signature", () => {

        const resp = { "statusCode": 200, "body": { "status_code": 100, "response_data": "success!" } }

        unirest.headers = jest.fn().mockReturnThis()
        unirest.send = jest.fn().mockReturnThis()

        service.generateSignature = jest.fn()

        unirest.end = jest.fn().mockImplementationOnce((callback) => {
            callback(resp)
        })

        expect(service.callSecure("test", {})).resolves.toEqual("success!")

        expect(unirest.end).toHaveBeenCalledTimes(1)
        expect(service.generateSignature).toHaveBeenCalledTimes(1)
    });

    it("trade api must call headers with auth", () => {

        const resp = { "statusCode": 200, "body": { "status_code": 100, "response_data": "success!" } }

        unirest.headers = jest.fn().mockReturnThis()
        unirest.send = jest.fn().mockReturnThis()

        const signature = "sinature"
        service.generateSignature = jest.fn().mockReturnValue(signature)

        unirest.end = jest.fn().mockImplementationOnce((callback) => {
            callback(resp)
        })

        expect(service.callSecure("test", {})).resolves.toEqual("success!")

        expect(unirest.headers).toHaveBeenCalledTimes(1)
        expect(unirest.headers).toHaveBeenCalledWith({ "TAPI-ID": service.key, "TAPI-MAC": signature })
    });
})