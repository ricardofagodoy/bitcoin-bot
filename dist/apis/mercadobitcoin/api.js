"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unirest = require("unirest");
const crypto = require("crypto");
const qs = require("querystring");
const basic_1 = require("../../logger/basic");
const enuns_1 = require("../../types/api/enuns");
const MONEY_CURRENCY = "BRL";
const TAG = "[API MercadoBitcoin]";
const DATA_API = "https://www.mercadobitcoin.com.br/api/";
const TRADE_PATH = "/tapi/v3/";
const TRADE_API = "https://www.mercadobitcoin.net" + TRADE_PATH;
class MercadoBitcoin {
    constructor(config) {
        this.config = config;
        basic_1.logger.info(`${TAG} created with following configuration:\n${JSON.stringify(this.config)}`);
        this.setCurrency(config.currency);
    }
    getCurrency() {
        return this.config.currency;
    }
    setCurrency(currency) {
        this.coinPair = MONEY_CURRENCY + currency;
        this.config.currency = currency;
    }
    ticker(success, error) {
        this.callDataApi("ticker", json => {
            success({
                high: json.ticker.high,
                low: json.ticker.low,
                last: json.ticker.last,
                buy: json.ticker.buy,
                sell: json.ticker.sell,
                volume: json.ticker.vol,
                timestamp: json.ticker.date
            });
        }, error);
    }
    orderBook(success, error) {
        this.callDataApi("orderbook", json => {
            json.asks = json.asks.map(values => ({ price: values[0], amount: values[1] }));
            json.bids = json.bids.map(values => ({ price: values[0], amount: values[1] }));
            success(json);
        }, error);
    }
    trades(success, error) {
        this.callDataApi("trades", json => {
            success(json.map(trade => ({
                date: trade.date,
                price: trade.price,
                amount: trade.amount,
                id: trade.tid,
                type: trade.type == "sell" ? enuns_1.OrderType.SELL : enuns_1.OrderType.BUY
            })));
        }, error);
    }
    accountBalance(success, error) {
        this.callSecure("get_account_info", {}, (json) => {
            const balances = json.balance;
            const data = [];
            let key = undefined;
            for (key in balances) {
                data.push({
                    currency: key,
                    available: balances[key].available,
                    total: balances[key].total
                });
            }
            success(data);
        }, error);
    }
    myOrders(success, error, parameters) {
        this.callSecure("list_orders", Object.assign({ coin_pair: this.coinPair }, parameters), json => {
            success(json.orders.map(order => this.parseOrder(order)));
        }, error);
    }
    placeBuyOrder(quantity, limitPrice, success, error) {
        this.callSecure("place_buy_order", {
            coin_pair: this.coinPair,
            quantity: quantity.toString().substr(0, 10),
            limit_price: limitPrice
        }, json => success(this.parseOrder(json.order)), error);
    }
    placeSellOrder(quantity, limitPrice, success, error) {
        this.callSecure("place_sell_order", {
            coin_pair: this.coinPair,
            quantity: quantity.toString().substr(0, 10),
            limit_price: limitPrice
        }, json => success(this.parseOrder(json.order)), error);
    }
    cancelOrder(orderId, success, error) {
        this.callSecure("cancel_order", {
            coin_pair: this.coinPair,
            order_id: orderId
        }, json => success(this.parseOrder(json.order)), error);
    }
    callDataApi(method, success, error) {
        basic_1.logger.debug(`${TAG} Calling public API method '${method}'`);
        unirest.get(DATA_API + this.config.currency + "/" + method)
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
        const signature = this.generateSignature(queryString, this.config.secret);
        unirest.post(TRADE_API)
            .headers({ "TAPI-ID": this.config.key })
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
    parseOrder(json) {
        return {
            id: json.order_id,
            currency: json.coin_pair.substring(3),
            type: json.order_type == 1 ? enuns_1.OrderType.BUY : enuns_1.OrderType.SELL,
            cancelled: json.status == 3,
            quantity: json.quantity,
            limit_price: json.limit_price,
            fee: json.fee,
            timestamp: json.updated_timestamp
        };
    }
}
exports.Api = MercadoBitcoin;
//# sourceMappingURL=api.js.map