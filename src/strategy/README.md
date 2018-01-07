# Strategies

**Strategy** is a just code responsible for decision making to consume API services and place exchange orders.

Check out available strategies and their configuration bellow:

## 1. Simple strategy
**Simplest strategy ever**: keep on checking for lowest sell price, placeing buy orders when it gets close to lowest, and, creating sell orders according to configured profitability.

*It's pretty much something a non-technical guy without further analysis would do by hand :)*

### Configuration

```
"simple": {
    "baseCurrency": "BRL", // Base currency to buy crypto
    "interval": ?? // Interval between each run (in ms)
    "profitability": 1.10, // decimal to desired profit (10%)
    "closeToLowest": 0.05 // how close to low price to buy (5%)
}
```

***

If you want to create your own strategy, read about it at default README