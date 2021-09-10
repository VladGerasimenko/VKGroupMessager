import {VKApiExtended} from "./VKApiExtended";
import {ConsoleLogger} from "node-vk-sdk";

export abstract class VKAPIInitializer {
    protected getVKApi(): VKApiExtended {
        return new VKApiExtended({
            logger: new ConsoleLogger(),
            requestsPerSecond: 1
        })
    }
}