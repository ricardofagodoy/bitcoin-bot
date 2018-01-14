import { Loader } from "./loader"

const loader = new Loader("bot-config.json")

/*  Load API chosen in configuration  */
const api = loader.loadApi()

/*  Load Strategy chosen in configuration  */
const strategy = loader.loadStrategy(api)

/*  Starts strategy and here you go!  */
strategy.start()