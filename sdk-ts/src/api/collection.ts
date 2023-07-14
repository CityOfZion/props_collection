import { ContractInvocation } from '@cityofzion/neo3-invoker'
import { u } from '@cityofzion/neon-core'

export class CollectionAPI {
  static createCollection(
      scriptHash: string,
      params: {
        description: string
        collectionType: string
        extra: string
        vals: string[]
      }
  ): ContractInvocation {
    return {
      scriptHash,
      operation: 'create_collection',
      args: [
        {type: 'String', value: params.description},
        {type: 'String', value: params.collectionType},
        {type: 'String', value: params.extra},
        {
          type: 'Array',
          value: params.vals.map(value => ({
            type: params.collectionType == 'string' ? 'String' : 'Integer',
            value,
          })),
        },
      ],
    }
  }

  static getCollectionJSON(scriptHash: string, params: { collectionId: number }): ContractInvocation {
    return {
      scriptHash,
      operation: 'get_collection_json',
      args: [{type: 'Integer', value: params.collectionId}],
    }
  }

  static getCollection(
      scriptHash: string,
      params: {
        collectionId: number
      }
  ): ContractInvocation {
    return {
      scriptHash,
      operation: 'get_collection',
      args: [{type: 'Integer', value: params.collectionId}],
    }
  }

  static getCollectionElement(
      scriptHash: string,
      params: {
        collectionId: number
        index: number
      }
  ): ContractInvocation {
    return {
      scriptHash,
      operation: 'get_collection_element',
      args: [
        {type: 'Integer', value: params.collectionId},
        {type: 'Integer', value: params.index},
      ],
    }
  }

  static getCollectionLength(
      scriptHash: string,
      params: {
        collectionId: number
      }
  ): ContractInvocation {
    return {
      scriptHash,
      operation: 'get_collection_length',
      args: [{type: 'Integer', value: params.collectionId}],
    }
  }

  static getCollectionValues(
      scriptHash: string,
      params: {
        collection_id: number
      }
  ): ContractInvocation {
    return {
      scriptHash,
      operation: 'get_collection_values',
      args: [
        {type: 'Integer', value: params.collection_id}
      ],
    }
  }

  static mapBytesOntoCollection(
      scriptHash: string,
      params: {
        collectionId: number,
        entropy: string,
      }
  ): ContractInvocation {
    return {
      scriptHash,
      operation: 'map_bytes_onto_collection',
      args: [
        {type: 'Integer', value: params.collectionId},
        {type: 'String', value: params.entropy},
      ],
    }
  }

  static SampleFromCollection(
      scriptHash: string,
      params: {
        collectionId: number,
        samples: number,
      }): ContractInvocation {
    return {
      scriptHash,
      operation: 'sample_from_collection',
      args: [
        {type: 'Integer', value: params.collectionId},
        {type: 'Integer', value: params.samples},
      ],
    }
  }

  static sampleFromRuntimeCollection(
      scriptHash: string,
      params: {
        values: string[],
        samples: number,
        pick: boolean
      }
  ): ContractInvocation {
    return {
      scriptHash,
      operation: 'sample_from_runtime_collection',
      args: [
        {type: 'Array', value: params.values.map(value => ({type: 'String', value: value}))},
        {type: 'Integer', value: params.samples},
        {type: 'Boolean', value: params.pick},
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

  static update(
      scriptHash: string,
      params: {
        script: string,
        manifest: string,
        data: any
      }
  ): ContractInvocation {
    return {
      scriptHash,
      operation: 'update',
      args: [
        {type: 'ByteArray', value: params.script},
        {type: 'String', value: params.manifest},
        {type: 'Any', value: params.data},
      ],
    }
  }
}