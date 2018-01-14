import { Api } from "../../../apis/mercadobitcoin/api"
import { logger } from "../../../logger/basic"
logger.transports["console"].silent = true

describe("general api", () => {

    it("config must be set when creating api", () => {

        const config: any = { "currency": "ABC" }
        const api = new Api(config)

        expect(api.config).toBe(config);
    });

    it("get currency must return currency", () => {

        const currency = "TST"
        const config: any = { "currency": currency }
        const api = new Api(config)

        expect(api.getCurrency()).toBe(currency);
    })
})