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

export class CollectionAPI {
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

  static getCollectionJSON(scriptHash: string, params: GetCollectionJSON): ContractInvocation {
    return {
      scriptHash,
      operation: 'get_collection_json',
      args: [{ type: 'Integer', value: params.collectionId.toString() }],
    }
  }

  static getCollection(scriptHash: string, params: GetCollection): ContractInvocation {
    return {
      scriptHash,
      operation: 'get_collection',
      args: [{ type: 'Integer', value: params.collectionId.toString() }],
    }
  }

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

  static getCollectionLength(scriptHash: string, params: GetCollectionLength): ContractInvocation {
    return {
      scriptHash,
      operation: 'get_collection_length',
      args: [{ type: 'Integer', value: params.collectionId.toString() }],
    }
  }

  static getCollectionValues(scriptHash: string, params: GetCollectionValues): ContractInvocation {
    return {
      scriptHash,
      operation: 'get_collection_values',
      args: [{ type: 'Integer', value: params.collection_id.toString() }],
    }
  }

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

  static totalCollections(scriptHash: string): ContractInvocation {
    return {
      scriptHash,
      operation: 'total_collections',
      args: [],
    }
  }

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
