import { IdentityInterface } from "@pristine-ts/common";

export interface UserIdentityInterface extends IdentityInterface {
    roles?: string[];
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
}
