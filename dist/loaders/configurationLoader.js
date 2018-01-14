"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loadJsonFile = require("load-json-file");
const basic_1 = require("../logger/basic");
const loadConfig = (configurationPath) => {
    const configuration = loadJsonFile.sync(configurationPath);
    basic_1.logger.info(`Configuration loaded (${configurationPath}):\n${JSON.stringify(configuration, undefined, 4)}`);
    return configuration;
};
exports.loadConfig = loadConfig;
//# sourceMappingURL=configurationLoader.js.map