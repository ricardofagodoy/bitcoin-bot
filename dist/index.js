"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loader_1 = require("./loader");
const loader = new loader_1.Loader("bot-config.json");
/*  Load API chosen in configuration  */
const api = loader.loadApi();
/*  Load Strategy chosen in configuration  */
const strategy = loader.loadStrategy(api);
/*  Starts strategy and here you go!  */
strategy.start();
//# sourceMappingURL=index.js.map