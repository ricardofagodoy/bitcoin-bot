"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unirest = require("unirest");
const crypto = require("crypto");
const qs = require("querystring");
const basic_1 = require("../../logger/basic");
const TAG = "[API MercadoBitcoinService]";
const DATA_API = "https://www.mercadobitcoin.com.br/api/";
const TRADE_PATH = "/tapi/v3/";
const TRADE_API = "https://www.mercadobitcoin.net" + TRADE_PATH;
class MercadoBitcoinService {
    constructor(currency, secret, key, coinPair) {
        this.currency = currency;
        this.secret = secret;
        this.key = key;
        this.coinPair = coinPair;
        this.dataApi = DATA_API + currency + "/";
        this.tradeApi = TRADE_API;
        this.tradePath = TRADE_PATH;
    }
    call(method) {
        basic_1.logger.debug(`${TAG} Calling public API method '${method}'`);
        return new Promise((resolve, reject) => {
            unirest.get(this.dataApi + method)
                .headers("Accept", "application/json")
                .end(response => {
                try {
                    basic_1.logger.debug(`${TAG} API method '${method}' returned\n${response.raw_body}`);
                    resolve(JSON.parse(response.raw_body));
                }
                catch (ex) {
                    basic_1.logger.error(`${TAG} API method '${method}' failed\n${JSON.stringify(ex)}`);
                    reject(`Unexpected error: ${ex}`);
                }
            });
        });
    }
    callSecure(method, parameters) {
        basic_1.logger.debug(`${TAG} Calling secure API method '${method}' with parameters ${JSON.stringify(parameters)}`);
        const requestBody = qs.stringify(Object.assign({ "tapi_method": method, "tapi_nonce": Math.round(new Date().getTime() / 1000), "coin_pair": this.coinPair }, parameters));
        const signature = this.generateSignature(requestBody, this.secret);
        return new Promise((resolve, reject) => {
            unirest.post(this.tradeApi)
                .headers({ "TAPI-ID": this.key, "TAPI-MAC": signature })
                .send(requestBody)
                .end(response => {
                if (response.statusCode < 400) {
                    if (response.body.status_code === 100) {
                        basic_1.logger.debug(`${TAG} API method '${method}' returned\n${JSON.stringify(response.body.response_data)}`);
                        resolve(response.body.response_data);
                    }
                    else {
                        basic_1.logger.error(`${TAG} API method '${method}' failed\n${response.body.status_code}: ${response.body.error_message}`);
                        reject(response.body.error_message);
                    }
                }
                else {
                    basic_1.logger.error(`${TAG} API method '${method}' received unexpected error: ${response.statusCode}`);
                    reject(`Unexpected error code: ${response.statusCode}`);
                }
            });
        });
    }
    generateSignature(requestBody, secret) {
        return crypto.createHmac("sha512", secret)
            .update(TRADE_PATH + "?" + requestBody)
            .digest("hex");
    }
}
exports.Service = MercadoBitcoinService;
//# sourceMappingURL=service.js.map