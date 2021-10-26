import {injectable} from "tsyringe";
import {body, controller, identity, responseHeader, route, routeParameter} from "@pristine-ts/networking";
import {authenticator, guard, PermissionManager, ResourceActionEnum, RoleGuard} from "@pristine-ts/security";
import {HttpMethod, IdentityInterface} from "@pristine-ts/common";
import {Auth0Authenticator} from "@pristine-ts/auth0";
import {bodyValidation} from "@pristine-ts/validation";
import {DogManager} from "../managers/dog.manager";
import { DogCreationOrUpdateOptions } from "../options/dog.creation-or-update-options";
import { DogVoteSubject } from "../vote-subjects/dog.vote-subject";
import { UserIdentityInterface } from "../interfaces/user-identity.interface";

@injectable()
@controller("/api/dogs")
@authenticator(Auth0Authenticator)
@guard(RoleGuard, {roles: ["USER"]})
@responseHeader("Cache-Control", "no-cache")
export class DogController {
    constructor(private readonly permissionManager: PermissionManager,
                private readonly dogManager: DogManager,) {
    }

    @route(HttpMethod.Post, "")
    @bodyValidation(DogCreationOrUpdateOptions)
    async create(@identity() identity: UserIdentityInterface, @body() options: DogCreationOrUpdateOptions) {
        const voteSubject = new DogVoteSubject(identity.id, options);
        await this.permissionManager.hasAccessToResource(identity, ResourceActionEnum.Create, voteSubject);

        return this.dogManager.create(identity.id, options);
    }

    @route(HttpMethod.Get, ":id")
    async get(@identity() identity: UserIdentityInterface, @routeParameter("id") id: string) {
        const dog = await this.dogManager.get(id);
        await this.permissionManager.hasAccessToResource(identity, ResourceActionEnum.Read, dog);

        return dog
    }
}
