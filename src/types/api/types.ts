/* API interface types */

export type Tick = {
    high: number,
    low: number,
    last: number,
    timestamp: Date;
}

export type BookOrders = {
    asks: Array<Array<number>>,
    bids: Array<Array<number>>
}

export type Trade = {
    date: Date,
    price: number,
    amount: number,
    tid: number,
    type: string
}

export type Balance = {
    currency: string,
    available: number,
    total: number
}

export type Operation = {
    operation_id: number,
    quantity: number,
    price: number,
    fee_rate: number,
    executed_timestamp: string
}

export type Order = {
    order_id: number,
    coin_pair: string,
    order_type: number,
    status: number,
    has_fills: boolean,
    quantity: number,
    limit_price: number,
    executed_quantity: number,
    executed_price_avg: number,
    fee: number,
    created_timestamp: string,
    updated_timestamp: string,
    operations: Array<Operation>
}