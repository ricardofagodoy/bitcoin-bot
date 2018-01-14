"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../../../apis/mercadobitcoin/api");
const basic_1 = require("../../../logger/basic");
basic_1.logger.transports["console"].silent = true;
describe("general api", () => {
    it("config must be set when creating api", () => {
        const config = { "currency": "ABC" };
        const api = new api_1.Api(config);
        expect(api.config).toBe(config);
    });
    it("get currency must return currency", () => {
        const currency = "TST";
        const config = { "currency": currency };
        const api = new api_1.Api(config);
        expect(api.getCurrency()).toBe(currency);
    });
});
//# sourceMappingURL=generalApi.test.js.map