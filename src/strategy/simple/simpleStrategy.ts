import { Strategy } from "strategy/Strategy";
import { Api } from "apis/Api";
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

        setInterval(() =>
            this.api.ticker((tick) => {
                logger.info(`${TAG} ${this.api.getCurrency()} price now: ${tick.last}`)
            }), this.config.interval)
    }
}

export { SimpleStrategy as Strategy }