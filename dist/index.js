"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basic_1 = require("./logger/basic");
const fs = require("fs");
const CONFIG_FILE = "bot-config.json";
/*
 * Load properties
 */
const config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
basic_1.logger.info(`API Exchange chosen: ${config.api}`);
basic_1.logger.info(`Strategy chosen: ${config.strategy}\n`);
/**
 * Load API chosen in configuration
 */
const chosenApi = require("./apis/" + config.api + "/api").Api;
const apiConfig = config["apis"][config.api];
const api = new chosenApi(apiConfig);
/**
 * Load Strategy chosen in configuration
 */
const chosenStrategy = require("./strategy/" + config.strategy + "/strategy").Strategy;
const strategyConfig = config["strategies"][config.strategy];
const strategy = new chosenStrategy(api, strategyConfig);
/**
 * Starts strategy and here you go!
 */
strategy.start();
//# sourceMappingURL=index.js.map