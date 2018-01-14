"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const basic_1 = require("../../logger/basic");
const TAG = "[Strategy Simple]";
class SimpleStrategy {
    constructor(api, config) {
        this.api = api;
        this.config = config;
        basic_1.logger.info(`${TAG} created with following configuration:\n${JSON.stringify(this.config, undefined, 4)}`);
    }
    start() {
        basic_1.logger.info(`${TAG} Started (${this.config.interval} ms interval)`);
        setInterval(() => {
            this.api.ticker((tick) => {
                basic_1.logger.info(`${TAG} ${this.api.getCurrency()} last price: ${tick.last}`);
                this.takeActionOnPrice(tick);
            }, (error) => console.log(error));
        }, this.config.interval);
    }
    takeActionOnPrice(price) {
        return __awaiter(this, void 0, void 0, function* () {
            basic_1.logger.info(`Taking action on latest price...`);
            if (this.shouldBuy(price)) {
                const currency = yield this.getBalance();
                this.placeBuyAndSellOrders(price.sell, currency.available / price.sell, this.config.profitability);
            }
            else {
                basic_1.logger.info(`Price is not low enough to buy: Sell: ${price.sell} | Min: ${price.low}`);
            }
        });
    }
    shouldBuy(price) {
        return (price.sell - price.low) < price.low * this.config.closeToLowest;
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
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.api.accountBalance((currencies) => {
                    const correctCurrency = currencies.filter(c => {
                        return c.currency.toUpperCase() == this.config.baseCurrency.toUpperCase();
                    })[0];
                    if (!correctCurrency)
                        reject(new Error(`Base currency ${this.config.baseCurrency} check balance not available`));
                    correctCurrency.available = 10;
                    resolve(correctCurrency);
                }, (error) => reject(new Error(`Fail to retrieve balance: ${error}\nOrder NOT placed!`)));
            });
        });
    }
}
exports.Strategy = SimpleStrategy;
//# sourceMappingURL=strategy.js.map