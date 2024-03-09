"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const neon_core_1 = require("@cityofzion/neon-core");
const neon_js_1 = require("@cityofzion/neon-js");
const config_1 = require("../constants/config");
const neon_dappkit_1 = require("@cityofzion/neon-dappkit");
class Utils {
    static async transactionCompletion(txid, opts) {
        let options = {
            period: 1000,
            timeout: 30000,
            node: config_1.NetworkOption.MainNet,
        };
        options = { ...options, ...opts };
        const client = new neon_core_1.rpc.RPCClient(options.node);
        for (let i = 0; i < Math.floor(options.timeout / options.period); i++) {
            try {
                // parse the stack
                const log = await client.getApplicationLog(txid);
                const parsedLog = {
                    log,
                    parsedGASConsumption: parseInt(log.executions[0].gasconsumed) / 10 ** 8,
                    parsedStack: log.executions[0].stack.map(stackItem => {
                        return neon_dappkit_1.NeonParser.parseRpcResponse(stackItem);
                    }),
                    parsedNotifications: log.executions[0].notifications.map(notificationItem => {
                        return {
                            scriptHash: notificationItem.contract,
                            eventName: notificationItem.eventname,
                            state: neon_dappkit_1.NeonParser.parseRpcResponse(notificationItem.state),
                        };
                    }),
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
        for (const sample of samples) {
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
            chiSquared += (bins[keys[i]] - expected) ** 2 / expected;
        }
        return chiSquared;
    }
    static async deployContract(node, networkMagic, nefRaw, manifestRaw, signer) {
        const config = {
            networkMagic,
            rpcAddress: node,
            account: signer,
        };
        const nef = neon_core_1.sc.NEF.fromBuffer(nefRaw);
        const manifest = neon_core_1.sc.ContractManifest.fromJson(manifestRaw);
        const assembledScript = new neon_core_1.sc.ScriptBuilder()
            .emit(neon_core_1.sc.OpCode.ABORT)
            .emitPush(neon_core_1.u.HexString.fromHex(signer.scriptHash))
            .emitPush(nef.checksum)
            .emitPush(manifest.name)
            .build();
        const scriptHash = neon_core_1.u.reverseHex(neon_core_1.u.hash160(assembledScript));
        console.log(`deploying ${manifest.name} to 0x${scriptHash} ...`);
        return neon_js_1.experimental.deployContract(nef, manifest, config);
    }
    static async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map