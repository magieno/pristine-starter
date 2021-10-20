import "reflect-metadata";
import { AppModule, AppModuleKeyname } from './app.module';
import {Kernel} from "@pristine-ts/core";
import { AwsModuleKeyname } from "@pristine-ts/aws";
import { EnvironmentVariableResolver } from "@pristine-ts/configuration";

const bootstrap = async () => {
    const kernel = new Kernel();
    await kernel.init(AppModule,
        {
            [`${AwsModuleKeyname}.region`] : await (new EnvironmentVariableResolver("REGION").resolve()),
        }
    );
}

bootstrap();
