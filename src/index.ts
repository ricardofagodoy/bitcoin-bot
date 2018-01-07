import { Api } from "apis/Api"
import { Strategy } from "strategy/Strategy"
import { logger } from "./logger/basic"
import * as fs from "fs"

const CONFIG_FILE = "bot-config.json"

/* 
 * Load properties 
 */
const config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"))

logger.info(`API Exchange chosen: ${config.api}`)
logger.info(`Strategy chosen: ${config.strategy}\n`)

/**
 * Load API chosen in configuration
 */
const chosenApi = require("./apis/" + config.api + "/api").Api
const apiConfig = config["apis"][config.api]

const api: Api = new chosenApi(apiConfig);

/**
 * Load Strategy chosen in configuration
 */
const chosenStrategy = require("./strategy/" + config.strategy + "/strategy").Strategy
const strategyConfig = config["strategies"][config.strategy]

const strategy: Strategy = new chosenStrategy(api, strategyConfig)

/**
 * Starts strategy and here you go!
 */
strategy.start()