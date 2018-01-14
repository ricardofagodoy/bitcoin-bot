"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../../apis/mercadobitcoin/api");
const currency = "TST";
const config = { "currency": currency };
it("config must be set when creating api", () => {
    const api = new api_1.Api(config);
    expect(api.config).toBe(config);
});
it("set currency must set currency", () => {
    const api = new api_1.Api(config);
    expect(api.getCurrency()).toBe(currency);
});
//# sourceMappingURL=mercadobitcoin.test.js.map