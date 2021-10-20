import { IdentityInterface, ServiceDefinitionTagEnum, tag } from "@pristine-ts/common";
import { injectable, inject } from "tsyringe";
import { IdentityProviderInterface } from "@pristine-ts/security/dist/types/interfaces/identity-provider.interface";
import { AppModuleKeyname } from "../app.module";
import { LogHandlerInterface } from "@pristine-ts/logging";
import { UserIdentityInterface } from "../interfaces/user-identity.interface";

@tag(ServiceDefinitionTagEnum.IdentityProvider)
@injectable()
export class AppIdentityProvider implements IdentityProviderInterface {

    constructor(@inject(`%${AppModuleKeyname}.namespace%`) private readonly namespace: string,
                @inject("LogHandlerInterface") private readonly logHandler: LogHandlerInterface) {
    }

    async provide(identity: IdentityInterface): Promise<UserIdentityInterface> {
        this.logHandler.debug("Providing App identity", {identity, namespace: this.namespace});
        if(!identity.claims) {
            return identity;
        }
        const userIdentity: UserIdentityInterface = identity;
        userIdentity.email = identity.claims[this.namespace + '/email'];
        userIdentity.phoneNumber = identity.claims[this.namespace + '/phoneNumber'];
        userIdentity.firstName = identity.claims[this.namespace + '/firstName'];
        userIdentity.lastName = identity.claims[this.namespace + '/lastName'];
        userIdentity.roles = identity.claims[this.namespace + '/roles'];
        return userIdentity;
    }
}
