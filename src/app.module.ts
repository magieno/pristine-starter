import {AppModuleInterface} from "@pristine-ts/common";
import {AwsModule} from "@pristine-ts/aws";
import {NetworkingModule} from "@pristine-ts/networking";
import {CoreModule} from "@pristine-ts/core";
import {LoggingModule} from "@pristine-ts/logging";
import {SecurityModule} from "@pristine-ts/security";
import {TelemetryModule} from "@pristine-ts/telemetry";
import {RedisModule} from "@pristine-ts/redis";
import {ValidationModule} from "@pristine-ts/validation";
import {AwsXrayModule} from "@pristine-ts/aws-xray";
import {Auth0Module} from "@pristine-ts/auth0";
import {HttpModule} from "@pristine-ts/http";
import {StripeModule} from "@pristine-ts/stripe";
import {DogRepository} from "./repositories/dog.repository";

export const AppModuleKeyname =  "pristine.starter";

export const AppModule: AppModuleInterface = {
    //
    // IMPORTANT
    // Do not forget to import all of your services here to make sure they are available.
    //
    importServices: [

        // Repositories
        DogRepository,

        // Voters
        DogVoter
    ],
    importModules: [
        AwsModule,
        Auth0Module,
        AwsXrayModule,
        CoreModule,
        HttpModule,
        LoggingModule,
        NetworkingModule,
        RedisModule,
        SecurityModule,
        StripeModule,
        ValidationModule,
        TelemetryModule,
    ],
    keyname: AppModuleKeyname,
    configurationDefinitions: [
    ]
};
