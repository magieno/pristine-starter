import "reflect-metadata";
import {AppModule} from './app.module';
import {Kernel} from "@pristine-ts/core";
import {Context} from "aws-lambda";
import {AwsModule, RequestMapper, ResponseMapper} from "@pristine-ts/aws";
import {LogHandler} from "@pristine-ts/logging";
import {EnvironmentVariableResolver} from "@pristine-ts/configuration";

import {randomBytes} from 'crypto';
//
// ========
// Polyfill for NodeJS 14
// This is needed for application running in NodeJS14 and since AWS lambda does not yet support NodeJS16 we need this in lambda.ts
// ========
//

/**
 * @param {TypedArray} ta
 * @returns {(df: DataView, i: number) => number}
 */
const getMethod = (ta) => {
    if (ta instanceof Int8Array) return (df, i) => df.getInt8(i)
    if (ta instanceof Uint8Array) return (df, i) => df.getUint8(i)
    if (ta instanceof Uint8ClampedArray) return (df, i) => df.getUint8(i)
    if (ta instanceof Int16Array) return (df, i) => df.getInt16(i)
    if (ta instanceof Uint16Array) return (df, i) => df.getUint16(i)
    if (ta instanceof Int32Array) return (df, i) => df.getInt32(i)
    if (ta instanceof Uint32Array) return (df, i) => df.getUint32(i)
    if (ta instanceof Float32Array) return (df, i) => df.getFloat32(i)
    if (ta instanceof Float64Array) return (df, i) => df.getFloat64(i)
    if (ta instanceof BigInt64Array) return (df, i) => df.getBigInt64(i)
    if (ta instanceof BigUint64Array) return (df, i) => df.getBigUint64(i)
    throw Error('Unknown typed array')
}

/**
 * @typedef {Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} TypedArray
 */

/**
 * Polyfill for `crypto.getRandomValues` for node, using node's `crypto` module.
 * @param {TypedArray} typedArray A typed array to be filled with random data.
 * @returns {TypedArray} The same typed array filled with random data.
 */
const getRandomValues = (typedArray) => {
    const { BYTES_PER_ELEMENT, length } = typedArray;
    const totalBytes = BYTES_PER_ELEMENT * length;
    const { buffer } = randomBytes(totalBytes);
    const dataView = new DataView(buffer);
    const method = getMethod(typedArray);
    for (let byteIndex = 0; byteIndex < totalBytes; byteIndex += BYTES_PER_ELEMENT) {
        const integer = method(dataView, byteIndex);
        const arrayIndex = byteIndex / BYTES_PER_ELEMENT;
        typedArray[arrayIndex] = integer;
    }
    return typedArray;
}

// @ts-ignore
if (typeof global.crypto !== 'object') {
    // @ts-ignore
    global.crypto = {}
}

// @ts-ignore
if (typeof global.crypto.getRandomValues !== 'function') {
    // @ts-ignore
    global.crypto.getRandomValues = getRandomValues
}
//
// ========
//

let cachedKernel;

export const bootstrapKernel = async () => {
    const kernel = new Kernel();
    await kernel.init(AppModule,
        {
            [AwsModule.keyname + ".region"] : await (new EnvironmentVariableResolver("REGION").resolve()),
        }
    );

    return kernel;
};

export const handler = async (event: any, context: Context) => {
    cachedKernel = cachedKernel ?? await bootstrapKernel();

    const apiGatewayRequestMapper = cachedKernel.container.resolve(RequestMapper);
    const apiGatewayResponseMapper = cachedKernel.container.resolve(ResponseMapper);
    const logHandler = cachedKernel.container.resolve(LogHandler);
    logHandler.debug("Event", {event});

    const request = apiGatewayRequestMapper.map(event);
    logHandler.debug("Mapped request", {request});


    return apiGatewayResponseMapper.reverseMap(await cachedKernel.handleRequest(request));
};
