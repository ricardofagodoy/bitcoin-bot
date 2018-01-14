"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loadJsonFile = require("load-json-file");
const basic_1 = require("./logger/basic");
class Loader {
    constructor(configurationPath) {
        this.config = loadJsonFile.sync(configurationPath);
        basic_1.logger.info(`Configuration loaded (${configurationPath}):\n
                    ${JSON.stringify(this.config, undefined, 4)}`);
    }
    loadApi() {
        basic_1.logger.info(`API Exchange chosen: ${this.config.api}\n`);
        const chosenApi = require("./apis/" + this.config.api + "/api").Api;
        const apiConfig = this.config["apis"][this.config.api];
        return new chosenApi(apiConfig);
    }
    loadStrategy(api) {
        basic_1.logger.info(`Strategy chosen: ${this.config.strategy}`);
        const chosenStrategy = require("./strategy/" + this.config.strategy + "/strategy").Strategy;
        const strategyConfig = this.config["strategies"][this.config.strategy];
        return new chosenStrategy(api, strategyConfig);
    }
}
exports.Loader = Loader;
//# sourceMappingURL=loader.js.map