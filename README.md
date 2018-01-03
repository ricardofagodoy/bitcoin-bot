# bitcoin-bot

Bitcoin Bot is a simple, extensible and easy-to-use application to keep track of price and place orders to Bitcoin market through exchanges API integration and defined strategies.

Rename bot-config.json.example to bot-config.json with you data!

- Tests
- Documentation
- Simulator
- Remote control


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