import { IdentityInterface, ServiceDefinitionTagEnum, tag } from "@pristine-ts/common";
import { injectable, inject } from "tsyringe";
import { IdentityProviderInterface } from "@pristine-ts/security/dist/types/interfaces/identity-provider.interface";
import { AppModuleKeyname } from "../app.module";
import { LogHandlerInterface } from "@pristine-ts/logging";
import { UserIdentityInterface } from "../interfaces/user-identity.interface";

/**
 * The app identity provider is a way of extending the base Identity Provider in Pristine.
 * This way, we can easily type the identity with a new interface that is specific to our app (in this case UserIdentityInterface).
 * AppIdentityProvider gives us the chance to map the decoded identity to our type.
 *
 * Don't forget to add the tag ServiceDefinitionTagEnum.IdentityProvider, so that our provider gets called automatically when
 * Pristine receives a request !
 */
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
