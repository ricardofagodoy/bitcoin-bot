# Strategies

**Strategy** is a just code responsible for decision making to consume API services and place exchange orders.

Check out available strategies and their configuration bellow:

## 1. Simple strategy
**Simplest strategy ever**: keep on checking for last price and place buy orders when it gets close to lowest, and sell orders when it gets close to highest price.

*It's pretty much something a non-technical guy without further analysis would do by hand :)*

### Configuration

```
"simple": {
    "interval": ?? // Interval between each run (in ms)
    "profitability": 1.10 // decimal to desired profit (10%)
}
```

***

If you wanna create your own strategy, it's super easy (read about it at default README)