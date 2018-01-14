import { Strategy } from "strategy/Strategy";
import { Api } from "apis/Api";
import { Tick, Balance } from "types/api/types"
import { logger } from "../../logger/basic"

const TAG = "[Strategy Simple]"

class SimpleStrategy implements Strategy {

    private api: Api;
    private config: any;

    constructor(api: Api, config: any) {
        this.api = api;
        this.config = config;

        logger.info(`${TAG} created with following configuration:\n${JSON.stringify(this.config, undefined, 4)}`)

    }

    start(): void {

        logger.info(`${TAG} Started (${this.config.interval} ms interval)`)

        setInterval(() => {
            this.api.ticker((tick) => {
                logger.info(`${TAG} ${this.api.getCurrency()} last price: ${tick.last}`)
                this.takeActionOnPrice(tick)
            }, (error) => console.log(error))

        }, this.config.interval)
    }

    private async takeActionOnPrice(price: Tick) {

        logger.info(`Taking action on latest price...`)

        if (!this.shouldBuy(price))
            return logger.info(`Price is not low enough to buy: Sell: ${price.sell} | Min: ${price.low}`)

        try {
            const currency = await this.getBalance()
            this.placeBuyAndSellOrders(price.sell, currency.available / price.sell, this.config.profitability)
        } catch (e) {
            logger.error(e)
        }
    }

    private shouldBuy(price: Tick): boolean {
        return (price.sell - price.low) < price.low * this.config.closeToLowest
    }

    private placeBuyAndSellOrders(price: number, amount: number, profitability: number): void {

        logger.info(`About to buy ${amount} ${this.api.getCurrency()} for ${price} ${this.config.baseCurrency} ...`)

        this.api.placeBuyOrder(amount, price, (data) => {

            logger.info(`Buy order placed successfuly! (${data})`)

            const sellValue = price * profitability
            logger.info(`About to place sell order of ${data.quantity} ${data.currency} for ${sellValue} ${this.config.baseCurrency} ...`)

            this.api.placeSellOrder(data.quantity, sellValue, (data) => {
                logger.info(`Sell order placed successfuly! (${data})`)
            }, (error) => logger.error(`Fail to place sell order: ${error}`))
        }, (error) => logger.error(`Fail to place buy order: ${error}`))
    }

    private async getBalance(): Promise<Balance> {

        return new Promise<Balance>((resolve, reject) => {
            this.api.accountBalance((currencies) => {

                const correctCurrency = currencies.filter(c => {
                    return c.currency.toUpperCase() == this.config.baseCurrency.toUpperCase()
                })[0]

                if (!correctCurrency)
                    reject(new Error(`Base currency ${this.config.baseCurrency} check balance not available`))

                correctCurrency.available = 10
                resolve(correctCurrency)

            }, (error) => reject(new Error(`Fail to retrieve balance: ${error}\nOrder NOT placed!`)))
        })
    }
}

export { SimpleStrategy as Strategy }