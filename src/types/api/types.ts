/* API interface generic types */
import { OrderType } from "types/api/enuns"

export type Tick = {
    high: number,
    low: number,
    last: number,
    buy: number,
    sell: number,
    volume: number,
    timestamp: Date;
}

export interface OrderEntry {
    price: number,
    amount: number
}

export type OrderBook = {
    asks: Array<OrderEntry>,
    bids: Array<OrderEntry>
}

export type Trade = {
    date: Date,
    price: number,
    amount: number,
    id: number,
    type: OrderType
}

export type Balance = {
    currency: string,
    available: number,
    total: number
}

export type Order = {
    id: number,
    currency: string,
    type: OrderType,
    cancelled: boolean,
    quantity: number,
    limit_price: number,
    fee: number,
    timestamp: Date
}