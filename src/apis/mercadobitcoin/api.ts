import * as unirest from "unirest";
import * as crypto from "crypto";
import * as qs from "querystring";
import { logger } from "../../logger/basic"
import { OrderType } from "../../types/api/enuns"

import { Api } from "apis/Api"
import { Tick, OrderBook, Trade, Balance, Order } from "types/api/types"

const MONEY_CURRENCY = "BRL"
const TAG = "[API MercadoBitcoin]"
const DATA_API = "https://www.mercadobitcoin.com.br/api/";
const TRADE_PATH = "/tapi/v3/";
const TRADE_API = "https://www.mercadobitcoin.net" + TRADE_PATH;

type Config = {
    currency: string,
    key?: string,
    secret?: string,
    pin?: string
}

class MercadoBitcoin implements Api {

    private config: Config;
    private coinPair: string;

    constructor(config: Config) {

        this.config = config;
        logger.info(`${TAG} created with following configuration:\n${JSON.stringify(this.config)}`)

        this.setCurrency(config.currency)
    }

    getCurrency(): string {
        return this.config.currency
    }

    setCurrency(currency: string): void {
        this.coinPair = MONEY_CURRENCY + currency;
        this.config.currency = currency;
    }

    ticker(success: (data: Tick) => void, error: (message: string) => void): void {
        this.callDataApi("ticker", json => {
            success({
                high: json.ticker.high,
                low: json.ticker.low,
                last: json.ticker.last,
                buy: json.ticker.buy,
                sell: json.ticker.sell,
                volume: json.ticker.vol,
                timestamp: json.ticker.date
            })
        }, error)
    }

    orderBook(success: (data: OrderBook) => void, error: (message: string) => void): void {
        this.callDataApi("orderbook", json => {
            json.asks = json.asks.map(values => ({ price: values[0], amount: values[1] }))
            json.bids = json.bids.map(values => ({ price: values[0], amount: values[1] }))

            success(json)
        }, error)
    }

    trades(success: (data: Array<Trade>) => void, error: (message: string) => void): void {
        this.callDataApi("trades", json => {
            success(json.map(trade => ({
                date: trade.date,
                price: trade.price,
                amount: trade.amount,
                id: trade.tid,
                type: trade.type == "sell" ? OrderType.SELL : OrderType.BUY
            })))
        }, error)
    }

    accountBalance(success: (data: Array<Balance>) => void, error: (message: string) => void): void {
        this.callSecure("get_account_info", {}, (json) => {

            const balances = json.balance
            const data: Balance[] = []

            let key = undefined

            for (key in balances) {
                data.push({
                    currency: key,
                    available: balances[key].available,
                    total: balances[key].total
                })
            }

            success(data)

        }, error);
    }

    myOrders(success: (data: Array<Order>) => void, error: (message: string) => void, parameters?: {}): void {
        this.callSecure("list_orders", {
            coin_pair: this.coinPair,
            ...parameters
        }, json => {
            success(json.orders.map(order => this.parseOrder(order)))
        }, error);
    }

    placeBuyOrder(quantity: number, limitPrice: number, success: (data: Order) => void, error: (message: string) => void): void {
        this.callSecure("place_buy_order", {
            coin_pair: this.coinPair,
            quantity: quantity.toString().substr(0, 10),
            limit_price: limitPrice
        }, json => success(this.parseOrder(json.order)), error);
    }

    placeSellOrder(quantity: number, limitPrice: number, success: (data: Order) => void, error: (message: string) => void): void {
        this.callSecure("place_sell_order", {
            coin_pair: this.coinPair,
            quantity: quantity.toString().substr(0, 10),
            limit_price: limitPrice
        }, json => success(this.parseOrder(json.order)), error);
    }

    cancelOrder(orderId: number, success: (data: Order) => void, error: (message: string) => void): void {
        this.callSecure("cancel_order", {
            coin_pair: this.coinPair,
            order_id: orderId
        }, json => success(this.parseOrder(json.order)), error);
    }

    private callDataApi(method: string, success: (json: any) => void, error: (message: string) => void): void {

        logger.debug(`${TAG} Calling public API method '${method}'`)

        unirest.get(DATA_API + this.config.currency + "/" + method)
            .headers("Accept", "application/json")
            .end(response => {
                try {
                    logger.debug(`${TAG} API method '${method}' returned\n${response.raw_body}`)
                    success(JSON.parse(response.raw_body));

                } catch (ex) {
                    logger.error(`${TAG} API method '${method}' failed\n${JSON.stringify(ex)}`)
                    error(`Unexpected error: ${ex}`)
                }
            });
    }

    private callSecure(method: string, parameters: any, success: (json: any) => void, error: (message: string) => void): void {

        logger.debug(`${TAG} Calling secure API method '${method}' with parameters ${JSON.stringify(parameters)}`)

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
                if (response.statusCode < 400) {
                    // Internal sucess code is code 100
                    if (response.body.status_code === 100) {
                        logger.debug(`${TAG} API method '${method}' returned\n${JSON.stringify(response.body.response_data)}`)
                        success(response.body.response_data);
                    } else {
                        logger.error(`${TAG} API method '${method}' failed\n${response.body.status_code}: ${response.body.error_message}`)
                        error(response.body.error_message)
                    }
                } else {
                    logger.error(`${TAG} API method '${method}' received unexpected error: ${response.statusCode}`);
                    error(`Unexpected error code: ${response.statusCode}`)
                }
            });
    }

    private generateSignature(queryString: string, secret: string): string {
        return crypto.createHmac("sha512", secret)
            .update(TRADE_PATH + "?" + queryString)
            .digest("hex");
    }

    private parseOrder(json: any): Order {
        return {
            id: json.order_id,
            currency: json.coin_pair.substring(3),
            type: json.order_type == 1 ? OrderType.BUY : OrderType.SELL,
            cancelled: json.status == 3,
            quantity: json.quantity,
            limit_price: json.limit_price,
            fee: json.fee,
            timestamp: json.updated_timestamp
        }
    }
}

export { MercadoBitcoin as Api }