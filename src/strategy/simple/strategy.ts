import { Strategy } from "strategy/Strategy";
import { Api } from "apis/Api";
import { Tick } from "types/api/types"
import { logger } from "../../logger/basic"

const TAG = "[Strategy Simple]"

class SimpleStrategy implements Strategy {

    private api: Api;
    private config: any;

    constructor(api: Api, config: any) {
        this.api = api;
        this.config = config;
    }

    start(): void {

        logger.info(`${TAG} Started - ${this.config.interval} ms interval`)

        setInterval(() => {
            this.api.ticker((tick) => {
                logger.info(`${TAG} ${this.api.getCurrency()} last price: ${tick.last}`)
                this.takeActionOnPrice(tick)
            }, (error) => console.log(error))

        }, this.config.interval)
    }

    private takeActionOnPrice(price: Tick): void {
        console.log(`Logic over price ${price.sell} with ${this.config.profitability} profitability!`)
    }
}

export { SimpleStrategy as Strategy }