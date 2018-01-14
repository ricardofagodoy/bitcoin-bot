"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enuns_1 = require("../../types/api/enuns");
class MercadoBitcoinMapper {
    parseTick(json) {
        return {
            high: json.ticker.high,
            low: json.ticker.low,
            last: json.ticker.last,
            buy: json.ticker.buy,
            sell: json.ticker.sell,
            volume: json.ticker.vol,
            timestamp: json.ticker.date
        };
    }
    parseOrderBook(json) {
        json.asks = json.asks.map(values => ({ price: values[0], amount: values[1] }));
        json.bids = json.bids.map(values => ({ price: values[0], amount: values[1] }));
        return json;
    }
    parseTradeList(json) {
        return json.map(this.parseTrade);
    }
    parseTrade(trade) {
        return {
            date: trade.date,
            price: trade.price,
            amount: trade.amount,
            id: trade.tid,
            type: trade.type == "sell" ? enuns_1.OrderType.SELL : enuns_1.OrderType.BUY
        };
    }
    parseOrderList(json) {
        return json.map(this.parseOrder);
    }
    parseOrder(json) {
        return {
            id: json.order_id,
            currency: json.coin_pair.substring(3),
            type: json.order_type == 1 ? enuns_1.OrderType.BUY : enuns_1.OrderType.SELL,
            cancelled: json.status == 3,
            quantity: json.quantity,
            limit_price: json.limit_price,
            fee: json.fee,
            timestamp: json.updated_timestamp
        };
    }
    parseBalanceList(json) {
        const balances = json.balance;
        const data = [];
        let key = undefined;
        for (key in balances)
            data.push({
                currency: key,
                available: balances[key].available,
                total: balances[key].total
            });
        return data;
    }
}
exports.Mapper = MercadoBitcoinMapper;
//# sourceMappingURL=mapper.js.map