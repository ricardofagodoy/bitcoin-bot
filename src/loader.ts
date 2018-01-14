import * as loadJsonFile from "load-json-file"
import { Api } from "apis/Api";
import { Strategy } from "strategy/Strategy";
import { logger } from "./logger/basic"

export class Loader {

    private config;

    constructor(configurationPath: string) {

        this.config = loadJsonFile.sync(configurationPath)

        logger.info(`Configuration loaded (${configurationPath}):\n
                    ${JSON.stringify(this.config, undefined, 4)}`)
    }

    loadApi(): Api {

        logger.info(`API Exchange chosen: ${this.config.api}\n`)

        const chosenApi = require("./apis/" + this.config.api + "/api").Api
        const apiConfig = this.config["apis"][this.config.api]

        return new chosenApi(apiConfig);
    }

    loadStrategy(api: Api): Strategy {

        logger.info(`Strategy chosen: ${this.config.strategy}`)

        const chosenStrategy = require("./strategy/" + this.config.strategy + "/strategy").Strategy
        const strategyConfig = this.config["strategies"][this.config.strategy]

        return new chosenStrategy(api, strategyConfig)
    }
}