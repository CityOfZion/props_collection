import { CollectionAPI } from './api'
import { ConstructorOptions } from './types'
import { rpc } from '@cityofzion/neon-core'
import { NetworkOption } from './constants/config'
import { NeonInvoker, NeonParser } from "@cityofzion/neon-dappkit";
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

const DEFAULT_OPTIONS: ConstructorOptions = {
  node: NetworkOption.MainNet,
  scriptHash: '0xf05651bc505fd5c7d36593f6e8409932342f9085',
  parser: NeonParser,
  account: undefined,
}

/**
 * The Collection prop is designed to store static-immutable data for reference in other projects. Storing static data
 * in contracts is very expensive and inefficient, especially for new projects.  This contract resolves that issue by creating
 * library for static data. This class exposes the interface along with a number of helpful features to make the smart
 * contract easy to use for typescript developers.
 *
 * All of the prop helper classes will auto-configure your network settings.  The default configuration will interface with
 * the contract on MainNet, but this can be configured by providing configuration options.
 *
 * To use this class:
 * ```typescript
 * import { Collection } from "../../dist" //import { Collection } from "@cityofzion/props-collection
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

  get node(): rpc.RPCClient {
    if (this.config.node) {
      return new rpc.RPCClient(this.config.node!)
    }
    throw new Error('no node selected!')
  }

  async init(): Promise<boolean> {
    if (!this.initialized) {
      this.config.invoker = await NeonInvoker.init({
        rpcAddress: this.config.node as string,
        account: this.config.account
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
   * @param params.collectionType The type of the data being store.  This is an unregulated field.  Standard NVM datatypes should
   * adhere to existing naming conventions.
   * @param params.extra An unregulated field for unplanned feature development.
   * @param params.values An array of values that represent the body of the collection.
   *
   * @returns A transaction ID.  Refer to {@link Util.transactionCompletion} for parsing the response.
   */
  async createCollection(params: CreateCollection): Promise<string> {
    await this.init()
    return await this.config.invoker!.invokeFunction({
      invocations: [CollectionAPI.createCollection(this.config.scriptHash!, params)],
      signers: [],
    })
  }

  /**
   * Gets a JSON formatting collection from the smart contract.
   *
   * @param params.collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
   * @param params.signer An optional signer. Populating this field will publish the transaction and return a txid instead of
   * running the invocation as a test invoke.
   *
   * @returns The requested collection **OR** a txid if the signer parameter is populated.
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
   * Gets the bytestring representation of the collection.  This is primarilly used for inter-contract interfacing,
   * but we include it here for completeness.
   *
   * @param params.collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
   * @param params.signer An optional signer. Populating this field will publish the transaction and return a txid instead of
   * running the invocation as a test invoke.
   *
   * @returns The bytestring representation of the collection. **OR** a txid if the signer parameter is populated.
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
   * @param params.collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
   * @param params.index The index of the array element being requested.
   *
   * @returns The value of the collection element **OR** a txid if the signer parameter is populated.
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
   * @param params.collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
   *
   * @returns The length of the collection **OR** a txid if the signer parameter is populated.
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
   * @param params.collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
   *
   * @returns The values in the collection **OR** a txid if the signer parameter is populated.
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
   * Maps byte entropy onto a collection's values and returns the index of the result.  The mapping is made as follows:
   *
   * [0 -> MAX(entropyBytes.length)][entropy] -> [0 -> collection.length][index]
   *
   * This method is primarily useful for computationally efficient contract interfacing. For random sampling, or
   * sampling from a distribution, use {@link getCollectionLength} in combination with {@link getCollectionElement} or
   * {@link sampleFromCollection}.
   *
   * @param params.collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
   * @param params.entropy Bytes to use for the mapping.
   *
   * @returns A transaction ID. This result uses RNG features managed by the consensus nodes and only functions properly
   * with a published transaction. Refer to {@link Util.transactionCompletion} for parsing the response.
   */
  async mapBytesOntoCollection(params: MapBytesOntoCollection): Promise<string> {
    await this.init()
    return await this.config.invoker!.invokeFunction({
      invocations: [CollectionAPI.mapBytesOntoCollection(this.config.scriptHash!, params)],
      signers: [],
    })
  }

  /**
   * Samples a uniform random value from the collection using a Contract.Call to the {@link Dice} contract.
   *
   * @param params.collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
   * @param params.samples The number of samples to return
   *
   * @returns A transaction ID. This result uses RNG features managed by the consensus nodes and only functions properly
   * with a published transaction. Refer to {@link Util.transactionCompletion} for parsing the response.
   */
  async sampleFromCollection(params: SampleFromCollection): Promise<string> {
    await this.init()
    return await this.config.invoker!.invokeFunction({
      invocations: [CollectionAPI.sampleFromCollection(this.config.scriptHash!, params)],
      signers: [],
    })
  }

  /**
   * Samples uniformly from a collection provided at the time of invocation.  Users have the option to 'pick', which
   * prevents a value from being selected multiple times.  The results are published as outputs on the transaction.
   * @param params.values an array of values to sample from
   * @param params.samples the number of samples to fairly select from the values
   * @param params.pick Are selected values removed from the list of options for future samples?
   *
   * @returns A transaction ID. This result uses RNG features managed by the consensus nodes and only functions properly
   * with a published transaction. Refer to {@link Util.transactionCompletion} for parsing the response.
   */
  async sampleFromRuntimeCollection(params: SampleFromRuntimeCollection): Promise<string> {
    await this.init()
    return await this.config.invoker!.invokeFunction({
      invocations: [CollectionAPI.sampleFromRuntimeCollection(this.config.scriptHash!, params)],
      signers: [],
    })
  }

  /**
   * Gets the total collections.  Collection IDs are autogenerated on range [1 -> totalCollections] inclusive if you are
   * planning to iterate of their collection IDs.
   * @returns The total number of collections stored in the contract. **OR** a txid if the signer parameter is populated.
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
   */
  async update(params: Update): Promise<string> {
    await this.init()
    return await this.config.invoker!.invokeFunction({
      invocations: [CollectionAPI.update(this.config.scriptHash!, params)],
      signers: [],
    })
  }
}
