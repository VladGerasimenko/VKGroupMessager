import * as MethodsProps from "node-vk-sdk/src/generated/MethodsProps";
import * as Responses from "node-vk-sdk/src/generated/Responses";
import {VKApi} from "node-vk-sdk";
import {VKApiOptions} from "node-vk-sdk/src/api/BaseVKApi";

export class VKApiExtended extends VKApi{
    constructor(options: VKApiOptions) {
        super(options);
    }
    public async groupsGetExtended(params: MethodsProps.GroupsGetParams): Promise<Responses.GroupsGetExtendedResponse> {
        return super.call("groups.get", params)
    }
}