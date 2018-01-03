import * as winston from "winston"
import * as rotation from "winston-daily-rotate-file"
import * as moment from "moment"
import * as fs from "fs"

const directory = "logs"
const tsFormat = () => moment().format("DD-MM-YYYY HH:mm:ss")

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
})

export { logger }