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
    constructor(currency, secret, key) {
        this.currency = currency;
        this.secret = secret;
        this.key = key;
    }
    call(method, success, error) {
        basic_1.logger.debug(`${TAG} Calling public API method '${method}'`);
        unirest.get(DATA_API + this.currency + "/" + method)
            .headers("Accept", "application/json")
            .end(response => {
            try {
                basic_1.logger.debug(`${TAG} API method '${method}' returned\n${response.raw_body}`);
                success(JSON.parse(response.raw_body));
            }
            catch (ex) {
                basic_1.logger.error(`${TAG} API method '${method}' failed\n${JSON.stringify(ex)}`);
                error(`Unexpected error: ${ex}`);
            }
        });
    }
    callSecure(method, parameters, success, error) {
        basic_1.logger.debug(`${TAG} Calling secure API method '${method}' with parameters ${JSON.stringify(parameters)}`);
        const now = Math.round(new Date().getTime() / 1000);
        const queryString = qs.stringify(Object.assign({ "tapi_method": method, "tapi_nonce": now }, parameters));
        const signature = this.generateSignature(queryString, this.secret);
        unirest.post(TRADE_API)
            .headers({ "TAPI-ID": this.key })
            .headers({ "TAPI-MAC": signature })
            .send(queryString)
            .end(response => {
            if (response.statusCode < 400) {
                // Internal sucess code is code 100
                if (response.body.status_code === 100) {
                    basic_1.logger.debug(`${TAG} API method '${method}' returned\n${JSON.stringify(response.body.response_data)}`);
                    success(response.body.response_data);
                }
                else {
                    basic_1.logger.error(`${TAG} API method '${method}' failed\n${response.body.status_code}: ${response.body.error_message}`);
                    error(response.body.error_message);
                }
            }
            else {
                basic_1.logger.error(`${TAG} API method '${method}' received unexpected error: ${response.statusCode}`);
                error(`Unexpected error code: ${response.statusCode}`);
            }
        });
    }
    generateSignature(queryString, secret) {
        return crypto.createHmac("sha512", secret)
            .update(TRADE_PATH + "?" + queryString)
            .digest("hex");
    }
}
exports.Service = MercadoBitcoinService;
//# sourceMappingURL=mercadobitcoinService.js.map