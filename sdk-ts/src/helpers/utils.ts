import { CONST, rpc, sc, u, wallet } from '@cityofzion/neon-core'
import { ContractInvocation, Neo3Invoker } from '@cityofzion/neo3-invoker'
import { pollingOptions } from '../types'
import { experimental } from '@cityofzion/neon-js'

export class Utils {
  static async transactionCompletion(txid: string, opts?: pollingOptions): Promise<rpc.ApplicationLogJson> {
    let options = {
      period: 500,
      timeout: 2500,
      node: 'http://127.0.0.1:50012',
    }
    options = { ...options, ...opts }

    const client = new rpc.RPCClient(options.node)

    for (let i = 0; i < Math.floor(options.timeout / options.period); i++) {
      try {
        return await client.getApplicationLog(txid)
      } catch (e) {}
      await this.sleep(options.period)
    }
    throw new Error('Unable to locate the requested transaction.')
  }

  static async deploy(invoker: Neo3Invoker, nefRaw: Buffer, rawManifest: any) {
    const nef = sc.NEF.fromBuffer(nefRaw)
    const manifest = sc.ContractManifest.fromJson(rawManifest)

    const invocation: ContractInvocation = {
      scriptHash: CONST.NATIVE_CONTRACT_HASH.ManagementContract,
      operation: 'deploy',
      args: [
        { type: 'ByteArray', value: u.HexString.fromHex(nef.serialize(), true) },
        { type: 'String', value: JSON.stringify(manifest.toJson()) },
      ],
    }
    return invoker.invokeFunction({
      invocations: [invocation],
      signers: [],
    })
  }

  static async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
