# API integrations

**API integration** is a module which provides access to specific exchange features by integrating to its API. There's a common interface you can refer to methods and parameters supported by all integrations.

Check out available exchanges API and their configuration bellow:

## 1. Mercado Bitcoin
- https://www.mercadobitcoin.com.br/

- Public Data API: https://www.mercadobitcoin.com.br/api-doc/

- Trade API (authenticated): https://www.mercadobitcoin.com.br/trade-api/

### Configuration

```
"mercadobitcoin": {
    "currency": "??", // "BTC", "LTC" |or"BCH" supported
    "key": "??", // Your exchange API Key
    "secret": "??", // Your exchange API Secret
    "pin": // Exchange Account PIN
}
```

***

If you wanna create your own strategy, it's super easy (read about it at default README)