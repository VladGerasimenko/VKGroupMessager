import {VKAPIInitializer} from "./VKAPIInitializer";
import {VKApiExtended} from "./VKApiExtended";
import {GroupsGetExtendedResponse, WallGetResponse} from "node-vk-sdk/distr/src/generated/Responses";
import {GroupsGroup} from "node-vk-sdk/distr/src/generated/Models";

const config = require('./../config/config.json')
const users_data = require('./../resources/users_data.json')

export class AppInitializer extends VKAPIInitializer{

    private vkApi: VKApiExtended = this.getVKApi()
    private readonly groupName: string
    private readonly wallItemsCount: number
    private readonly hostId: number
    private readonly hostToken: string
    private readonly rpsTimeout: number
    private usersData: Map<number,string> = new Map<number, string>()


    constructor() {
        super();
        this.fillInUsersData()
        let host: Map<number, string> = this.generateHost()
        this.hostId = host.keys().next().value
        this.hostToken = host.values().next().value
        this.groupName = config.groupName
        this.wallItemsCount = config.wallItemsCount
        this.rpsTimeout = config.rps_timeout
    }

    public async prepareInitialData(): Promise<number> {
        let groupId: number = await this.prepareGroup()
        this.addUsersToGroup(groupId)
        this.prepareGroupWall(groupId)
        return groupId
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

    private generateRandomWallPost(length: number): string {
        let post: string = "";
        let possible: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < length; i++) {
            post += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return post;
    }

    private async prepareGroup(): Promise<number> {
        let result: Array<number>
        let groups: GroupsGetExtendedResponse = await this.vkApi.groupsGetExtended({
            user_id: this.hostId,
            extended: true,
            access_token: this.hostToken
        })

        result = groups.items.filter(i => i.name === this.groupName).map(i => i.id)

        if (result.length == 0) {
            let createdGroup: GroupsGroup = await this.vkApi.groupsCreate({
                title: this.groupName,
                access_token:this.hostToken})
            result.push(createdGroup.id)
        }

        return result[0]
    }

    private async addUsersToGroup(groupId: number): Promise<void> {
        this.usersData.forEach((async (value, key, map) => {
            let isMember: number = await this.vkApi.groupsIsMember({
                group_id: groupId.toString(),
                user_id: key,
                access_token: value
            })

            if (isMember == 0) {
                await this.vkApi.groupsJoin({
                    group_id: groupId,
                    access_token: value
                })
            }
        }))
    }

    private async prepareGroupWall(groupId: number): Promise<void> {
        let wallRes: WallGetResponse = await this.vkApi.wallGet({
            owner_id: -groupId,
            access_token: this.hostToken
        })
        if (wallRes.items.length < this.wallItemsCount) {
            let diff: number = this.wallItemsCount - wallRes.items.length
            for (let i = 0; i < diff; i++) {
                let randomMessage = this.generateRandomWallPost(Math.random() * 100);
                setTimeout(async () => {
                    await this.vkApi.wallPost({
                        owner_id: -groupId,
                        message: randomMessage,
                        access_token: this.hostToken
                    })
                }, this.rpsTimeout)
            }
        }
    }
}