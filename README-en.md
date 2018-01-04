# Bitcoin Bot

![alt text](coins.jpg)

**Bitcoin Bot** is a simple, extensible and easy-to-use application to keep track of price and place orders to Bitcoin market through exchanges API integration and pre-defined strategies.

### Exchanges ([details](./src/apis))
- Mercado Bitcoin

### Strategies ([details](./src/strategy))
- Simple strategy

## Why?

One main purpose for its development is the lack of time/patience to track charts and indicators before taking some decent action. 

**So, why not create a precise, super-speeded, never-tired robot to suit the job?**

## How to use

It's **extremely** simple to use!

### You'll need
- Computer
- NodeJS
- Package Manger (npm, yarn, ...)

You might also want to have an account in any of supported exchanges.

## Steps

1. Download or clone project
2. Get it project folder
2. Rename `bot-config.json.default` to `bot-config.json`
4. Open file `bot-config.json` in editor and configure it propertly
5. Run `./run.sh`
6. Grab a coffee and stare at running logs!

## Creating new API integrations

All APIs integrations sit at `src/apis`, in a way each folder inside this path is a diffent integration.

In order to use an API, all you have to do is supply its configs at `bot-config.json` and **choose** it by inserting its name on top of config file `api` field.

### To create your own, it's easy:

1. Create a new folder under path above containing your `TypeScript` code implementing `src/apis/Api.ts` interface

2. Insert a new key to `bot-config.json` mapping your API name

3. It's done and ready to use!


## Creating new Strategy

All strategies sit at `src/strategy`, in a way each folder inside this path is a diffent strategy.

In order to use a strategy, all you have to do is supply its configs at `bot-config.json` and **choose** it by inserting its name on top of config file `strategy` field.

### To create your own, it's easy:

1. Create a new folder under path above containing your `TypeScript` code implementing `src/strategy/Strategy.ts` interface

2. Insert a new key to `bot-config.json` mapping your strategy name

3. It's done and ready to use!

## Comming Up

- Notifications
- Persistence
- Simulator
- Remote control
- More integrations