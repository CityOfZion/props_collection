/// <reference types="node" />
import { wallet } from '@cityofzion/neon-core';
import { ParsedLog, pollingOptions } from '../types';
export declare class Utils {
    static transactionCompletion(txid: string, opts?: pollingOptions): Promise<ParsedLog>;
    static chiSquared(samples: string[]): number;
    static deployContract(node: string, networkMagic: number, nefRaw: Buffer, manifestRaw: any, signer: wallet.Account): Promise<string>;
    static sleep(ms: number): Promise<unknown>;
}
