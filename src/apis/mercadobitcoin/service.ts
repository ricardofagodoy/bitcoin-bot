import * as unirest from "unirest";
import * as crypto from "crypto";
import * as qs from "querystring";
import { logger } from "../../logger/basic"

const TAG = "[API MercadoBitcoinService]"

const DATA_API = "https://www.mercadobitcoin.com.br/api/";
const TRADE_PATH = "/tapi/v3/";
const TRADE_API = "https://www.mercadobitcoin.net" + TRADE_PATH;

class MercadoBitcoinService {

    dataApi: string
    tradeApi: string
    tradePath: string

    constructor(public currency: string, public secret: string, public key: string, public coinPair: string) {
        this.dataApi = DATA_API + currency + "/"
        this.tradeApi = TRADE_API
        this.tradePath = TRADE_PATH
    }

    call(method: string): Promise<any> {

        logger.debug(`${TAG} Calling public API method '${method}'`)

        return new Promise((resolve, reject) => {

            unirest.get(this.dataApi + method)
                .headers("Accept", "application/json")
                .end(response => {
                    try {
                        logger.debug(`${TAG} API method '${method}' returned\n${response.raw_body}`)
                        resolve(JSON.parse(response.raw_body));

                    } catch (ex) {
                        logger.error(`${TAG} API method '${method}' failed\n${JSON.stringify(ex)}`)
                        reject(`Unexpected error: ${ex}`)
                    }
                })
        })
    }

    callSecure(method: string, parameters: any): Promise<any> {

        logger.debug(`${TAG} Calling secure API method '${method}' with parameters ${JSON.stringify(parameters)}`)

        const requestBody = qs.stringify({
            "tapi_method": method,
            "tapi_nonce": Math.round(new Date().getTime() / 1000),
            "coin_pair": this.coinPair,
            ...parameters
        });

        const signature = this.generateSignature(requestBody, this.secret);

        return new Promise((resolve, reject) => {

            unirest.post(this.tradeApi)
                .headers({ "TAPI-ID": this.key, "TAPI-MAC": signature })
                .send(requestBody)
                .end(response => {
                    if (response.statusCode < 400) {
                        if (response.body.status_code === 100) {
                            logger.debug(`${TAG} API method '${method}' returned\n${JSON.stringify(response.body.response_data)}`)
                            resolve(response.body.response_data);
                        } else {
                            logger.error(`${TAG} API method '${method}' failed\n${response.body.status_code}: ${response.body.error_message}`)
                            reject(response.body.error_message)
                        }
                    } else {
                        logger.error(`${TAG} API method '${method}' received unexpected error: ${response.statusCode}`);
                        reject(`Unexpected error code: ${response.statusCode}`)
                    }
                })
        })
    }

    generateSignature(requestBody: string, secret: string): string {
        return crypto.createHmac("sha512", secret)
            .update(TRADE_PATH + "?" + requestBody)
            .digest("hex");
    }
}

export { MercadoBitcoinService as Service }