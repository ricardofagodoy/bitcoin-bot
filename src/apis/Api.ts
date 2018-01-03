import { Tick, Trade, Balance, BookOrders, Order } from "types/api/types"

/* After implementing, place it under src/apis/XXXX/api.ts
   and export it as Api

   Then, fill bot-config.json with needed configuration and it's done!
*/

export interface Api {

    /* Public services */
    ticker(success: (data: Tick) => void): void;
    orderBook(success: (data: BookOrders) => void): void;
    trades(success: (data: Array<Trade>) => void): void;

    /* Authenticated private services */
    accountBalance(success: (data: Array<Balance>) => void, error: Function): void;
    myOrders(success: (data: Array<Order>) => void, error: Function, parameters?: {}): void;
    
    placeBuyOrder(quantity: number, limitPrice: number, success: (data: Order) => void, error: Function): void;
    placeSellOrder(quantity: number, limitPrice: number, success: (data: Order) => void, error: Function): void;
    cancelOrder(orderId: number, success: (data: Order) => void, error: Function): void;

    /* Util */
    getCurrency(): string;
    setCurrency(currency: string): boolean;
}