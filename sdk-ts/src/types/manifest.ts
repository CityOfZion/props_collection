/**
 * Interface that matches the ABI from the "create_collection" function on the Collection manifest.
 * @group Manifest
 */
export interface CreateCollection {
  /** A brief string formatted description of the collection. */
  description: string
  /**  A string formatted type definition. Where possible, use naming the Neo type naming syntax. */
  collectionType: string
  /** An option payload for supplemental data. */
  extra: string
  /** The array of values in the collection. */
  values: string[]
}

/**
 * Interface that matches the ABI from the "get_collection_json" function on the Collection manifest.
 * @group Manifest
 */
export interface GetCollectionJSON {
  /** The collectionID being requested. */
  collectionId: number
}

/**
 * Interface that matches the ABI from the "get_collection" function on the Collection manifest.
 * @group Manifest
 */
export interface GetCollection {
  /** The collectionID being requested. */
  collectionId: number
}

/**
 * Interface that matches the ABI from the "get_collection_element" function on the Collection manifest.
 * @group Manifest
 */
export interface GetCollectionElement {
  /** The collectionID being requested. */
  collectionId: number
  /** The index of the value to get. */
  index: number
}

/**
 * Interface that matches the ABI from the "get_collection_length" function on the Collection manifest.
 * @group Manifest
 */
export interface GetCollectionLength {
  /** The collectionID being requested. */
  collectionId: number
}

/**
 * Interface that matches the ABI from the "get_collection_values" function on the Collection manifest.
 * @group Manifest
 */
export interface GetCollectionValues {
  /** The collectionID being requested. */
  collectionId: number
}

/**
 * Interface that matches the ABI from the "map_bytes_onto_collection" function on the Collection manifest.
 * @group Manifest
 */
export interface MapBytesOntoCollection {
  /** The collectionID being requested. */
  collectionId: number
  /** The entropy value to sample. */
  entropy: string
}

/**
 * Interface that matches the ABI from the "sample_from_collection" function on the Collection manifest.
 * @group Manifest
 */
export interface SampleFromCollection {
  /** The collectionID being requested. */
  collectionId: number
  /** the number of samples to take from the collection. */
  samples: number
}

/**
 * Interface that matches the ABI from the "sample_from_runtime_collection" function on the Collection manifest.
 * @group Manifest
 */
export interface SampleFromRuntimeCollection {
  /** An array of values to sample from. */
  values: string[]
  /** The number of samples to take from the collection. */
  samples: number
  /** Whether a value can be picked only once or not. */
  pick: boolean
}

/**
 * Interface that matches the ABI from the "update" function on the Collection manifest.
 * @group Manifest
 */
export interface Update {
  /** The updated script to be used for the contract. */
  script: string
  /** The updated manifest to be used for the contract. */
  manifest: string
  /** The new data to be used for when updating the contract. */
  data: any
}
