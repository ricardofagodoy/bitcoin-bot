import { Tick, Trade, Balance, OrderBook, Order } from "types/api/types"

/* After implementing, place it under src/apis/XXXX/api.ts and export it as Api
   Fill bot-config.json with needed configuration and it's done!
*/

export interface Api {

    /* Public services */
    ticker(success: (data: Tick) => void, error: (message: string) => void): void;
    orderBook(success: (data: OrderBook) => void, error: (message: string) => void): void;
    trades(success: (data: Array<Trade>) => void, error: (message: string) => void): void;

    /* Authenticated private services */
    accountBalance(success: (data: Array<Balance>) => void, error: (message: string) => void): void;
    myOrders(success: (data: Array<Order>) => void, error: (message: string) => void, parameters?: {}): void;
    
    placeBuyOrder(quantity: number, limitPrice: number, success: (data: Order) => void, error: (message: string) => void): void;
    placeSellOrder(quantity: number, limitPrice: number, success: (data: Order) => void, error: (message: string) => void): void;
    cancelOrder(orderId: number, success: (data: Order) => void, error: (message: string) => void): void;

    /* Util */
    getCurrency(): string;
    setCurrency(currency: string): void;
}