import { NeonInvoker, NeonParser } from "@cityofzion/neon-dappkit";
import { NetworkOption } from '../constants/config';
import Neon, { rpc } from '@cityofzion/neon-core';
export interface ConstructorOptions {
    node?: string;
    scriptHash?: string;
    invoker?: NeonInvoker;
    parser?: typeof NeonParser;
    account?: Neon.wallet.Account | undefined;
}
export declare type pollingOptions = {
    period?: number;
    timeout?: number;
    node?: NetworkOption;
};
export declare type ParsedLog = {
    log: rpc.ApplicationLogJson;
    parsedStack: any;
    parsedNotifications: any;
    parsedGASConsumption: any;
};
