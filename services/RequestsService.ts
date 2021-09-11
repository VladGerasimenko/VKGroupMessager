import {VKAPIInitializer} from "./VKAPIInitializer";
import {Utils} from "./Utils";

export class RequestsService extends VKAPIInitializer{
    constructor(private readonly initData: Map<string, any>) {
        super();
    }

    public addLikesToRandomGroupPosts(groupId: number, likesCount: number): void {
        let user: Map<number, string> = Utils.getRandomEntryFromMap(this.initData.get('usersData'))
        this.vkApi.wallGet({
            owner_id: -groupId,
            access_token: user.values().next().value
        }).then(res => {
            let posts: Array<number> = res.items.map(post => post.id)
            for (let i = 0; i < likesCount; i++) {
                let currentPost: number = Utils.getRandomValueFromArray(posts)
                let currentUserToken: string = Utils.getRandomEntryFromMap(this.initData.get('usersData'))
                    .values().next().value
                delete posts[posts.indexOf(currentPost)]
                this.vkApi.likesAdd({
                    type: 'post',
                    owner_id: groupId,
                    item_id: currentPost,
                    access_token: currentUserToken
                })
            }
        })
    }
}