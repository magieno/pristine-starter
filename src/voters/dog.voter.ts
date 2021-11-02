import {ResourceActionEnum, VoteEnum, VoterInterface} from "@pristine-ts/security";
import {IdentityInterface, ServiceDefinitionTagEnum, tag} from "@pristine-ts/common";
import {injectable} from "tsyringe";
import {DogModel} from "../models/dog.model";
import {DogVoteSubject} from "../vote-subjects/dog.vote-subject";
import { UserIdentityInterface } from "../interfaces/user-identity.interface";
import { IdentityRoleEnum } from "../enums/identity-role.enum";

@tag(ServiceDefinitionTagEnum.Voter)
@injectable()
export class DogVoter implements VoterInterface {

    constructor(){}

    supports(resource: object): boolean {
        return resource instanceof DogModel || resource instanceof DogVoteSubject;
    }

    createVoteSubject(resource: object): DogVoteSubject {
        if (resource instanceof DogModel) {
            return  new DogVoteSubject(resource.ownerId, undefined, resource);
        } else if (resource instanceof DogVoteSubject) {
            return resource;
        } else {
            throw new Error();
        }
    }

    async vote(identity: UserIdentityInterface, action: string, resource: object): Promise<VoteEnum> {
        if (identity.roles && identity.roles.includes(IdentityRoleEnum.Admin)) {
            return VoteEnum.Grant;
        }

        const dogVoteSubject = this.createVoteSubject(resource);

        if (action === ResourceActionEnum.Read) {
            if (dogVoteSubject.ownerId === identity.id){
                return VoteEnum.Grant;
            }

            return VoteEnum.Deny
        }

        if (action === ResourceActionEnum.Create) {
            return VoteEnum.Grant
        }

        if (action === ResourceActionEnum.Update) {
            if (dogVoteSubject.ownerId === identity.id){
                return VoteEnum.Grant;
            }

            return VoteEnum.Deny
        }

        return VoteEnum.Deny
    }

}
