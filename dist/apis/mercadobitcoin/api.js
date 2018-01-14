"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basic_1 = require("../../logger/basic");
const service_1 = require("./service");
const mapper_1 = require("./mapper");
const TAG = "[API MercadoBitcoin]";
class MercadoBitcoin {
    constructor(config) {
        this.config = config;
        basic_1.logger.info(`${TAG} created with following configuration:\n${JSON.stringify(this.config, undefined, 4)}`);
        this.service = new service_1.Service(this.config.currency, this.config.secret, this.config.key, "BRL" + this.config.currency);
        this.mapper = new mapper_1.Mapper();
    }
    getCurrency() {
        return this.config.currency;
    }
    ticker(success, error) {
        this.service.call("ticker").
            then(json => success(this.mapper.parseTick(json))).
            catch(errorMsg => error(errorMsg));
    }
    orderBook(success, error) {
        this.service.call("orderbook").
            then(json => success(this.mapper.parseOrderBook(json))).
            catch(errorMsg => error(errorMsg));
    }
    trades(success, error) {
        this.service.call("trades").
            then(json => success(this.mapper.parseTradeList(json))).
            catch(errorMsg => error(errorMsg));
    }
    accountBalance(success, error) {
        this.service.callSecure("get_account_info", {}).
            then(json => success(this.mapper.parseBalanceList(json))).
            catch(errorMsg => error(errorMsg));
    }
    myOrders(success, error, parameters) {
        this.service.callSecure("list_orders", parameters).
            then(json => success(this.mapper.parseOrderList(json))).
            catch(errorMsg => error(errorMsg));
    }
    placeBuyOrder(quantity, limitPrice, success, error) {
        this.service.callSecure("place_buy_order", {
            quantity: Number(quantity).toFixed(8),
            limit_price: Number(limitPrice).toFixed(8)
        }).
            then(json => success(this.mapper.parseOrder(json))).
            catch(errorMsg => error(errorMsg));
    }
    placeSellOrder(quantity, limitPrice, success, error) {
        this.service.callSecure("place_sell_order", {
            quantity: Number(quantity).toFixed(8),
            limit_price: Number(limitPrice).toFixed(8)
        }).
            then(json => success(this.mapper.parseOrder(json))).
            catch(errorMsg => error(errorMsg));
    }
    cancelOrder(orderId, success, error) {
        this.service.callSecure("cancel_order", {
            order_id: orderId
        }).
            then(json => success(this.mapper.parseOrder(json))).
            catch(errorMsg => error(errorMsg));
    }
}
exports.Api = MercadoBitcoin;
//# sourceMappingURL=api.js.map