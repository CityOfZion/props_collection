import { NeonInvoker, NeonParser } from '@cityofzion/neon-dappkit';
import { NetworkOption } from '../constants/config';
import Neon, { rpc } from '@cityofzion/neon-core';
/**
 * Defines configuration options for initializing an instance of a Collection.
 * @prop node Blockchain node URL
 * @prop scriptHash Contract script hash
 * @prop invoker NeonInvoker instance for invoking smart contracts
 * @prop parser NeonParser instance for parsing responses
 * @prop account Neon.wallet.Account for handling transactions
 * @group Interface
 */
export interface ConstructorOptions {
    node?: string;
    scriptHash?: string;
    invoker?: NeonInvoker;
    parser?: typeof NeonParser;
    account?: Neon.wallet.Account | undefined;
}
/**
 * Configuration settings for periodic polling of blockchain data.
 * @prop period Polling interval in milliseconds
 * @prop timeout Timeout for polling operations in milliseconds
 * @prop node Network node selection
 * @group Interface
 * @interface
 */
export type pollingOptions = {
    period?: number;
    timeout?: number;
    node?: NetworkOption;
};
/**
 * Represents a structured application log from the blockchain.
 * @prop log Raw blockchain log data
 * @prop parsedStack Processed execution stack from the log
 * @prop parsedNotifications Parsed event notifications from the transaction
 * @prop parsedGASConsumption GAS consumption formatted to the 8 decimals
 * @group Interface
 * @interface
 */
export type ParsedLog = {
    log: rpc.ApplicationLogJson;
    parsedStack: any;
    parsedNotifications: any;
    parsedGASConsumption: any;
};
/**
 * Defines options for contract invocation.
 * @prop timeout Determines how long in microseconds the function should wait for the transaction to be completed
 * @group Interface
 */
export interface InvocationOptions {
    timeout?: number;
}
