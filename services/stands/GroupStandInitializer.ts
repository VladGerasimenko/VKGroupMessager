import {GroupsGetExtendedResponse, WallGetResponse} from "node-vk-sdk/distr/src/generated/Responses";
import {GroupsGroup} from "node-vk-sdk/distr/src/generated/Models";
import {AbstractStand} from "./AbstractStand";
import {delay} from "node-vk-sdk/distr/src/api/time";

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

    private async removeUsersFromGroup(): Promise<void> {
        this.usersData.forEach((async (value, key, map) => {
                await this.vkApi.groupsLeave({
                    group_id: this.groupStandData.get('groupId'),
                    access_token: value
                })
        }))
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
                await delay(this.rpsTimeout).then(() => {
                    this.vkApi.wallPost({
                        owner_id: -groupId,
                        message: randomMessage,
                        access_token: this.hostToken
                    })
                })
            }
        }
    }
}