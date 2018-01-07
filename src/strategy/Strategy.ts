import { Api } from "apis/Api";

/* After implementing, place it under src/strategy/XXXX/strategy.ts and export it as Strategy
   Fill bot-config.json with needed configuration and it's done!
*/

export interface Strategy {
    start(): void;
}