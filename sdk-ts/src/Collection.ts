import { CollectionAPI } from './api'
import { ConstructorOptions, InvocationOptions } from './types'
import { NeonEventListener, NeonInvoker, NeonParser } from '@cityofzion/neon-dappkit'
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
import { Neo3EventListener, Neo3Invoker, Neo3Parser, TypeChecker } from '@cityofzion/neon-dappkit-types'

const DEFAULT_OPTIONS = {
  node: NeonInvoker.MAINNET,
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
 * Use the `init` method to create a new Dice object. All of the PROPS smart contract interface classes will need a node rpc address, scripthash, account, `Neo3Invoker`,
 * `Neo3Parser`, and `Neo3EventListener` to be initialized.
 * Those parameters are optional, and if not provided, the default values interfacing with the MainNet will be used.
 *
 * @example
 * To use this class:
 * ```typescript
 * import { Collection } "@cityofzion/props-collection"
 * import { wallet } from "@cityofzion/neon-js"
 * import { NeonEventListener, NeonInvoker, NeonParser } from '@cityofzion/neon-dappkit'
 *
 * const node = "https://mainnet1.neo.coz.io:443"                   // refer to dora.coz.io/monitor for a list of nodes.
 * const scriptHash = "0xf05651bc505fd5c7d36593f6e8409932342f9085"  // if you are using a different network, the script hash might be different
 * const account = new wallet.Account()                             // need to send either an wallet.Account() or undefined, testInvokes don't need an account
 * const invoker = await NeonInvoker.init(node, account)            // need to instantiate a Neo3Invoker, currently only NeonInvoker implements this interface
 * const parser = NeonParser                                        // need to use a Neo3Parser, currently only NeonParser implements this interface
 * const listener = new NeonEventListener(node)                     // need to use a Neo3EventListener, currently only NeonEventListener implements this interface
 * const collection = await Collection.init({
 *   node,
 *   scriptHash,
 *   invoker,
 *   parser,
 *   listener,
 * })
 *
 * const total = await collection.totalCollections()
 * console.log(total) // outputs the total collection count in the contract
 * ```
 */
export class Collection {
  private constructor(
    readonly scriptHash: string,
    readonly node: string,
    private invoker: Neo3Invoker,
    private listener: Neo3EventListener,
    private parser: Neo3Parser
  ) {}

  static async init(configOptions?: ConstructorOptions): Promise<Collection> {
    const config = { ...DEFAULT_OPTIONS, ...configOptions }

    if (!config.invoker) {
      config.invoker = await NeonInvoker.init({
        rpcAddress: config.node,
        account: config.account,
      })
    }

    if (!config.listener) {
      config.listener = new NeonEventListener(config.node)
    }

    return new Collection(config.scriptHash, config.node, config.invoker, config.listener, config.parser)
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
   * @returns A transaction ID. Refer to {@link https://github.com/CityOfZion/neon-dappkit/blob/071e35ad13e8c5f705a01ea655cb05b1aa1eb928/packages/neon-dappkit/test/NeonParser.spec.ts#L206 NeonParser.parseRpcResponse} for parsing the response.
   */
  async createCollection(params: CreateCollection, opts?: InvocationOptions): Promise<string> {
    return await this.invoker.invokeFunction({
      invocations: [CollectionAPI.createCollection(this.scriptHash, params)],
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
    const txId = await this.invoker.invokeFunction({
      invocations: [CollectionAPI.createCollection(this.scriptHash, params)],
      signers: [],
    })

    const resp = await this.listener.waitForApplicationLog(txId, opts?.timeout ?? TIMEOUT)

    if (!TypeChecker.isStackTypeInteger(resp.executions[0].stack?.[0])) {
      throw new Error('unrecognized response, was expecting a single integer, but got ' + resp.executions)
    }

    return this.parser.parseRpcResponse(resp.executions[0].stack[0])
  }

  /**
   * Gets a JSON formatting collection from the smart contract.
   *
   * @param params.collectionId The collectionID being requested..
   *
   * @returns The requested collection.
   */
  async getCollectionJSON(params: GetCollectionJSON): Promise<any> {
    const res = await this.invoker.testInvoke({
      invocations: [CollectionAPI.getCollectionJSON(this.scriptHash, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.parser.parseRpcResponse(res.stack[0])
  }

  /**
   * Gets the bytestring representation of the collection. This is primarily used for inter-contract interfacing,
   * but we include it here for completeness.
   *
   * @param params.collectionId The collectionID being requested.
   *
   * @returns The bytestring representation of the collection.
   */
  async getCollection(params: GetCollection): Promise<any> {
    const res = await this.invoker.testInvoke({
      invocations: [CollectionAPI.getCollection(this.scriptHash, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.parser.parseRpcResponse(res.stack[0])
  }

  /**
   * Returns the value of a collection from a requested index.
   *
   * @param params.collectionId The collectionID being requested.
   * @param params.index The index of the array element being requested.
   *
   * @returns The value of the collection element.
   */
  async getCollectionElement(params: GetCollectionElement): Promise<any> {
    const res = await this.invoker.testInvoke({
      invocations: [CollectionAPI.getCollectionElement(this.scriptHash, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.parser.parseRpcResponse(res.stack[0])
  }

  /**
   * Gets the array length of a requested collection.
   *
   * @param params.collectionId The collectionID being requested.
   *
   * @returns The length of the collection.
   */
  async getCollectionLength(params: GetCollectionLength): Promise<any> {
    const res = await this.invoker.testInvoke({
      invocations: [CollectionAPI.getCollectionLength(this.scriptHash, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.parser.parseRpcResponse(res.stack[0])
  }

  /**
   * Gets the values of a collection, omitting the metadata.
   *
   * @param params.collectionId The collectionID being requested.
   *
   * @returns The values in the collection.
   */
  async getCollectionValues(params: GetCollectionValues): Promise<any> {
    const res = await this.invoker.testInvoke({
      invocations: [CollectionAPI.getCollectionValues(this.scriptHash, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.parser.parseRpcResponse(res.stack[0])
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
   * @param params.collectionId The collectionID being requested.
   * @param params.entropy Bytes to use for the mapping.
   * @param {InvocationOptions} [opts]
   * @param opts.timeout A number value in microseconds indicating how long the function should wait for the transaction to be completed.
   * This property only affects synchronous methods.
   *
   * @returns A transaction ID. This result uses RNG features managed by the consensus nodes and only functions properly
   * with a published transaction. Refer to {@link https://github.com/CityOfZion/neon-dappkit/blob/071e35ad13e8c5f705a01ea655cb05b1aa1eb928/packages/neon-dappkit/test/NeonParser.spec.ts#L206 NeonParser.parseRpcResponse} for parsing the response.
   */
  async mapBytesOntoCollection(params: MapBytesOntoCollection, opts?: InvocationOptions): Promise<string> {
    return await this.invoker.invokeFunction({
      invocations: [CollectionAPI.mapBytesOntoCollection(this.scriptHash, params)],
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
   * @param params.collectionId The collectionID being requested.
   * @param params.entropy Bytes to use for the mapping.
   * @param {InvocationOptions} [opts]
   * @param opts.timeout A number value in microseconds indicating how long the function should wait for the transaction to be completed.
   * This property only affects synchronous methods.
   *
   * @returns A collection value. This result uses RNG features managed by the consensus nodes and only functions properly
   * with a published transaction.
   */
  async mapBytesOntoCollectionSync(params: MapBytesOntoCollection, opts?: InvocationOptions): Promise<any> {
    const txId = await this.invoker.invokeFunction({
      invocations: [CollectionAPI.mapBytesOntoCollection(this.scriptHash, params)],
      signers: [],
    })

    const resp = await this.listener.waitForApplicationLog(txId, opts?.timeout ?? TIMEOUT)

    if (!TypeChecker.isRpcResponseStackItem(resp.executions[0].stack?.[0])) {
      throw new Error('unrecognized response, got ' + resp.executions)
    }

    return this.parser.parseRpcResponse(resp.executions[0].stack[0])
  }

  /**
   * Samples a uniform random value from the collection using a Contract. Call to the {@link https://github.com/CityOfZion/props_dice | Dice} contract.
   *
   * @param params.collectionId The collectionID being requested.
   * @param params.samples The number of samples to to take from the collection.
   * @param {InvocationOptions} [opts]
   * @param opts.timeout A number value in microseconds indicating how long the function should wait for the transaction to be completed.
   * This property only affects synchronous methods.
   *
   * @returns A transaction ID. This result uses RNG features managed by the consensus nodes and only functions properly
   * with a published transaction. Refer to {@link https://github.com/CityOfZion/neon-dappkit/blob/071e35ad13e8c5f705a01ea655cb05b1aa1eb928/packages/neon-dappkit/test/NeonParser.spec.ts#L206 NeonParser.parseRpcResponse} for parsing the response.
   */
  async sampleFromCollection(params: SampleFromCollection, opts?: InvocationOptions): Promise<string> {
    return await this.invoker.invokeFunction({
      invocations: [CollectionAPI.sampleFromCollection(this.scriptHash, params)],
      signers: [],
    })
  }

  /**
   * Samples a uniform random value from the collection using a Contract.Call to the {@link https://github.com/CityOfZion/props_dice | Dice} contract,
   * and waits for the transaction to be completed.
   *
   * @param params.collectionId The collectionID being requested.
   * @param params.samples The number of samples to return.
   * @param {InvocationOptions} [opts]
   * @param opts.timeout A number value in microseconds indicating how long the function should wait for the transaction to be completed.
   * This property only affects synchronous methods.
   *
   * @returns A list of values. This result uses RNG features managed by the consensus nodes and only functions properly
   * with a published transaction.
   */
  async sampleFromCollectionSync(params: SampleFromCollection, opts?: InvocationOptions): Promise<any[]> {
    const txId = await this.invoker.invokeFunction({
      invocations: [CollectionAPI.sampleFromCollection(this.scriptHash, params)],
      signers: [],
    })

    const resp = await this.listener.waitForApplicationLog(txId, opts?.timeout ?? TIMEOUT)

    if (!TypeChecker.isStackTypeArray(resp.executions[0].stack?.[0])) {
      throw new Error('unrecognized response, was expecting an array, but got ' + resp.executions)
    }

    return this.parser.parseRpcResponse(resp.executions[0].stack[0])
  }

  /**
   * Samples uniformly from a collection provided at the time of invocation. Users have the option to 'pick', which
   * prevents a value from being selected multiple times. The results are published as outputs on the transaction.
   *
   * @param params.values an array of values to sample from.
   * @param params.samples the number of samples to fairly select from the values.
   * @param params.pick Are selected values removed from the list of options for future samples?
   * @param {InvocationOptions} [opts]
   * @param opts.timeout A number value in microseconds indicating how long the function should wait for the transaction to be completed.
   * This property only affects synchronous methods.
   *
   * @returns A transaction ID. This result uses RNG features managed by the consensus nodes and only functions properly
   * with a published transaction. Refer to {@link https://github.com/CityOfZion/neon-dappkit/blob/071e35ad13e8c5f705a01ea655cb05b1aa1eb928/packages/neon-dappkit/test/NeonParser.spec.ts#L206 NeonParser.parseRpcResponse} for parsing the response.
   */
  async sampleFromRuntimeCollection(params: SampleFromRuntimeCollection, opts?: InvocationOptions): Promise<string> {
    return await this.invoker.invokeFunction({
      invocations: [CollectionAPI.sampleFromRuntimeCollection(this.scriptHash, params)],
      signers: [],
    })
  }

  /**
   * Samples uniformly from a collection provided at the time of invocation, and waits for the transaction to be completed.
   * Users have the option to 'pick', which prevents a value from being selected multiple times.
   * The results are published as outputs on the transaction.
   *
   * @param params.values an array of values to sample from.
   * @param params.samples the number of samples to fairly select from the values.
   * @param params.pick Are selected values removed from the list of options for future samples?
   * @param {InvocationOptions} [opts]
   * @param opts.timeout A number value in microseconds indicating how long the function should wait for the transaction to be completed.
   * This property only affects synchronous methods.
   *
   * @returns A list of values. This result uses RNG features managed by the consensus nodes and only functions properly
   * with a published transaction.
   */
  async sampleFromRuntimeCollectionSync(params: SampleFromRuntimeCollection, opts?: InvocationOptions): Promise<any[]> {
    const txId = await this.invoker.invokeFunction({
      invocations: [CollectionAPI.sampleFromRuntimeCollection(this.scriptHash, params)],
      signers: [],
    })

    const resp = await this.listener.waitForApplicationLog(txId, opts?.timeout ?? TIMEOUT)

    if (!TypeChecker.isStackTypeArray(resp.executions[0].stack?.[0])) {
      throw new Error('unrecognized response, was expecting an array, but got ' + resp.executions)
    }

    return this.parser.parseRpcResponse(resp.executions[0].stack[0])
  }

  /**
   * Gets the total collections. Collection IDs are autogenerated on range [1 -> totalCollections] inclusive if you are
   * planning to iterate their collection IDs.
   *
   * @returns The total number of collections stored in the contract.
   */
  async totalCollections(): Promise<any> {
    const res = await this.invoker.testInvoke({
      invocations: [CollectionAPI.totalCollections(this.scriptHash)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.parser.parseRpcResponse(res.stack[0])
  }

  /**
   * Updates the contract
   * @param params
   * @param {InvocationOptions} [opts]
   * @param opts.timeout A number value in microseconds indicating how long the function should wait for the transaction to be completed.
   * This property only affects synchronous methods.
   *
   * @returns A transaction ID. Refer to {@link https://github.com/CityOfZion/neon-dappkit/blob/071e35ad13e8c5f705a01ea655cb05b1aa1eb928/packages/neon-dappkit/test/NeonParser.spec.ts#L206 NeonParser.parseRpcResponse} for parsing the response.
   */
  async update(params: Update, opts?: InvocationOptions): Promise<string | void> {
    return await this.invoker.invokeFunction({
      invocations: [CollectionAPI.update(this.scriptHash, params)],
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
    const txId = await this.invoker.invokeFunction({
      invocations: [CollectionAPI.update(this.scriptHash, params)],
      signers: [],
    })

    await this.listener.waitForApplicationLog(txId, opts?.timeout ?? TIMEOUT)
  }
}
