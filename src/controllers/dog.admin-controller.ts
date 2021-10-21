import {injectable} from "tsyringe";
import {body, controller, identity, responseHeader, route, routeParameter} from "@pristine-ts/networking";
import {authenticator, guard, PermissionManager, ResourceActionEnum, RoleGuard} from "@pristine-ts/security";
import {HttpMethod, IdentityInterface} from "@pristine-ts/common";
import {Auth0Authenticator} from "@pristine-ts/auth0";
import {DogManager} from "../managers/dog.manager";
import {DogModel} from "../models/dog.model";
import { UserIdentityInterface } from "../interfaces/user-identity.interface";

@injectable()
@controller("/api/admin/dogs")
@authenticator(Auth0Authenticator)
@guard(RoleGuard, {roles: ["ADMIN"]})
@responseHeader("Cache-Control", "no-cache")
export class DogAdminController {
    constructor(private readonly permissionManager: PermissionManager,
                private readonly dogManager: DogManager,) {
    }

    @route(HttpMethod.Get, "")
    async listAll(@identity() identity: UserIdentityInterface) {
        await this.permissionManager.hasAccessToResource(identity, ResourceActionEnum.List, new DogModel());
        return this.dogManager.list();
    }
}
