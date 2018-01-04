import { Strategy } from "strategy/Strategy";
import { Api } from "apis/Api";
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

        setInterval(() =>
            this.api.ticker((tick) => {
                logger.info(`${TAG} ${this.api.getCurrency()} price now: ${tick.last}`)
            }), this.config.interval) 

            // TODO: implement logic
            
            /*if (response.ticker.sell <= 50000) {
                    getQuantity('BRL', response.ticker.sell, true, (qty) => {
                        tradeApi.placeBuyOrder(qty, response.ticker.sell,
                            (data) => {
                                console.log('Ordem de compra inserida no livro. ' + data)
                                //operando em STOP
                                tradeApi.placeSellOrder(data.quantity, response.ticker.sell * parseFloat(process.env.PROFITABILITY),
                                    (data) => console.log('Ordem de venda inserida no livro. ' + data),
                                    (data) => console.log('Erro ao inserir ordem de venda no livro. ' + data))
                            },
                            (data) => console.log('Erro ao inserir ordem de compra no livro. ' + data))
                    })
                }*/
    }
}

export { SimpleStrategy as Strategy }