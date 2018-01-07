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
        console.log(`Logic over price ${price.sell} with ${this.config.profitability} profitability!`);
    }
}
exports.Strategy = SimpleStrategy;
//# sourceMappingURL=strategy.js.map