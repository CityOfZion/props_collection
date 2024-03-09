"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionAPI = void 0;
class CollectionAPI {
    static createCollection(scriptHash, params) {
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
        };
    }
    static getCollectionJSON(scriptHash, params) {
        return {
            scriptHash,
            operation: 'get_collection_json',
            args: [{ type: 'Integer', value: params.collectionId.toString() }],
        };
    }
    static getCollection(scriptHash, params) {
        return {
            scriptHash,
            operation: 'get_collection',
            args: [{ type: 'Integer', value: params.collectionId.toString() }],
        };
    }
    static getCollectionElement(scriptHash, params) {
        return {
            scriptHash,
            operation: 'get_collection_element',
            args: [
                { type: 'Integer', value: params.collectionId.toString() },
                { type: 'Integer', value: params.index.toString() },
            ],
        };
    }
    static getCollectionLength(scriptHash, params) {
        return {
            scriptHash,
            operation: 'get_collection_length',
            args: [{ type: 'Integer', value: params.collectionId.toString() }],
        };
    }
    static getCollectionValues(scriptHash, params) {
        return {
            scriptHash,
            operation: 'get_collection_values',
            args: [{ type: 'Integer', value: params.collection_id.toString() }],
        };
    }
    static mapBytesOntoCollection(scriptHash, params) {
        return {
            scriptHash,
            operation: 'map_bytes_onto_collection',
            args: [
                { type: 'Integer', value: params.collectionId.toString() },
                { type: 'String', value: params.entropy },
            ],
        };
    }
    static sampleFromCollection(scriptHash, params) {
        return {
            scriptHash,
            operation: 'sample_from_collection',
            args: [
                { type: 'Integer', value: params.collectionId.toString() },
                { type: 'Integer', value: params.samples.toString() },
            ],
        };
    }
    static sampleFromRuntimeCollection(scriptHash, params) {
        return {
            scriptHash,
            operation: 'sample_from_runtime_collection',
            args: [
                { type: 'Array', value: params.values.map(value => ({ type: 'String', value })) },
                { type: 'Integer', value: params.samples.toString() },
                { type: 'Boolean', value: params.pick },
            ],
        };
    }
    static totalCollections(scriptHash) {
        return {
            scriptHash,
            operation: 'total_collections',
            args: [],
        };
    }
    static update(scriptHash, params) {
        return {
            scriptHash,
            operation: 'update',
            args: [
                { type: 'ByteArray', value: params.script },
                { type: 'String', value: params.manifest },
                { type: 'Any', value: params.data },
            ],
        };
    }
}
exports.CollectionAPI = CollectionAPI;
//# sourceMappingURL=collection.js.map