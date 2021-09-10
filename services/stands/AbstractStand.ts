import {VKAPIInitializer} from "../VKAPIInitializer";
import {VKApiExtended} from "../VKApiExtended";

const config = require('./../../config/config.json')
const users_data = require('./../../resources/users_data.json')

export abstract class AbstractStand extends VKAPIInitializer{
    protected vkApi: VKApiExtended = this.getVKApi()
    protected groupName: string = ""
    protected wallItemsCount: number = 0
    protected hostId: number = 0
    protected hostToken: string = ""
    protected rpsTimeout: number = 0
    protected usersData: Map<number,string> = new Map<number, string>()

    constructor() {
        super();
        this.init()
    }

    private init(): void {
        this.fillInUsersData()
        let host: Map<number, string> = this.generateHost()
        this.hostId = host.keys().next().value
        this.hostToken = host.values().next().value
        this.groupName = config.groupName
        this.wallItemsCount = config.wallItemsCount
        this.rpsTimeout = config.rps_timeout
    }

    private fillInUsersData() {
        //User3 and User4 have unconfirmed phone numbers
        //So now it is blocker for join these users to group through API

        // this.usersData.set(users_data.user1.id, users_data.user1.token)
        //               .set(users_data.user2.id, users_data.user2.token)
        //               .set(users_data.user3.id, users_data.user3.token)
        //               .set(users_data.user4.id, users_data.user4.token)
        //               .set(users_data.user5.id, users_data.user5.token)

        this.usersData.set(users_data.user1.id, users_data.user1.token)
            .set(users_data.user2.id, users_data.user2.token)
            .set(users_data.user5.id, users_data.user5.token)
    }

    private generateHost(): Map<number, string>{
        let host: Map<number, string> = new Map<number, string>()
        let keys: Array<number> = [...this.usersData.keys()]
        let randomKey: number = keys[Math.floor(Math.random() * keys.length)];
        host.set(randomKey, <string>this.usersData.get(randomKey))
        return host
    }
}