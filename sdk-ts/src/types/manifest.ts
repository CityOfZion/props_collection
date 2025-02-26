/**
 * Interface that matches the ABI from the "create_collection" function on the Collection manifest
 * @group Manifest
 */
export interface CreateCollection {
  description: string
  collectionType: string
  extra: string
  values: string[]
}

/**
 * Interface that matches the ABI from the "get_collection_json" function on the Collection manifest
 * @group Manifest
 */
export interface GetCollectionJSON {
  collectionId: number
}

/**
 * Interface that matches the ABI from the "get_collection" function on the Collection manifest
 * @group Manifest
 */
export interface GetCollection {
  collectionId: number
}

/**
 * Interface that matches the ABI from the "get_collection_element" function on the Collection manifest
 * @group Manifest
 */
export interface GetCollectionElement {
  collectionId: number
  index: number
}

/**
 * Interface that matches the ABI from the "get_collection_length" function on the Collection manifest
 * @group Manifest
 */
export interface GetCollectionLength {
  collectionId: number
}

/**
 * Interface that matches the ABI from the "get_collection_values" function on the Collection manifest
 * @group Manifest
 */
export interface GetCollectionValues {
  collectionId: number
}

/**
 * Interface that matches the ABI from the "map_bytes_onto_collection" function on the Collection manifest
 * @group Manifest
 */
export interface MapBytesOntoCollection {
  collectionId: number
  entropy: string
}

/**
 * Interface that matches the ABI from the "sample_from_collection" function on the Collection manifest
 * @group Manifest
 */
export interface SampleFromCollection {
  collectionId: number
  samples: number
}

/**
 * Interface that matches the ABI from the "sample_from_runtime_collection" function on the Collection manifest
 * @group Manifest
 */
export interface SampleFromRuntimeCollection {
  values: string[]
  samples: number
  pick: boolean
}

/**
 * Interface that matches the ABI from the "update" function on the Collection manifest
 * @group Manifest
 */
export interface Update {
  script: string
  manifest: string
  data: any
}
