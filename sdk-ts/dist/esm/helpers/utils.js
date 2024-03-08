import { rpc, sc, u } from '@cityofzion/neon-core';
import { experimental } from '@cityofzion/neon-js';
import { NetworkOption } from '../constants/config';
import { NeonParser } from "@cityofzion/neon-dappkit";
export class Utils {
    static async transactionCompletion(txid, opts) {
        let options = {
            period: 1000,
            timeout: 30000,
            node: NetworkOption.MainNet,
        };
        options = { ...options, ...opts };
        const client = new rpc.RPCClient(options.node);
        for (let i = 0; i < Math.floor(options.timeout / options.period); i++) {
            try {
                //parse the stack
                const log = await client.getApplicationLog(txid);
                const parsedLog = {
                    log,
                    parsedGASConsumption: parseInt(log.executions[0].gasconsumed) / 10 ** 8,
                    parsedStack: log.executions[0].stack.map((stackItem) => {
                        return NeonParser.parseRpcResponse(stackItem);
                    }),
                    parsedNotifications: log.executions[0].notifications.map((notificationItem) => {
                        return {
                            'scriptHash': notificationItem.contract,
                            'eventName': notificationItem.eventname,
                            'state': NeonParser.parseRpcResponse(notificationItem.state)
                        };
                    })
                };
                return parsedLog;
            }
            catch (e) { }
            await this.sleep(options.period);
        }
        throw new Error('Unable to locate the requested transaction.');
    }
    static chiSquared(samples) {
        const bins = {};
        for (let sample of samples) {
            // @ts-ignore
            if (bins[sample]) {
                // @ts-ignore
                bins[sample] += 1;
            }
            else {
                // @ts-ignore
                bins[sample] = 1;
            }
        }
        // chi-squared test for uniformity
        let chiSquared = 0;
        const expected = samples.length / Object.keys(bins).length;
        const keys = Object.keys(bins);
        for (let i = 0; i < keys.length; i++) {
            // @ts-ignore
            chiSquared += ((bins[keys[i]] - expected) ** 2) / expected;
        }
        return chiSquared;
    }
    static async deployContract(node, networkMagic, nefRaw, manifestRaw, signer) {
        const config = {
            networkMagic,
            rpcAddress: node,
            account: signer,
        };
        const nef = sc.NEF.fromBuffer(nefRaw);
        const manifest = sc.ContractManifest.fromJson(manifestRaw);
        const assembledScript = new sc.ScriptBuilder()
            .emit(sc.OpCode.ABORT)
            .emitPush(u.HexString.fromHex(signer.scriptHash))
            .emitPush(nef.checksum)
            .emitPush(manifest.name)
            .build();
        const scriptHash = u.reverseHex(u.hash160(assembledScript));
        console.log(`deploying ${manifest.name} to 0x${scriptHash} ...`);
        return experimental.deployContract(nef, manifest, config);
    }
    static async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
//# sourceMappingURL=utils.js.map