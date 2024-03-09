export interface CreateCollection {
    description: string;
    collectionType: string;
    extra: string;
    values: string[];
}
export interface GetCollectionJSON {
    collectionId: number;
}
export interface GetCollection {
    collectionId: number;
}
export interface GetCollectionElement {
    collectionId: number;
    index: number;
}
export interface GetCollectionLength {
    collectionId: number;
}
export interface GetCollectionValues {
    collection_id: number;
}
export interface MapBytesOntoCollection {
    collectionId: number;
    entropy: string;
}
export interface SampleFromCollection {
    collectionId: number;
    samples: number;
}
export interface SampleFromRuntimeCollection {
    values: string[];
    samples: number;
    pick: boolean;
}
export interface Update {
    script: string;
    manifest: string;
    data: any;
}
