import * as unirest from "unirest";
import * as crypto from "crypto";
import * as qs from "querystring";
import { logger } from "../../logger/basic"

import { Api } from "apis/Api"
import { Tick, BookOrders, Trade, Balance, Order } from "types/api/types"

const TAG = "[API MercadoBitcoin]"

// https://www.mercadobitcoin.com.br/api-doc/
const DATA_API = "https://www.mercadobitcoin.com.br/api/";

// https://www.mercadobitcoin.com.br/trade-api/
const TRADE_PATH = "/tapi/v3/";
const TRADE_API = "https://www.mercadobitcoin.net" + TRADE_PATH;

type Config = {
    currency: string, // "BTC" | "LTC" | "BCH",
    key?: string,
    secret?: string,
    pin?: string
    coinPair?: string
}

class MercadoBitcoin implements Api {

    private config: Config;

    constructor(config: Config) {
        this.config = config;

        // BRLBTC, BRLLTC or BRLBCH
        this.config.coinPair = "BRL" + config.currency;

        logger.info(`${TAG} created with following configuration:\n${this.config}`)
    }

    getCurrency(): string {
        return this.config.currency
    }

    setCurrency(currency: string): boolean {
        this.config.currency = currency;
        return true
    }

    ticker(success: (data: Tick) => void): void {
        this.callDataApi("ticker", json => {
            success({
                high: json.ticker.high,
                low: json.ticker.low,
                last: json.ticker.last,
                timestamp: json.ticker.date
            })
        })
    }

    orderBook(success: (data: BookOrders) => void): void {
        this.callDataApi("orderbook", json => success(json))
    }

    trades(success: (data: Array<Trade>) => void): void {
        this.callDataApi("trades", json => success(json))
    }

    accountBalance(success: (data: Array<Balance>) => void, error: Function): void {
        this.callSecure("get_account_info", {}, (json) => {

            const balances = json.balance
            const data: Balance[] = []

            for (let key in Object.keys(balances)) {
                data.push({
                    currency: key,
                    available: balances[key].available,
                    total: balances[key].total
                })
            }

            success(data)

        }, error);
    }

    myOrders(success: (data: Array<Order>) => void, error: Function, parameters?: {}): void {
        this.callSecure("list_orders", {
            coin_pair: this.config.coinPair,
            ...parameters
        }, json => {
            success(json.orders)
        }, error);
    }

    placeBuyOrder(quantity: number, limitPrice: number, success: (data: Order) => void, error: Function): void {
        this.callSecure("place_buy_order", {
            coin_pair: this.config.coinPair,
            quantity: quantity.toString().substr(0, 10),
            limit_price: limitPrice
        }, json => success(json.order), error);
    }

    placeSellOrder(quantity: number, limitPrice: number, success: (data: Order) => void, error: Function): void {
        this.callSecure("place_sell_order", {
            coin_pair: this.config.coinPair,
            quantity: quantity.toString().substr(0, 10),
            limit_price: limitPrice
        }, json => success(json.order), error);
    }

    cancelOrder(orderId: number, success: (data: Order) => void, error: Function): void {
        this.callSecure("cancel_order", {
            coin_pair: this.config.coinPair,
            order_id: orderId
        }, json => success(json.order), error);
    }

    private callDataApi(method: string, success: Function): void {

        logger.info(`${TAG} Calling public API method '${method}'`)

        unirest.get(DATA_API + this.config.currency + "/" + method)
            .headers("Accept", "application/json")
            .end(response => {
                try {

                    const jsonResponse = JSON.parse(response.raw_body)

                    logger.info(`${TAG} API method '${method}' returned\n${jsonResponse}`)
                    success(jsonResponse);

                } catch (ex) {
                    logger.error(`${TAG} API method '${method}' failed\n${ex}`)
                }
            });
    }

    private callSecure(method: string, parameters, success: Function, error: Function): void {

        logger.info(`${TAG} Calling secure API method '${method}' with parameters ${parameters}`)

        const now = Math.round(new Date().getTime() / 1000);
        const queryString = qs.stringify({
            "tapi_method": method,
            "tapi_nonce": now,
            ...parameters
        });

        const signature = this.generateSignature(queryString, this.config.secret);

        unirest.post(TRADE_API)
            .headers({ "TAPI-ID": this.config.key })
            .headers({ "TAPI-MAC": signature })
            .send(queryString)
            .end(response => {
                if (response.body) {
                    // Sucess is code 100
                    if (response.body.status_code === 100) {
                        logger.info(`${TAG} API method '${method}' returned\n${response.body.response_data}`)
                        success(response.body.response_data);
                    } else {
                        logger.error(`${TAG} API method '${method}' failed\n${response.body.error_message}`)
                        error(response.body.error_message);
                    }
                } else
                    logger.error(`${TAG} API method '${method}' received unexpected error`);
            });
    }

    private generateSignature(queryString: string, secret: string): string {
        return crypto.createHmac("sha512", secret)
            .update(TRADE_PATH + "?" + queryString)
            .digest("hex");
    }
}

export { MercadoBitcoin as Api }