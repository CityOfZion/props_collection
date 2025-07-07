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
} from '../types/manifest'
import { ContractInvocation } from '@cityofzion/neon-dappkit-types'

/**
 * API class for interacting with PROPS Collection smart contracts on Neo N3.
 * Provides static methods to create contract invocations for all Collection operations.
 * All methods return a ContractInvocation object that can be used to invoke functions.
 *
 * @example
 * const collectionJson = await invoker.testInvoke({
 *  invocations: [CollectionAPI.getCollectionJSON(scriptHash, params)],
 * })
 * const txId = await invoker.invokeFunction({
 *  invocations: [CollectionAPI.sampleFromCollection(scriptHash, params)],
 * })
 */
export class CollectionAPI {
  /**
   * Creates a contract invocation for creating a new collection.
   * @param scriptHash - The script hash of the contract.
   * @param params - The parameters necessary for invoking the function.
   * @param params.description A useful description of the collection.
   * @param params.collectionType The type of the data being store. This is an unregulated field. Standard NVM datatypes should
   * adhere to existing naming conventions.
   * @param params.extra An unregulated field for unplanned feature development.
   * @param params.values An array of values that represent the body of the collection.
   * @returns A ContractInvocation object for creating a collection.
   */
  static createCollection(scriptHash: string, params: CreateCollection): ContractInvocation {
    return {
      scriptHash,
      operation: 'create_collection',
      args: [
        { type: 'String', value: params.description },
        { type: 'String', value: params.collectionType },
        { type: 'String', value: params.extra },
        {
          type: 'Array',
          value: params.values.map(value => ({
            type: params.collectionType === 'string' ? 'String' : 'Integer',
            value,
          })),
        },
      ],
    }
  }

  /**
   * Creates a contract invocation for getting a collection as JSON format.
   * @param scriptHash - The script hash of the contract.
   * @param params - The parameters necessary for invoking the function.
   * @param params.collectionId The collectionID being requested.
   * @returns A ContractInvocation object for getting a collection as JSON format.
   */
  static getCollectionJSON(scriptHash: string, params: GetCollectionJSON): ContractInvocation {
    return {
      scriptHash,
      operation: 'get_collection_json',
      args: [{ type: 'Integer', value: params.collectionId.toString() }],
    }
  }

  /**
   * Creates a contract invocation for getting a collection.
   * @param scriptHash - The script hash of the contract.
   * @param params - The parameters necessary for invoking the function.
   * @param params.collectionId The collectionID being requested.
   * @returns A ContractInvocation object for getting a collection.
   */
  static getCollection(scriptHash: string, params: GetCollection): ContractInvocation {
    return {
      scriptHash,
      operation: 'get_collection',
      args: [{ type: 'Integer', value: params.collectionId.toString() }],
    }
  }

  /**
   * Creates a contract invocation for getting a element from a collection.
   * @param scriptHash - The script hash of the contract.
   * @param params - The parameters necessary for invoking the function.
   * @param params.collectionId The collectionID being requested.
   * @param params.index The index of the array element being requested.
   * @returns A ContractInvocation object for getting a element from a collection.
   */
  static getCollectionElement(scriptHash: string, params: GetCollectionElement): ContractInvocation {
    return {
      scriptHash,
      operation: 'get_collection_element',
      args: [
        { type: 'Integer', value: params.collectionId.toString() },
        { type: 'Integer', value: params.index.toString() },
      ],
    }
  }

  /**
   * Creates a contract invocation for getting number of values inside a collection.
   * @param scriptHash - The script hash of the contract.
   * @param params - The parameters necessary for invoking the function.
   * @param params.collectionId The collectionID being requested.
   * @returns A ContractInvocation object for getting the length of a collection.
   */
  static getCollectionLength(scriptHash: string, params: GetCollectionLength): ContractInvocation {
    return {
      scriptHash,
      operation: 'get_collection_length',
      args: [{ type: 'Integer', value: params.collectionId.toString() }],
    }
  }

  /**
   * Creates a contract invocation for getting all values from a collection.
   * @param scriptHash - The script hash of the contract.
   * @param params - The parameters necessary for invoking the function.
   * @param params.collectionId The collectionID being requested.
   * @returns A ContractInvocation object for getting values from a collection.
   */
  static getCollectionValues(scriptHash: string, params: GetCollectionValues): ContractInvocation {
    return {
      scriptHash,
      operation: 'get_collection_values',
      args: [{ type: 'Integer', value: params.collectionId.toString() }],
    }
  }

  /**
   * Creates a contract invocation for mapping bytes entropy onto a collection's value and return the index of the result.
   * @param scriptHash - The script hash of the contract.
   * @param params - The parameters necessary for invoking the function.
   * @param params.collectionId The collectionID being requested.
   * @param params.entropy Bytes to use for the mapping.
   * @returns A ContractInvocation object for mapping bytes onto a onto a collection's value and return the index of the result.
   */
  static mapBytesOntoCollection(scriptHash: string, params: MapBytesOntoCollection): ContractInvocation {
    return {
      scriptHash,
      operation: 'map_bytes_onto_collection',
      args: [
        { type: 'Integer', value: params.collectionId.toString() },
        { type: 'String', value: params.entropy },
      ],
    }
  }

  /**
   * Creates a contract invocation for sampling values from a collection.
   * @param scriptHash - The script hash of the contract.
   * @param params - The parameters necessary for invoking the function.
   * @param params.collectionId The collectionID being requested.
   * @param params.samples The number of samples to take from the collection.
   * @returns A ContractInvocation object for sampling values from a collection.
   */
  static sampleFromCollection(scriptHash: string, params: SampleFromCollection): ContractInvocation {
    return {
      scriptHash,
      operation: 'sample_from_collection',
      args: [
        { type: 'Integer', value: params.collectionId.toString() },
        { type: 'Integer', value: params.samples.toString() },
      ],
    }
  }

  /**
   * Creates a contract invocation for sampling values from a collection that is provided at the time of invocation.
   * @param scriptHash - The script hash of the contract.
   * @param params - The parameters necessary for invoking the function.
   * @param params.values An array of values to sample from.
   * @param params.samples The number of samples to take from the collection.
   * @param params.pick Are selected values removed from the list of options for future samples?
   * @returns A ContractInvocation object for sampling values from a collection that is provided at the time of invocation.
   */
  static sampleFromRuntimeCollection(scriptHash: string, params: SampleFromRuntimeCollection): ContractInvocation {
    return {
      scriptHash,
      operation: 'sample_from_runtime_collection',
      args: [
        { type: 'Array', value: params.values.map(value => ({ type: 'String', value })) },
        { type: 'Integer', value: params.samples.toString() },
        { type: 'Boolean', value: params.pick },
      ],
    }
  }

  /**
   * Creates a contract invocation for getting the total number of collections.
   * @param scriptHash - The script hash of the contract.
   * @returns A ContractInvocation object for getting the total number of collections.
   */
  static totalCollections(scriptHash: string): ContractInvocation {
    return {
      scriptHash,
      operation: 'total_collections',
      args: [],
    }
  }

  /**
   * Creates a contract invocation for updating the collection contract.
   * @param scriptHash - The script hash of the contract.
   * @param params - The parameters necessary for invoking the function.
   * @param params.script The updated script to be used for the contract.
   * @param params.manifest The updated manifest to be used for the contract.
   * @param params.data The new data to be used for when updating the contract.
   * @returns A ContractInvocation object for updating the collection contract.
   */
  static update(scriptHash: string, params: Update): ContractInvocation {
    return {
      scriptHash,
      operation: 'update',
      args: [
        { type: 'ByteArray', value: params.script },
        { type: 'String', value: params.manifest },
        { type: 'Any', value: params.data },
      ],
    }
  }
}
