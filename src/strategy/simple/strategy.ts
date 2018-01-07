import { Strategy } from "strategy/Strategy";
import { Api } from "apis/Api";
import { Tick } from "types/api/types"
import { logger } from "../../logger/basic"

const TAG = "[Strategy Simple]"

class SimpleStrategy implements Strategy {

    private api: Api;
    private config: any;

    constructor(api: Api, config: any) {
        this.api = api;
        this.config = config;
    }

    start(): void {

        logger.info(`${TAG} Started - ${this.config.interval} ms interval`)

        setInterval(() => {
            this.api.ticker((tick) => {
                logger.info(`${TAG} ${this.api.getCurrency()} last price: ${tick.last}`)
                this.takeActionOnPrice(tick)
            }, (error) => console.log(error))

        }, this.config.interval)
    }

    private takeActionOnPrice(price: Tick): void {

        logger.info(`Taking action on latest price...`)

        const shouldBuy = (price.sell - price.low) < price.low * this.config.closeToLowest

        if (shouldBuy) {

            this.api.accountBalance((currencies) => {

                const correctCurrency = currencies.filter(c => {
                    return c.currency.toUpperCase() == this.config.baseCurrency.toUpperCase()
                })[0]

                if (!correctCurrency)
                    return logger.error(`Base currency ${this.config.baseCurrency} check balance not available`)

                const amountBuy = correctCurrency.available / (price.sell)
                this.placeBuyAndSellOrders(price.sell, amountBuy, this.config.profitability)

            }, (error) => logger.error(`Fail to retrieve balance: ${error}\nOrder NOT placed!`))
            
        } else {
            logger.info(`Price is not low enough to buy: Sell: ${price.sell} | Min: ${price.low}`)
        }
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
}

export { SimpleStrategy as Strategy }