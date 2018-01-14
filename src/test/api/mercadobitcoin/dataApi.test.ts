import { Api } from "../../../apis/mercadobitcoin/api"
import { logger } from "../../../logger/basic"
logger.transports["console"].silent = true

const json = { response: "ok" }
const mapped = { mapped: "ok" }

const success = response => expect(response).toBe(mapped)
const error = response => expect(response).toBe(json)

describe("public data services", () => {

    it("ticker must call service, mapper and success on success", () => {

        expect.assertions(4)

        const api = new Api({} as any)

        const mockCallServiceSuccess = jest.fn().mockReturnValue(Promise.resolve(json))
        api.service.call = mockCallServiceSuccess

        api.mapper.parseTick = response => {
            expect(response).toBe(json)
            return mapped as any
        }

        api.ticker(success, error)

        expect(mockCallServiceSuccess.mock.calls.length).toBe(1)
        expect(mockCallServiceSuccess.mock.calls[0][0]).toBe("ticker")
    });

    it("ticker must call service and error on error", () => {

        expect.assertions(3)

        const api = new Api({} as any)

        const mockCallServiceError = jest.fn().mockReturnValueOnce(Promise.reject(json))
        api.service.call = mockCallServiceError

        api.ticker(success, error)

        expect(mockCallServiceError.mock.calls.length).toBe(1)
        expect(mockCallServiceError.mock.calls[0][0]).toBe("ticker")
    })

    it("orderBook must call service, mapper and success on success", () => {

        expect.assertions(4)

        const api = new Api({} as any)

        const mockCallServiceSuccess = jest.fn().mockReturnValue(Promise.resolve(json))
        api.service.call = mockCallServiceSuccess

        api.mapper.parseOrderBook = response => {
            expect(response).toBe(json)
            return mapped as any
        }

        api.orderBook(success, error)

        expect(mockCallServiceSuccess.mock.calls.length).toBe(1)
        expect(mockCallServiceSuccess.mock.calls[0][0]).toBe("orderbook")
    });

    it("ticker must call service and error on error", () => {

        expect.assertions(3)

        const api = new Api({} as any)

        const mockCallServiceError = jest.fn().mockReturnValueOnce(Promise.reject(json))
        api.service.call = mockCallServiceError

        api.orderBook(success, error)

        expect(mockCallServiceError.mock.calls.length).toBe(1)
        expect(mockCallServiceError.mock.calls[0][0]).toBe("orderbook")
    })

    it("trades must call service, mapper and success on success", () => {

        expect.assertions(4)

        const api = new Api({} as any)

        const mockCallServiceSuccess = jest.fn().mockReturnValue(Promise.resolve(json))
        api.service.call = mockCallServiceSuccess

        api.mapper.parseTradeList = response => {
            expect(response).toBe(json)
            return mapped as any
        }

        api.trades(success, error)

        expect(mockCallServiceSuccess.mock.calls.length).toBe(1)
        expect(mockCallServiceSuccess.mock.calls[0][0]).toBe("trades")
    });

    it("trades must call service and error on error", () => {

        expect.assertions(3)

        const api = new Api({} as any)

        const mockCallServiceError = jest.fn().mockReturnValueOnce(Promise.reject(json))
        api.service.call = mockCallServiceError

        api.trades(success, error)

        expect(mockCallServiceError.mock.calls.length).toBe(1)
        expect(mockCallServiceError.mock.calls[0][0]).toBe("trades")
    })
})