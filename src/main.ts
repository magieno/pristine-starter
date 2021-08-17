import {AppModule} from './app.module';
import {Kernel} from "@pristine-ts/core";

const bootstrap = async () => {
    const kernel = new Kernel();
    await kernel.init(AppModule);
}

bootstrap();
