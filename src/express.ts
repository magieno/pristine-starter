import "reflect-metadata";
import {RequestMapper, ResponseMapper} from "@pristine-ts/express";
import {Kernel} from "@pristine-ts/core";
import { AppModule, AppModuleKeyname } from "./app.module";
import { AwsModuleKeyname } from "@pristine-ts/aws";
import { EnvironmentVariableResolver } from "@pristine-ts/configuration";

const express = require('express')
const app = express()
const port = 3000
const kernel = new Kernel();

const bootstrap = () => {
    app.all('*', async (req, res) => {
        const expressRequestMapper = kernel.container.resolve(RequestMapper);
        const expressResponseMapper = kernel.container.resolve(ResponseMapper);

        expressResponseMapper.reverseMap(await kernel.handleRequest(expressRequestMapper.map(req)), res);
    })

    app.listen(port, async () => {
        try {
            await kernel.init(AppModule,
                {
                    [`${AwsModuleKeyname}.region`]: await (new EnvironmentVariableResolver("REGION").resolve()),
                }
            );
        } catch (e) {
            console.log(e);
            throw e;
        }

        console.log(`Pristine starter listening at http://localhost:${port}`)
    })
}

bootstrap();
