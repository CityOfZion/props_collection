"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const api_1 = require("./api");
const neon_core_1 = require("@cityofzion/neon-core");
const config_1 = require("./constants/config");
const neon_dappkit_1 = require("@cityofzion/neon-dappkit");
const helpers_1 = require("./helpers");
const DEFAULT_OPTIONS = {
    node: config_1.NetworkOption.MainNet,
    scriptHash: '0xf05651bc505fd5c7d36593f6e8409932342f9085',
    parser: neon_dappkit_1.NeonParser,
    account: undefined,
};
const TIMEOUT = 60000;
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
class Collection {
    constructor(configOptions = {}) {
        this.initialized = 'invoker' in configOptions;
        this.config = { ...DEFAULT_OPTIONS, ...configOptions };
    }
    /**
     * DO NOT EDIT ME
     * The contract script hash that is being interfaced with.
     */
    get scriptHash() {
        if (this.config.scriptHash) {
            return this.config.scriptHash;
        }
        throw new Error('no scripthash defined');
    }
    get node() {
        if (this.config.node) {
            return new neon_core_1.rpc.RPCClient(this.config.node);
        }
        throw new Error('no node selected!');
    }
    async init() {
        if (!this.initialized) {
            this.config.invoker = await neon_dappkit_1.NeonInvoker.init({
                rpcAddress: this.config.node,
                account: this.config.account,
            });
            this.initialized = true;
        }
        return true;
    }
    async createCollection(params, opts = { synchronous: false }) {
        await this.init();
        const txId = await this.config.invoker.invokeFunction({
            invocations: [api_1.CollectionAPI.createCollection(this.config.scriptHash, params)],
            signers: [],
        });
        if (!opts.synchronous) {
            return txId;
        }
        const resp = await helpers_1.Utils.transactionCompletion(txId, {
            timeout: TIMEOUT,
            node: this.config.node,
        });
        return resp.parsedStack[0];
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
    async getCollectionJSON(params) {
        await this.init();
        const res = await this.config.invoker.testInvoke({
            invocations: [api_1.CollectionAPI.getCollectionJSON(this.config.scriptHash, params)],
            signers: [],
        });
        if (res.stack.length === 0) {
            throw new Error(res.exception ?? 'unrecognized response');
        }
        return this.config.parser.parseRpcResponse(res.stack[0]);
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
    async getCollection(params) {
        await this.init();
        const res = await this.config.invoker.testInvoke({
            invocations: [api_1.CollectionAPI.getCollection(this.config.scriptHash, params)],
            signers: [],
        });
        if (res.stack.length === 0) {
            throw new Error(res.exception ?? 'unrecognized response');
        }
        return this.config.parser.parseRpcResponse(res.stack[0]);
    }
    /**
     * Returns the value of a collection from a requested index.
     *
     * @param params.collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
     * @param params.index The index of the array element being requested.
     *
     * @returns The value of the collection element **OR** a txid if the signer parameter is populated.
     */
    async getCollectionElement(params) {
        await this.init();
        const res = await this.config.invoker.testInvoke({
            invocations: [api_1.CollectionAPI.getCollectionElement(this.config.scriptHash, params)],
            signers: [],
        });
        if (res.stack.length === 0) {
            throw new Error(res.exception ?? 'unrecognized response');
        }
        return this.config.parser.parseRpcResponse(res.stack[0]);
    }
    /**
     * Gets the array length of a requested collection.
     *
     * @param params.collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
     *
     * @returns The length of the collection **OR** a txid if the signer parameter is populated.
     */
    async getCollectionLength(params) {
        await this.init();
        const res = await this.config.invoker.testInvoke({
            invocations: [api_1.CollectionAPI.getCollectionLength(this.config.scriptHash, params)],
            signers: [],
        });
        if (res.stack.length === 0) {
            throw new Error(res.exception ?? 'unrecognized response');
        }
        return this.config.parser.parseRpcResponse(res.stack[0]);
    }
    /**
     * Gets the values of a collection, omitting the metadata.
     *
     * @param params.collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
     *
     * @returns The values in the collection **OR** a txid if the signer parameter is populated.
     */
    async getCollectionValues(params) {
        await this.init();
        const res = await this.config.invoker.testInvoke({
            invocations: [api_1.CollectionAPI.getCollectionValues(this.config.scriptHash, params)],
            signers: [],
        });
        if (res.stack.length === 0) {
            throw new Error(res.exception ?? 'unrecognized response');
        }
        return this.config.parser.parseRpcResponse(res.stack[0]);
    }
    async mapBytesOntoCollection(params, opts = { synchronous: false }) {
        await this.init();
        const txId = await this.config.invoker.invokeFunction({
            invocations: [api_1.CollectionAPI.mapBytesOntoCollection(this.config.scriptHash, params)],
            signers: [],
        });
        if (!opts.synchronous) {
            return txId;
        }
        const resp = await helpers_1.Utils.transactionCompletion(txId, {
            timeout: TIMEOUT,
            node: this.config.node,
        });
        return resp.parsedStack[0];
    }
    async sampleFromCollection(params, opts = { synchronous: false }) {
        await this.init();
        const txId = await this.config.invoker.invokeFunction({
            invocations: [api_1.CollectionAPI.sampleFromCollection(this.config.scriptHash, params)],
            signers: [],
        });
        if (!opts.synchronous) {
            return txId;
        }
        const resp = await helpers_1.Utils.transactionCompletion(txId, {
            timeout: TIMEOUT,
            node: this.config.node,
        });
        return resp.parsedStack[0];
    }
    async sampleFromRuntimeCollection(params, opts = { synchronous: false }) {
        await this.init();
        const txId = await this.config.invoker.invokeFunction({
            invocations: [api_1.CollectionAPI.sampleFromRuntimeCollection(this.config.scriptHash, params)],
            signers: [],
        });
        if (!opts.synchronous) {
            return txId;
        }
        const resp = await helpers_1.Utils.transactionCompletion(txId, {
            timeout: TIMEOUT,
            node: this.config.node,
        });
        return resp.parsedStack[0];
    }
    /**
     * Gets the total collections.  Collection IDs are autogenerated on range [1 -> totalCollections] inclusive if you are
     * planning to iterate of their collection IDs.
     * @returns The total number of collections stored in the contract. **OR** a txid if the signer parameter is populated.
     */
    async totalCollections() {
        await this.init();
        const res = await this.config.invoker.testInvoke({
            invocations: [api_1.CollectionAPI.totalCollections(this.config.scriptHash)],
            signers: [],
        });
        if (res.stack.length === 0) {
            throw new Error(res.exception ?? 'unrecognized response');
        }
        return this.config.parser.parseRpcResponse(res.stack[0]);
    }
    async update(params, opts = { synchronous: false }) {
        await this.init();
        const txId = await this.config.invoker.invokeFunction({
            invocations: [api_1.CollectionAPI.update(this.config.scriptHash, params)],
            signers: [],
        });
        if (!opts.synchronous) {
            return txId;
        }
        await helpers_1.Utils.transactionCompletion(txId, {
            timeout: TIMEOUT,
            node: this.config.node,
        });
    }
}
exports.Collection = Collection;
//# sourceMappingURL=Collection.js.map