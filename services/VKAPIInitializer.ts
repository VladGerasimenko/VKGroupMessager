import {VKApiExtended} from "./VKApiExtended";
import {ConsoleLogger} from "node-vk-sdk";

export abstract class VKAPIInitializer {
    protected readonly vkApi: VKApiExtended

    protected constructor() {
        this.vkApi = this.getVKApi()
    }

    private getVKApi(): VKApiExtended {
        return new VKApiExtended({
            logger: new ConsoleLogger(),
            requestsPerSecond: 1
        })
    }
}