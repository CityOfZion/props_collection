import { CollectionAPI } from './api'
import { ConstructorOptions, InvocationOptions } from './types'
import { rpc } from '@cityofzion/neon-js'
import { rpc as coreRpc } from '@cityofzion/neon-core'
import { NetworkOption } from './constants/config'
import { NeonInvoker, NeonParser } from '@cityofzion/neon-dappkit'
import {
  CreateCollection,
  GetCollection,
  GetCollectionElement,
  GetCollectionJSON,
  GetCollectionLength,
  GetCollectionValues,
  MapBytesOntoCollection,
  SampleFromCollection,
  SampleFromRuntimeCollection,
  Update,
} from './types/manifest'
import { Utils } from './helpers'

const DEFAULT_OPTIONS: ConstructorOptions = {
  node: NetworkOption.MainNet,
  scriptHash: '0xf05651bc505fd5c7d36593f6e8409932342f9085',
  parser: NeonParser,
  account: undefined,
}

const TIMEOUT = 60000

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
export class Collection {
  private config: ConstructorOptions
  private initialized: boolean

  constructor(configOptions: ConstructorOptions = {}) {
    this.initialized = 'invoker' in configOptions
    this.config = { ...DEFAULT_OPTIONS, ...configOptions }
  }

  /**
   * DO NOT EDIT ME
   * The contract script hash that is being interfaced with.
   */
  get scriptHash(): string {
    if (this.config.scriptHash) {
      return this.config.scriptHash
    }
    throw new Error('no scripthash defined')
  }

  get node(): coreRpc.RPCClient {
    if (this.config.node) {
      return new rpc.RPCClient(this.config.node!)
    }
    throw new Error('no node selected!')
  }

  async init(): Promise<boolean> {
    if (!this.initialized) {
      this.config.invoker = await NeonInvoker.init({
        rpcAddress: this.config.node as string,
        account: this.config.account,
      })
      this.initialized = true
    }
    return true
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
  async createCollection(params: CreateCollection, opts?: InvocationOptions): Promise<string> {
    await this.init()
    return await this.config.invoker!.invokeFunction({
      invocations: [CollectionAPI.createCollection(this.config.scriptHash!, params)],
      signers: [],
    })
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
  async createCollectionSync(params: CreateCollection, opts?: InvocationOptions): Promise<number> {
    await this.init()
    const txId = await this.config.invoker!.invokeFunction({
      invocations: [CollectionAPI.createCollection(this.config.scriptHash!, params)],
      signers: [],
    })

    const resp = await Utils.transactionCompletion(txId, {
      timeout: opts?.timeout ?? TIMEOUT,
      node: this.config.node as NetworkOption,
    })

    return resp.parsedStack[0] as number
  }

  /**
   * Gets a JSON formatting collection from the smart contract.
   *
   * @param params.collectionId The collectionID being requested. Refer to {@link https://props.coz.io} for a formatted list.
   *
   * @returns The requested collection.
   */
  async getCollectionJSON(params: GetCollectionJSON): Promise<any> {
    await this.init()
    const res = await this.config.invoker!.testInvoke({
      invocations: [CollectionAPI.getCollectionJSON(this.config.scriptHash!, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser!.parseRpcResponse(res.stack[0])
  }

  /**
   * Gets the bytestring representation of the collection. This is primarily used for inter-contract interfacing,
   * but we include it here for completeness.
   *
   * @param params.collectionId The collectionID being requested. Refer to {@link https://props.coz.io} for a formatted list.
   *
   * @returns The bytestring representation of the collection.
   */
  async getCollection(params: GetCollection): Promise<any> {
    await this.init()
    const res = await this.config.invoker!.testInvoke({
      invocations: [CollectionAPI.getCollection(this.config.scriptHash!, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser!.parseRpcResponse(res.stack[0])
  }

  /**
   * Returns the value of a collection from a requested index.
   *
   * @param params.collectionId The collectionID being requested. Refer to {@link https://props.coz.io} for a formatted list.
   * @param params.index The index of the array element being requested.
   *
   * @returns The value of the collection element.
   */
  async getCollectionElement(params: GetCollectionElement): Promise<any> {
    await this.init()
    const res = await this.config.invoker!.testInvoke({
      invocations: [CollectionAPI.getCollectionElement(this.config.scriptHash!, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser!.parseRpcResponse(res.stack[0])
  }

  /**
   * Gets the array length of a requested collection.
   *
   * @param params.collectionId The collectionID being requested. Refer to {@link https://props.coz.io} for a formatted list.
   *
   * @returns The length of the collection.
   */
  async getCollectionLength(params: GetCollectionLength): Promise<any> {
    await this.init()
    const res = await this.config.invoker!.testInvoke({
      invocations: [CollectionAPI.getCollectionLength(this.config.scriptHash!, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser!.parseRpcResponse(res.stack[0])
  }

  /**
   * Gets the values of a collection, omitting the metadata.
   *
   * @param params.collectionId The collectionID being requested. Refer to {@link https://props.coz.io} for a formatted list.
   *
   * @returns The values in the collection.
   */
  async getCollectionValues(params: GetCollectionValues): Promise<any> {
    await this.init()
    const res = await this.config.invoker!.testInvoke({
      invocations: [CollectionAPI.getCollectionValues(this.config.scriptHash!, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser!.parseRpcResponse(res.stack[0])
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
  async mapBytesOntoCollection(params: MapBytesOntoCollection, opts?: InvocationOptions): Promise<string> {
    await this.init()
    return await this.config.invoker!.invokeFunction({
      invocations: [CollectionAPI.mapBytesOntoCollection(this.config.scriptHash!, params)],
      signers: [],
    })
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
  async mapBytesOntoCollectionSync(params: MapBytesOntoCollection, opts?: InvocationOptions): Promise<any> {
    await this.init()
    const txId = await this.config.invoker!.invokeFunction({
      invocations: [CollectionAPI.mapBytesOntoCollection(this.config.scriptHash!, params)],
      signers: [],
    })

    const resp = await Utils.transactionCompletion(txId, {
      timeout: opts?.timeout ?? TIMEOUT,
      node: this.config.node as NetworkOption,
    })

    return resp.parsedStack[0]
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
  async sampleFromCollection(params: SampleFromCollection, opts?: InvocationOptions): Promise<string> {
    await this.init()
    return await this.config.invoker!.invokeFunction({
      invocations: [CollectionAPI.sampleFromCollection(this.config.scriptHash!, params)],
      signers: [],
    })
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
  async sampleFromCollectionSync(params: SampleFromCollection, opts?: InvocationOptions): Promise<any[]> {
    await this.init()
    const txId = await this.config.invoker!.invokeFunction({
      invocations: [CollectionAPI.sampleFromCollection(this.config.scriptHash!, params)],
      signers: [],
    })

    const resp = await Utils.transactionCompletion(txId, {
      timeout: opts?.timeout ?? TIMEOUT,
      node: this.config.node as NetworkOption,
    })

    return resp.parsedStack[0]
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
  async sampleFromRuntimeCollection(params: SampleFromRuntimeCollection, opts?: InvocationOptions): Promise<string> {
    await this.init()
    return await this.config.invoker!.invokeFunction({
      invocations: [CollectionAPI.sampleFromRuntimeCollection(this.config.scriptHash!, params)],
      signers: [],
    })
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
  async sampleFromRuntimeCollectionSync(params: SampleFromRuntimeCollection, opts?: InvocationOptions): Promise<any[]> {
    await this.init()
    const txId = await this.config.invoker!.invokeFunction({
      invocations: [CollectionAPI.sampleFromRuntimeCollection(this.config.scriptHash!, params)],
      signers: [],
    })

    const resp = await Utils.transactionCompletion(txId, {
      timeout: opts?.timeout ?? TIMEOUT,
      node: this.config.node as NetworkOption,
    })

    return resp.parsedStack[0]
  }

  /**
   * Gets the total collections. Collection IDs are autogenerated on range [1 -> totalCollections] inclusive if you are
   * planning to iterate their collection IDs.
   *
   * @returns The total number of collections stored in the contract.
   */
  async totalCollections(): Promise<any> {
    await this.init()
    const res = await this.config.invoker!.testInvoke({
      invocations: [CollectionAPI.totalCollections(this.config.scriptHash!)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser!.parseRpcResponse(res.stack[0])
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
  async update(params: Update, opts?: InvocationOptions): Promise<string | void> {
    await this.init()
    return await this.config.invoker!.invokeFunction({
      invocations: [CollectionAPI.update(this.config.scriptHash!, params)],
      signers: [],
    })
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
  async updateSync(params: Update, opts?: InvocationOptions): Promise<string | void> {
    await this.init()
    const txId = await this.config.invoker!.invokeFunction({
      invocations: [CollectionAPI.update(this.config.scriptHash!, params)],
      signers: [],
    })

    await Utils.transactionCompletion(txId, {
      timeout: opts?.timeout ?? TIMEOUT,
      node: this.config.node as NetworkOption,
    })
  }
}
