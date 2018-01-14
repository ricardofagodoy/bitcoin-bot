import { logger } from "../../logger/basic"
import { OrderType } from "../../types/api/enuns"
import { Api } from "apis/Api"
import { Tick, OrderBook, Trade, Balance, Order } from "types/api/types"
import { Service } from "./service"
import { Mapper } from "./mapper"

const TAG = "[API MercadoBitcoin]"

type Config = {
    currency: string,
    key?: string,
    secret?: string,
    pin?: string
}

class MercadoBitcoin implements Api {

    public config: Config;
    public service: Service
    public mapper: Mapper

    constructor(config: Config) {

        this.config = config;
        logger.info(`${TAG} created with following configuration:\n${JSON.stringify(this.config, undefined, 4)}`)

        this.service = new Service(this.config.currency, this.config.secret, this.config.key, "BRL" + this.config.currency)
        this.mapper = new Mapper()
    }

    getCurrency(): string {
        return this.config.currency
    }

    ticker(success: (data: Tick) => void, error: (message: string) => void): void {
        this.service.call("ticker").
            then(json => success(this.mapper.parseTick(json))).
            catch(errorMsg => error(errorMsg))
    }

    orderBook(success: (data: OrderBook) => void, error: (message: string) => void): void {
        this.service.call("orderbook").
            then(json => success(this.mapper.parseOrderBook(json))).
            catch(errorMsg => error(errorMsg))
    }

    trades(success: (data: Array<Trade>) => void, error: (message: string) => void): void {
        this.service.call("trades").
            then(json => success(this.mapper.parseTradeList(json))).
            catch(errorMsg => error(errorMsg))
    }

    accountBalance(success: (data: Array<Balance>) => void, error: (message: string) => void): void {
        this.service.callSecure("get_account_info", {}).
            then(json => success(this.mapper.parseBalanceList(json))).
            catch(errorMsg => error(errorMsg))
    }

    myOrders(success: (data: Array<Order>) => void, error: (message: string) => void, parameters?: {}): void {
        this.service.callSecure("list_orders", parameters).
            then(json => success(this.mapper.parseOrderList(json))).
            catch(errorMsg => error(errorMsg))
    }

    placeBuyOrder(quantity: number, limitPrice: number, success: (data: Order) => void, error: (message: string) => void): void {
        this.service.callSecure("place_buy_order", {
            quantity: Number(quantity).toFixed(8),
            limit_price: Number(limitPrice).toFixed(8)
        }).
            then(json => success(this.mapper.parseOrder(json))).
            catch(errorMsg => error(errorMsg));
    }

    placeSellOrder(quantity: number, limitPrice: number, success: (data: Order) => void, error: (message: string) => void): void {
        this.service.callSecure("place_sell_order", {
            quantity: Number(quantity).toFixed(8),
            limit_price: Number(limitPrice).toFixed(8)
        }).
            then(json => success(this.mapper.parseOrder(json))).
            catch(errorMsg => error(errorMsg));
    }

    cancelOrder(orderId: number, success: (data: Order) => void, error: (message: string) => void): void {
        this.service.callSecure("cancel_order", {
            order_id: orderId
        }).
            then(json => success(this.mapper.parseOrder(json))).
            catch(errorMsg => error(errorMsg));
    }
}

export { MercadoBitcoin as Api }