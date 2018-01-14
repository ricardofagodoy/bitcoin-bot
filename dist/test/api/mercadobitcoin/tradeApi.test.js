"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../../../apis/mercadobitcoin/api");
const basic_1 = require("../../../logger/basic");
basic_1.logger.transports["console"].silent = true;
const json = { response: "ok" };
const mapped = { mapped: "ok" };
const success = response => expect(response).toBe(mapped);
const error = response => expect(response).toBe(json);
describe("private trade services", () => {
    it("accountBalance must call secure service, mapper and success on success", () => {
        expect.assertions(4);
        const api = new api_1.Api({});
        const mockCallServiceSuccess = jest.fn().mockReturnValue(Promise.resolve(json));
        api.service.callSecure = mockCallServiceSuccess;
        api.mapper.parseBalanceList = response => {
            expect(response).toBe(json);
            return mapped;
        };
        api.accountBalance(success, error);
        expect(mockCallServiceSuccess.mock.calls.length).toBe(1);
        expect(mockCallServiceSuccess.mock.calls[0][0]).toBe("get_account_info");
    });
    it("accountBalance must call service and error on error", () => {
        expect.assertions(3);
        const api = new api_1.Api({});
        const mockCallServiceError = jest.fn().mockReturnValueOnce(Promise.reject(json));
        api.service.callSecure = mockCallServiceError;
        api.accountBalance(success, error);
        expect(mockCallServiceError.mock.calls.length).toBe(1);
        expect(mockCallServiceError.mock.calls[0][0]).toBe("get_account_info");
    });
    it("myOrders must call secure service, mapper and success on success", () => {
        expect.assertions(5);
        const api = new api_1.Api({});
        const mockCallServiceSuccess = jest.fn().mockReturnValue(Promise.resolve(json));
        api.service.callSecure = mockCallServiceSuccess;
        api.mapper.parseOrderList = response => {
            expect(response).toBe(json);
            return mapped;
        };
        const parameters = {};
        api.myOrders(success, error, parameters);
        expect(mockCallServiceSuccess.mock.calls.length).toBe(1);
        expect(mockCallServiceSuccess.mock.calls[0][0]).toBe("list_orders");
        expect(mockCallServiceSuccess.mock.calls[0][1]).toBe(parameters);
    });
    it("myOrders must call service and error on error", () => {
        expect.assertions(4);
        const api = new api_1.Api({});
        const mockCallServiceError = jest.fn().mockReturnValueOnce(Promise.reject(json));
        api.service.callSecure = mockCallServiceError;
        const parameters = {};
        api.myOrders(success, error, parameters);
        expect(mockCallServiceError.mock.calls.length).toBe(1);
        expect(mockCallServiceError.mock.calls[0][0]).toBe("list_orders");
        expect(mockCallServiceError.mock.calls[0][1]).toBe(parameters);
    });
    it("placeBuyOrder must call secure service, mapper and success on success", () => {
        expect.assertions(5);
        const api = new api_1.Api({});
        const mockCallServiceSuccess = jest.fn().mockReturnValue(Promise.resolve(json));
        api.service.callSecure = mockCallServiceSuccess;
        api.mapper.parseOrder = response => {
            expect(response).toBe(json);
            return mapped;
        };
        const quantity = 10;
        const limit_price = 10000;
        api.placeBuyOrder(quantity, limit_price, success, error);
        expect(mockCallServiceSuccess.mock.calls.length).toBe(1);
        expect(mockCallServiceSuccess.mock.calls[0][0]).toBe("place_buy_order");
        expect(mockCallServiceSuccess.mock.calls[0][1]).toEqual({
            quantity: quantity.toFixed(8), limit_price: limit_price.toFixed(8)
        });
    });
    it("placeBuyOrder must call service and error on error", () => {
        expect.assertions(4);
        const api = new api_1.Api({});
        const mockCallServiceError = jest.fn().mockReturnValueOnce(Promise.reject(json));
        api.service.callSecure = mockCallServiceError;
        const quantity = 10;
        const limit_price = 10000;
        api.placeBuyOrder(quantity, limit_price, success, error);
        expect(mockCallServiceError.mock.calls.length).toBe(1);
        expect(mockCallServiceError.mock.calls[0][0]).toBe("place_buy_order");
        expect(mockCallServiceError.mock.calls[0][1]).toEqual({
            quantity: quantity.toFixed(8), limit_price: limit_price.toFixed(8)
        });
    });
    it("placeSellOrder must call secure service, mapper and success on success", () => {
        expect.assertions(5);
        const api = new api_1.Api({});
        const mockCallServiceSuccess = jest.fn().mockReturnValue(Promise.resolve(json));
        api.service.callSecure = mockCallServiceSuccess;
        api.mapper.parseOrder = response => {
            expect(response).toBe(json);
            return mapped;
        };
        const quantity = 10;
        const limit_price = 10000;
        api.placeSellOrder(quantity, limit_price, success, error);
        expect(mockCallServiceSuccess.mock.calls.length).toBe(1);
        expect(mockCallServiceSuccess.mock.calls[0][0]).toBe("place_sell_order");
        expect(mockCallServiceSuccess.mock.calls[0][1]).toEqual({
            quantity: quantity.toFixed(8), limit_price: limit_price.toFixed(8)
        });
    });
    it("placeSellOrder must call service and error on error", () => {
        expect.assertions(4);
        const api = new api_1.Api({});
        const mockCallServiceError = jest.fn().mockReturnValueOnce(Promise.reject(json));
        api.service.callSecure = mockCallServiceError;
        const quantity = 10;
        const limit_price = 10000;
        api.placeSellOrder(quantity, limit_price, success, error);
        expect(mockCallServiceError.mock.calls.length).toBe(1);
        expect(mockCallServiceError.mock.calls[0][0]).toBe("place_sell_order");
        expect(mockCallServiceError.mock.calls[0][1]).toEqual({
            quantity: quantity.toFixed(8), limit_price: limit_price.toFixed(8)
        });
    });
    it("cancelOrder must call secure service, mapper and success on success", () => {
        expect.assertions(5);
        const api = new api_1.Api({});
        const mockCallServiceSuccess = jest.fn().mockReturnValue(Promise.resolve(json));
        api.service.callSecure = mockCallServiceSuccess;
        api.mapper.parseOrder = response => {
            expect(response).toBe(json);
            return mapped;
        };
        const order_id = 10;
        api.cancelOrder(order_id, success, error);
        expect(mockCallServiceSuccess.mock.calls.length).toBe(1);
        expect(mockCallServiceSuccess.mock.calls[0][0]).toBe("cancel_order");
        expect(mockCallServiceSuccess.mock.calls[0][1]).toEqual({ order_id });
    });
    it("cancelOrder must call service and error on error", () => {
        expect.assertions(4);
        const api = new api_1.Api({});
        const mockCallServiceError = jest.fn().mockReturnValueOnce(Promise.reject(json));
        api.service.callSecure = mockCallServiceError;
        const order_id = 10;
        api.cancelOrder(order_id, success, error);
        expect(mockCallServiceError.mock.calls.length).toBe(1);
        expect(mockCallServiceError.mock.calls[0][0]).toBe("cancel_order");
        expect(mockCallServiceError.mock.calls[0][1]).toEqual({ order_id });
    });
});
//# sourceMappingURL=tradeApi.test.js.map