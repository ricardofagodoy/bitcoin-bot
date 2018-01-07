"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basic_1 = require("../../logger/basic");
const TAG = "[Strategy Simple]";
class SimpleStrategy {
    constructor(api, config) {
        this.api = api;
        this.config = config;
    }
    start() {
        basic_1.logger.info(`${TAG} Started - ${this.config.interval} ms interval`);
        setInterval(() => {
            this.api.ticker((tick) => {
                basic_1.logger.info(`${TAG} ${this.api.getCurrency()} last price: ${tick.last}`);
                this.takeActionOnPrice(tick);
            }, (error) => console.log(error));
        }, this.config.interval);
    }
    takeActionOnPrice(price) {
        basic_1.logger.info(`Taking action on latest price...`);
        const shouldBuy = (price.sell - price.low) < price.low * this.config.closeToLowest;
        if (shouldBuy) {
            this.api.accountBalance((currencies) => {
                const correctCurrency = currencies.filter(c => {
                    return c.currency.toUpperCase() == this.config.baseCurrency.toUpperCase();
                })[0];
                if (!correctCurrency)
                    return basic_1.logger.error(`Base currency ${this.config.baseCurrency} check balance not available`);
                const amountBuy = correctCurrency.available / (price.sell);
                this.placeBuyAndSellOrders(price.sell, amountBuy, this.config.profitability);
            }, (error) => basic_1.logger.error(`Fail to retrieve balance: ${error}\nOrder NOT placed!`));
        }
        else {
            basic_1.logger.info(`Price is not low enough to buy: Sell: ${price.sell} | Min: ${price.low}`);
        }
    }
    placeBuyAndSellOrders(price, amount, profitability) {
        basic_1.logger.info(`About to buy ${amount} ${this.api.getCurrency()} for ${price} ${this.config.baseCurrency} ...`);
        this.api.placeBuyOrder(amount, price, (data) => {
            basic_1.logger.info(`Buy order placed successfuly! (${data})`);
            const sellValue = price * profitability;
            basic_1.logger.info(`About to place sell order of ${data.quantity} ${data.currency} for ${sellValue} ${this.config.baseCurrency} ...`);
            this.api.placeSellOrder(data.quantity, sellValue, (data) => {
                basic_1.logger.info(`Sell order placed successfuly! (${data})`);
            }, (error) => basic_1.logger.error(`Fail to place sell order: ${error}`));
        }, (error) => basic_1.logger.error(`Fail to place buy order: ${error}`));
    }
}
exports.Strategy = SimpleStrategy;
//# sourceMappingURL=strategy.js.map