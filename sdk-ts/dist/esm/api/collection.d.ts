import { CreateCollection, GetCollection, GetCollectionElement, GetCollectionJSON, GetCollectionLength, GetCollectionValues, MapBytesOntoCollection, SampleFromCollection, SampleFromRuntimeCollection, Update } from '../types/manifest';
import { ContractInvocation } from "@cityofzion/neon-dappkit-types";
export declare class CollectionAPI {
    static createCollection(scriptHash: string, params: CreateCollection): ContractInvocation;
    static getCollectionJSON(scriptHash: string, params: GetCollectionJSON): ContractInvocation;
    static getCollection(scriptHash: string, params: GetCollection): ContractInvocation;
    static getCollectionElement(scriptHash: string, params: GetCollectionElement): ContractInvocation;
    static getCollectionLength(scriptHash: string, params: GetCollectionLength): ContractInvocation;
    static getCollectionValues(scriptHash: string, params: GetCollectionValues): ContractInvocation;
    static mapBytesOntoCollection(scriptHash: string, params: MapBytesOntoCollection): ContractInvocation;
    static sampleFromCollection(scriptHash: string, params: SampleFromCollection): ContractInvocation;
    static sampleFromRuntimeCollection(scriptHash: string, params: SampleFromRuntimeCollection): ContractInvocation;
    static totalCollections(scriptHash: string): ContractInvocation;
    static update(scriptHash: string, params: Update): ContractInvocation;
}
