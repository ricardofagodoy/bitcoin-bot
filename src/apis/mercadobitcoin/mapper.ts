import { Tick, OrderBook, Trade, Balance, Order } from "types/api/types"
import { OrderType } from "../../types/api/enuns"

class MercadoBitcoinMapper {

    parseTick(json: any): Tick {
        return {
            high: json.ticker.high,
            low: json.ticker.low,
            last: json.ticker.last,
            buy: json.ticker.buy,
            sell: json.ticker.sell,
            volume: json.ticker.vol,
            timestamp: json.ticker.date
        }
    }

    parseOrderBook(json: any): OrderBook {
        json.asks = json.asks.map(values => ({ price: values[0], amount: values[1] }))
        json.bids = json.bids.map(values => ({ price: values[0], amount: values[1] }))

        return json
    }

    parseTradeList(json: Array<any>): Array<Trade> {
        return json.map(this.parseTrade)
    }

    parseTrade(trade: any): Trade {
        return {
            date: trade.date,
            price: trade.price,
            amount: trade.amount,
            id: trade.tid,
            type: trade.type == "sell" ? OrderType.SELL : OrderType.BUY
        }
    }

    parseOrderList(json: Array<any>): Array<Order> {
        return json.map(this.parseOrder)
    }

    parseOrder(json: any): Order {
        return {
            id: json.order_id,
            currency: json.coin_pair.substring(3),
            type: json.order_type == 1 ? OrderType.BUY : OrderType.SELL,
            cancelled: json.status == 3,
            quantity: json.quantity,
            limit_price: json.limit_price,
            fee: json.fee,
            timestamp: json.updated_timestamp
        }
    }

    parseBalanceList(json: any): Array<Balance> {

        const balances = json.balance
        const data: Balance[] = []

        let key = undefined

        for (key in balances)
            data.push({
                currency: key,
                available: balances[key].available,
                total: balances[key].total
            })

        return data
    }
}

export { MercadoBitcoinMapper as Mapper }