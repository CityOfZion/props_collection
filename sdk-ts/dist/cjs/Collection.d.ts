import { ConstructorOptions, InvocationOptions } from './types';
import { rpc as coreRpc } from '@cityofzion/neon-core';
import { CreateCollection, GetCollection, GetCollectionElement, GetCollectionJSON, GetCollectionLength, GetCollectionValues, MapBytesOntoCollection, SampleFromCollection, SampleFromRuntimeCollection, Update } from './types/manifest';
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
export declare class Collection {
    private config;
    private initialized;
    constructor(configOptions?: ConstructorOptions);
    /**
     * DO NOT EDIT ME
     * The contract script hash that is being interfaced with.
     */
    get scriptHash(): string;
    get node(): coreRpc.RPCClient;
    init(): Promise<boolean>;
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
    createCollection(params: CreateCollection, opts?: InvocationOptions): Promise<string>;
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
    createCollectionSync(params: CreateCollection, opts?: InvocationOptions): Promise<number>;
    /**
     * Gets a JSON formatting collection from the smart contract.
     *
     * @param params.collectionId The collectionID being requested. Refer to {@link https://props.coz.io} for a formatted list.
     *
     * @returns The requested collection.
     */
    getCollectionJSON(params: GetCollectionJSON): Promise<any>;
    /**
     * Gets the bytestring representation of the collection. This is primarily used for inter-contract interfacing,
     * but we include it here for completeness.
     *
     * @param params.collectionId The collectionID being requested. Refer to {@link https://props.coz.io} for a formatted list.
     *
     * @returns The bytestring representation of the collection.
     */
    getCollection(params: GetCollection): Promise<any>;
    /**
     * Returns the value of a collection from a requested index.
     *
     * @param params.collectionId The collectionID being requested. Refer to {@link https://props.coz.io} for a formatted list.
     * @param params.index The index of the array element being requested.
     *
     * @returns The value of the collection element.
     */
    getCollectionElement(params: GetCollectionElement): Promise<any>;
    /**
     * Gets the array length of a requested collection.
     *
     * @param params.collectionId The collectionID being requested. Refer to {@link https://props.coz.io} for a formatted list.
     *
     * @returns The length of the collection.
     */
    getCollectionLength(params: GetCollectionLength): Promise<any>;
    /**
     * Gets the values of a collection, omitting the metadata.
     *
     * @param params.collectionId The collectionID being requested. Refer to {@link https://props.coz.io} for a formatted list.
     *
     * @returns The values in the collection.
     */
    getCollectionValues(params: GetCollectionValues): Promise<any>;
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
    mapBytesOntoCollection(params: MapBytesOntoCollection, opts?: InvocationOptions): Promise<string>;
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
    mapBytesOntoCollectionSync(params: MapBytesOntoCollection, opts?: InvocationOptions): Promise<any>;
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
    sampleFromCollection(params: SampleFromCollection, opts?: InvocationOptions): Promise<string>;
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
    sampleFromCollectionSync(params: SampleFromCollection, opts?: InvocationOptions): Promise<any[]>;
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
    sampleFromRuntimeCollection(params: SampleFromRuntimeCollection, opts?: InvocationOptions): Promise<string>;
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
    sampleFromRuntimeCollectionSync(params: SampleFromRuntimeCollection, opts?: InvocationOptions): Promise<any[]>;
    /**
     * Gets the total collections. Collection IDs are autogenerated on range [1 -> totalCollections] inclusive if you are
     * planning to iterate their collection IDs.
     *
     * @returns The total number of collections stored in the contract.
     */
    totalCollections(): Promise<any>;
    /**
     * Updates the contract
     * @param params
     * @param {InvocationOptions} [opts]
     * @param opts.timeout A number value in microseconds indicating how long the function should wait for the transaction to be completed.
     * This property only affects synchronous methods.
     *
     * @returns A transaction ID. Refer to {@link Utils.transactionCompletion} for parsing the response.
     */
    update(params: Update, opts?: InvocationOptions): Promise<string | void>;
    /**
     * Updates the contract, and waits for the transaction to be completed.
     * @param params
     * @param {InvocationOptions} [opts]
     * @param opts.timeout A number value in microseconds indicating how long the function should wait for the transaction to be completed.
     * This property only affects synchronous methods.
     *
     * @returns Nothing if the update succeeds.
     */
    updateSync(params: Update, opts?: InvocationOptions): Promise<string | void>;
}
