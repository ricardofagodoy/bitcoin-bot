"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const rotation = require("winston-daily-rotate-file");
const moment = require("moment");
const fs = require("fs");
const directory = "logs";
const tsFormat = () => moment().format("DD-MM-YYYY HH:mm:ss");
if (!fs.existsSync(directory))
    fs.mkdirSync(directory);
const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: tsFormat,
            colorize: true,
            level: "info"
        }),
        new (rotation)({
            name: "systemLog",
            filename: `${directory}/system.log.`,
            timestamp: tsFormat,
            datePattern: "yyyy-MM-dd",
            json: false,
            level: "info"
        }),
        new (rotation)({
            name: "errorLog",
            filename: `${directory}/error.log.`,
            timestamp: tsFormat,
            datePattern: "yyyy-MM-dd",
            json: false,
            level: "error"
        })
    ]
});
exports.logger = logger;
//# sourceMappingURL=basic.js.map