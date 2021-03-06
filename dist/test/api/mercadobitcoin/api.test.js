"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../../../apis/mercadobitcoin/api");
const basic_1 = require("../../../logger/basic");
basic_1.logger.transports["console"].silent = true;
/* Mocks */
let mockCallServiceSuccess;
let mockCallServiceError;
const json = { response: "ok" };
const mapped = { mapped: "ok" };
const success = response => expect(response).toBe(mapped);
const error = response => expect(response).toBe(json);
/* General tests */
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
/* API methods tests */
beforeEach(() => {
    mockCallServiceSuccess = jest.fn().mockReturnValueOnce(Promise.resolve(json));
    mockCallServiceError = jest.fn().mockReturnValueOnce(Promise.reject(json));
});
describe("public data services", () => {
    it("ticker must call service, mapper and success on success", () => {
        expect.assertions(4);
        const api = new api_1.Api({});
        api.service.call = mockCallServiceSuccess;
        api.mapper.parseTick = response => {
            expect(response).toBe(json);
            return mapped;
        };
        api.ticker(success, error);
        expect(mockCallServiceSuccess.mock.calls.length).toBe(1);
        expect(mockCallServiceSuccess.mock.calls[0][0]).toBe("ticker");
    });
    it("ticker must call service and error on error", () => {
        expect.assertions(3);
        const api = new api_1.Api({});
        api.service.call = mockCallServiceError;
        api.ticker(success, error);
        expect(mockCallServiceError.mock.calls.length).toBe(1);
        expect(mockCallServiceError.mock.calls[0][0]).toBe("ticker");
    });
    it("orderBook must call service, mapper and success on success", () => {
        expect.assertions(4);
        const api = new api_1.Api({});
        api.service.call = mockCallServiceSuccess;
        api.mapper.parseOrderBook = response => {
            expect(response).toBe(json);
            return mapped;
        };
        api.orderBook(success, error);
        expect(mockCallServiceSuccess.mock.calls.length).toBe(1);
        expect(mockCallServiceSuccess.mock.calls[0][0]).toBe("orderbook");
    });
    it("ticker must call service and error on error", () => {
        expect.assertions(3);
        const api = new api_1.Api({});
        api.service.call = mockCallServiceError;
        api.orderBook(success, error);
        expect(mockCallServiceError.mock.calls.length).toBe(1);
        expect(mockCallServiceError.mock.calls[0][0]).toBe("orderbook");
    });
    it("trades must call service, mapper and success on success", () => {
        expect.assertions(4);
        const api = new api_1.Api({});
        api.service.call = mockCallServiceSuccess;
        api.mapper.parseTradeList = response => {
            expect(response).toBe(json);
            return mapped;
        };
        api.trades(success, error);
        expect(mockCallServiceSuccess.mock.calls.length).toBe(1);
        expect(mockCallServiceSuccess.mock.calls[0][0]).toBe("trades");
    });
    it("trades must call service and error on error", () => {
        expect.assertions(3);
        const api = new api_1.Api({});
        api.service.call = mockCallServiceError;
        api.trades(success, error);
        expect(mockCallServiceError.mock.calls.length).toBe(1);
        expect(mockCallServiceError.mock.calls[0][0]).toBe("trades");
    });
});
//# sourceMappingURL=api.test.js.map