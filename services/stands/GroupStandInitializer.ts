import {GroupsGetExtendedResponse, WallGetResponse} from "node-vk-sdk/distr/src/generated/Responses";
import {GroupsGroup} from "node-vk-sdk/distr/src/generated/Models";
import {AbstractStand} from "./AbstractStand";
import {Utils} from "../Utils";

export class GroupStandInitializer extends AbstractStand{
    private groupStandData: Map<string, any> = new Map<string, any>()

    constructor() {
        super();
    }

    public async initGroupStand(): Promise<Map<string, any>> {
        let groupId: number = await this.prepareGroup()
        this.addUsersToGroup(groupId).then(() => {
            this.prepareGroupWall(groupId)
        })
        this.groupStandData.set("groupId", groupId)
        this.groupStandData.set("usersData", this.usersData)
        return this.groupStandData
    }

    public async destroyGroupStand(): Promise<void> {
        await this.removeUsersFromGroup()
    }

    private async prepareGroup(): Promise<number> {
        let result: Array<number> = []

        await this.vkApi.groupsGetExtended({
                user_id: this.hostId,
                extended: true,
                access_token: this.hostToken
            }).then(async res => {
                result = res.items.filter(i => i.name === this.groupName).map(i => i.id)
                if (result.length == 0) {
                    this.vkApi.groupsCreate({
                        title: this.groupName,
                        access_token: this.hostToken
                    }).then(res => {
                        result.push(res.id)
                    })
                }
        })
        return result[0]
    }

    private async removeUsersFromGroup(): Promise<void> {
        this.usersData.forEach((async (value, key, map) => {
                await this.vkApi.groupsLeave({
                    group_id: this.groupStandData.get('groupId'),
                    access_token: value
                })
        }))
    }

    private async addUsersToGroup(groupId: number): Promise<void> {
        // this.usersData.forEach((async (value, key, map) => {
        //     let isMember: number = await this.vkApi.groupsIsMember({
        //         group_id: groupId.toString(),
        //         user_id: key,
        //         access_token: value
        //     })
        //
        //     if (isMember == 0) {
        //         await this.vkApi.groupsJoin({
        //             group_id: groupId,
        //             access_token: value
        //         })
        //     }
        // }))

        this.usersData.forEach((value, key, map) => {
            this.vkApi.groupsIsMember({
                group_id: groupId.toString(),
                user_id: key,
                access_token: value
            }).then(res => {
                if (res == 0) {
                    this.vkApi.groupsJoin({
                        group_id: groupId,
                        access_token: value
                    })
                }
            })
        })
    }

    private async prepareGroupWall(groupId: number): Promise<void> {
        this.vkApi.wallGet({
                owner_id: -groupId,
                access_token: this.hostToken
            }).then(res => {
            if (res.items.length < this.wallItemsCount) {
                let diff: number = this.wallItemsCount - res.items.length
                for (let i = 0; i < diff; i++) {
                    let randomMessage = Utils.generateRandomWallPost(Math.random() * 100);
                    setTimeout(() => {
                        this.vkApi.wallPost({
                            owner_id: -groupId,
                            message: randomMessage,
                            access_token: this.hostToken
                        })
                    }, i * this.rpsTimeout)
                }
            }
        })
    }
}