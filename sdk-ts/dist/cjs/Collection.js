"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const api_1 = require("./api");
const neon_js_1 = require("@cityofzion/neon-js");
const config_1 = require("./constants/config");
const neon_dappkit_1 = require("@cityofzion/neon-dappkit");
const helpers_1 = require("./helpers");
const DEFAULT_OPTIONS = {
    node: config_1.NetworkOption.MainNet,
    scriptHash: '0xf05651bc505fd5c7d36593f6e8409932342f9085',
    parser: neon_dappkit_1.NeonParser,
    account: undefined,
};
const TIMEOUT = 60000;
/**
 * The Collection prop is designed to store static-immutable data for reference in other projects. Storing static data
 * in contracts is very expensive and inefficient, especially for new projects. This contract resolves that issue by creating
 * library for static data. This class exposes the interface along with a number of helpful features to make the smart
 * contract easy to use for typescript developers.
 *
 * All of the prop helper classes will auto-configure your network settings. The default configuration will interface with
 * the contract on MainNet, but this can be configured by providing configuration options.
 *
 * @example
 * To use this class:
 * ```typescript
 * import { Collection } from "../../dist" //import { Collection } from "@cityofzion/props-collection"
 *
 * const collection: Collection = new Collection()
 * const total = await collection.totalCollections()
 * console.log(total) // outputs the total collection count in the contract
 * ```
 */
class Collection {
    constructor(configOptions = {}) {
        this.initialized = 'invoker' in configOptions;
        this.config = { ...DEFAULT_OPTIONS, ...configOptions };
    }
    /**
     * DO NOT EDIT ME
     * The contract script hash that is being interfaced with.
     */
    get scriptHash() {
        if (this.config.scriptHash) {
            return this.config.scriptHash;
        }
        throw new Error('no scripthash defined');
    }
    get node() {
        if (this.config.node) {
            return new neon_js_1.rpc.RPCClient(this.config.node);
        }
        throw new Error('no node selected!');
    }
    async init() {
        if (!this.initialized) {
            this.config.invoker = await neon_dappkit_1.NeonInvoker.init({
                rpcAddress: this.config.node,
                account: this.config.account,
            });
            this.initialized = true;
        }
        return true;
    }
    /// ///////////////////////////////////////////////////
    /// ///////////////////////////////////////////////////
    /// /////////////CONTRACT METHODS//////////////////////
    /// ///////////////////////////////////////////////////
    /// ///////////////////////////////////////////////////
    /**
     * Publishes an array of immutable data to the smart contract along with some useful metadata.
     *
     * @param params.description A useful description of the collection.
     * @param params.collectionType The type of the data being store. This is an unregulated field. Standard NVM datatypes should
     * adhere to existing naming conventions.
     * @param params.extra An unregulated field for unplanned feature development.
     * @param params.values An array of values that represent the body of the collection.
     * @param {InvocationOptions} [opts]
     * @param opts.timeout A number value in microseconds indicating how long the function should wait for the transaction to be completed.
     * This property only affects synchronous methods.
     *
     * @returns A transaction ID. Refer to {@link Utils.transactionCompletion} for parsing the response.
     */
    async createCollection(params, opts) {
        await this.init();
        return await this.config.invoker.invokeFunction({
            invocations: [api_1.CollectionAPI.createCollection(this.config.scriptHash, params)],
            signers: [],
        });
    }
    /**
     * Publishes an array of immutable data to the smart contract along with some useful metadata, and waits for the transaction to be completed.
     *
     * @param params.description A useful description of the collection.
     * @param params.collectionType The type of the data being store. This is an unregulated field. Standard NVM datatypes should
     * adhere to existing naming conventions.
     * @param params.extra An unregulated field for unplanned feature development.
     * @param params.values An array of values that represent the body of the collection.
     * @param {InvocationOptions} [opts]
     * @param opts.timeout A number value in microseconds indicating how long the function should wait for the transaction to be completed.
     * This property only affects synchronous methods.
     *
     * @returns The new collection ID.
     */
    async createCollectionSync(params, opts) {
        await this.init();
        const txId = await this.config.invoker.invokeFunction({
            invocations: [api_1.CollectionAPI.createCollection(this.config.scriptHash, params)],
            signers: [],
        });
        const resp = await helpers_1.Utils.transactionCompletion(txId, {
            timeout: opts?.timeout ?? TIMEOUT,
            node: this.config.node,
        });
        return resp.parsedStack[0];
    }
    /**
     * Gets a JSON formatting collection from the smart contract.
     *
     * @param params.collectionId The collectionID being requested. Refer to {@link https://props.coz.io} for a formatted list.
     *
     * @returns The requested collection.
     */
    async getCollectionJSON(params) {
        await this.init();
        const res = await this.config.invoker.testInvoke({
            invocations: [api_1.CollectionAPI.getCollectionJSON(this.config.scriptHash, params)],
            signers: [],
        });
        if (res.stack.length === 0) {
            throw new Error(res.exception ?? 'unrecognized response');
        }
        return this.config.parser.parseRpcResponse(res.stack[0]);
    }
    /**
     * Gets the bytestring representation of the collection. This is primarily used for inter-contract interfacing,
     * but we include it here for completeness.
     *
     * @param params.collectionId The collectionID being requested. Refer to {@link https://props.coz.io} for a formatted list.
     *
     * @returns The bytestring representation of the collection.
     */
    async getCollection(params) {
        await this.init();
        const res = await this.config.invoker.testInvoke({
            invocations: [api_1.CollectionAPI.getCollection(this.config.scriptHash, params)],
            signers: [],
        });
        if (res.stack.length === 0) {
            throw new Error(res.exception ?? 'unrecognized response');
        }
        return this.config.parser.parseRpcResponse(res.stack[0]);
    }
    /**
     * Returns the value of a collection from a requested index.
     *
     * @param params.collectionId The collectionID being requested. Refer to {@link https://props.coz.io} for a formatted list.
     * @param params.index The index of the array element being requested.
     *
     * @returns The value of the collection element.
     */
    async getCollectionElement(params) {
        await this.init();
        const res = await this.config.invoker.testInvoke({
            invocations: [api_1.CollectionAPI.getCollectionElement(this.config.scriptHash, params)],
            signers: [],
        });
        if (res.stack.length === 0) {
            throw new Error(res.exception ?? 'unrecognized response');
        }
        return this.config.parser.parseRpcResponse(res.stack[0]);
    }
    /**
     * Gets the array length of a requested collection.
     *
     * @param params.collectionId The collectionID being requested. Refer to {@link https://props.coz.io} for a formatted list.
     *
     * @returns The length of the collection.
     */
    async getCollectionLength(params) {
        await this.init();
        const res = await this.config.invoker.testInvoke({
            invocations: [api_1.CollectionAPI.getCollectionLength(this.config.scriptHash, params)],
            signers: [],
        });
        if (res.stack.length === 0) {
            throw new Error(res.exception ?? 'unrecognized response');
        }
        return this.config.parser.parseRpcResponse(res.stack[0]);
    }
    /**
     * Gets the values of a collection, omitting the metadata.
     *
     * @param params.collectionId The collectionID being requested. Refer to {@link https://props.coz.io} for a formatted list.
     *
     * @returns The values in the collection.
     */
    async getCollectionValues(params) {
        await this.init();
        const res = await this.config.invoker.testInvoke({
            invocations: [api_1.CollectionAPI.getCollectionValues(this.config.scriptHash, params)],
            signers: [],
        });
        if (res.stack.length === 0) {
            throw new Error(res.exception ?? 'unrecognized response');
        }
        return this.config.parser.parseRpcResponse(res.stack[0]);
    }
    /**
     * Maps byte entropy onto a collection's values and returns the index of the result. The mapping is made as follows:
     *
     * [0 -> MAX(entropyBytes.length)][entropy] -> [0 -> collection.length][index]
     *
     * This method is primarily useful for computationally efficient contract interfacing. For random sampling, or
     * sampling from a distribution, use {@link getCollectionLength} in combination with {@link getCollectionElement} or
     * {@link sampleFromCollection}.
     *
     * @param params.collectionId The collectionID being requested. Refer to {@link https://props.coz.io} for a formatted list.
     * @param params.entropy Bytes to use for the mapping.
     * @param {InvocationOptions} [opts]
     * @param opts.timeout A number value in microseconds indicating how long the function should wait for the transaction to be completed.
     * This property only affects synchronous methods.
     *
     * @returns A transaction ID. This result uses RNG features managed by the consensus nodes and only functions properly
     * with a published transaction. Refer to {@link Utils.transactionCompletion} for parsing the response.
     */
    async mapBytesOntoCollection(params, opts) {
        await this.init();
        return await this.config.invoker.invokeFunction({
            invocations: [api_1.CollectionAPI.mapBytesOntoCollection(this.config.scriptHash, params)],
            signers: [],
        });
    }
    /**
     * Maps byte entropy onto a collection's values and returns the index of the result, and waits for the transaction to be completed.
     * The mapping is made as follows:
     *
     * [0 -> MAX(entropyBytes.length)][entropy] -> [0 -> collection.length][index]
     *
     * This method is primarily useful for computationally efficient contract interfacing. For random sampling, or
     * sampling from a distribution, use {@link getCollectionLength} in combination with {@link getCollectionElement} or
     * {@link sampleFromCollection}.
     *
     * @param params.collectionId The collectionID being requested. Refer to {@link https://props.coz.io} for a formatted list.
     * @param params.entropy Bytes to use for the mapping.
     * @param {InvocationOptions} [opts]
     * @param opts.timeout A number value in microseconds indicating how long the function should wait for the transaction to be completed.
     * This property only affects synchronous methods.
     *
     * @returns A collection value. This result uses RNG features managed by the consensus nodes and only functions properly
     * with a published transaction.
     */
    async mapBytesOntoCollectionSync(params, opts) {
        await this.init();
        const txId = await this.config.invoker.invokeFunction({
            invocations: [api_1.CollectionAPI.mapBytesOntoCollection(this.config.scriptHash, params)],
            signers: [],
        });
        const resp = await helpers_1.Utils.transactionCompletion(txId, {
            timeout: opts?.timeout ?? TIMEOUT,
            node: this.config.node,
        });
        return resp.parsedStack[0];
    }
    /**
     * Samples a uniform random value from the collection using a Contract.Call to the {@link https://github.com/CityOfZion/props_dice | Dice} contract.
     *
     * @param params.collectionId The collectionID being requested. Refer to {@link https://props.coz.io} for a formatted list.
     * @param params.samples The number of samples to return
     * @param {InvocationOptions} [opts]
     * @param opts.timeout A number value in microseconds indicating how long the function should wait for the transaction to be completed.
     * This property only affects synchronous methods.
     *
     * @returns A transaction ID. This result uses RNG features managed by the consensus nodes and only functions properly
     * with a published transaction. Refer to {@link Utils.transactionCompletion} for parsing the response.
     */
    async sampleFromCollection(params, opts) {
        await this.init();
        return await this.config.invoker.invokeFunction({
            invocations: [api_1.CollectionAPI.sampleFromCollection(this.config.scriptHash, params)],
            signers: [],
        });
    }
    /**
     * Samples a uniform random value from the collection using a Contract.Call to the {@link https://github.com/CityOfZion/props_dice | Dice} contract,
     * and waits for the transaction to be completed.
     *
     * @param params.collectionId The collectionID being requested. Refer to {@link https://props.coz.io} for a formatted list.
     * @param params.samples The number of samples to return
     * @param {InvocationOptions} [opts]
     * @param opts.timeout A number value in microseconds indicating how long the function should wait for the transaction to be completed.
     * This property only affects synchronous methods.
     *
     * @returns A list of values. This result uses RNG features managed by the consensus nodes and only functions properly
     * with a published transaction.
     */
    async sampleFromCollectionSync(params, opts) {
        await this.init();
        const txId = await this.config.invoker.invokeFunction({
            invocations: [api_1.CollectionAPI.sampleFromCollection(this.config.scriptHash, params)],
            signers: [],
        });
        const resp = await helpers_1.Utils.transactionCompletion(txId, {
            timeout: opts?.timeout ?? TIMEOUT,
            node: this.config.node,
        });
        return resp.parsedStack[0];
    }
    /**
     * Samples uniformly from a collection provided at the time of invocation. Users have the option to 'pick', which
     * prevents a value from being selected multiple times. The results are published as outputs on the transaction.
     *
     * @param params.values an array of values to sample from
     * @param params.samples the number of samples to fairly select from the values
     * @param params.pick Are selected values removed from the list of options for future samples?
     * @param {InvocationOptions} [opts]
     * @param opts.timeout A number value in microseconds indicating how long the function should wait for the transaction to be completed.
     * This property only affects synchronous methods.
     *
     * @returns A transaction ID. This result uses RNG features managed by the consensus nodes and only functions properly
     * with a published transaction. Refer to {@link Utils.transactionCompletion} for parsing the response.
     */
    async sampleFromRuntimeCollection(params, opts) {
        await this.init();
        return await this.config.invoker.invokeFunction({
            invocations: [api_1.CollectionAPI.sampleFromRuntimeCollection(this.config.scriptHash, params)],
            signers: [],
        });
    }
    /**
     * Samples uniformly from a collection provided at the time of invocation, and waits for the transaction to be completed.
     * Users have the option to 'pick', which prevents a value from being selected multiple times.
     * The results are published as outputs on the transaction.
     *
     * @param params.values an array of values to sample from
     * @param params.samples the number of samples to fairly select from the values
     * @param params.pick Are selected values removed from the list of options for future samples?
     * @param {InvocationOptions} [opts]
     * @param opts.timeout A number value in microseconds indicating how long the function should wait for the transaction to be completed.
     * This property only affects synchronous methods.
     *
     * @returns A list of values. This result uses RNG features managed by the consensus nodes and only functions properly
     * with a published transaction.
     */
    async sampleFromRuntimeCollectionSync(params, opts) {
        await this.init();
        const txId = await this.config.invoker.invokeFunction({
            invocations: [api_1.CollectionAPI.sampleFromRuntimeCollection(this.config.scriptHash, params)],
            signers: [],
        });
        const resp = await helpers_1.Utils.transactionCompletion(txId, {
            timeout: opts?.timeout ?? TIMEOUT,
            node: this.config.node,
        });
        return resp.parsedStack[0];
    }
    /**
     * Gets the total collections. Collection IDs are autogenerated on range [1 -> totalCollections] inclusive if you are
     * planning to iterate their collection IDs.
     *
     * @returns The total number of collections stored in the contract.
     */
    async totalCollections() {
        await this.init();
        const res = await this.config.invoker.testInvoke({
            invocations: [api_1.CollectionAPI.totalCollections(this.config.scriptHash)],
            signers: [],
        });
        if (res.stack.length === 0) {
            throw new Error(res.exception ?? 'unrecognized response');
        }
        return this.config.parser.parseRpcResponse(res.stack[0]);
    }
    /**
     * Updates the contract
     * @param params
     * @param {InvocationOptions} [opts]
     * @param opts.timeout A number value in microseconds indicating how long the function should wait for the transaction to be completed.
     * This property only affects synchronous methods.
     *
     * @returns A transaction ID. Refer to {@link Utils.transactionCompletion} for parsing the response.
     */
    async update(params, opts) {
        await this.init();
        return await this.config.invoker.invokeFunction({
            invocations: [api_1.CollectionAPI.update(this.config.scriptHash, params)],
            signers: [],
        });
    }
    /**
     * Updates the contract, and waits for the transaction to be completed.
     * @param params
     * @param {InvocationOptions} [opts]
     * @param opts.timeout A number value in microseconds indicating how long the function should wait for the transaction to be completed.
     * This property only affects synchronous methods.
     *
     * @returns Nothing if the update succeeds.
     */
    async updateSync(params, opts) {
        await this.init();
        const txId = await this.config.invoker.invokeFunction({
            invocations: [api_1.CollectionAPI.update(this.config.scriptHash, params)],
            signers: [],
        });
        await helpers_1.Utils.transactionCompletion(txId, {
            timeout: opts?.timeout ?? TIMEOUT,
            node: this.config.node,
        });
    }
}
exports.Collection = Collection;
//# sourceMappingURL=Collection.js.map