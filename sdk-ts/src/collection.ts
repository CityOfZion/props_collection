import { ItemAPI } from './api'
import { ItemType, SmartContractConfig, UserAccount } from './types'
import { Utils } from './helpers'
import { u } from '@cityofzion/neon-core'

export class Collection {
  // Once you get a scriptHash from deploying your smart contract via `npm run deploy`, update the `this.options.scriptHash` value.
  // The default is analogous to localnet (neo-express) so you will most likely want to be updating that value.  Remember to
  // compile the sdk before use or your change wont take effect.  Do that by running `tsc` in the sdk directory.
  static MAINNET = '0xf05651bc505fd5c7d36593f6e8409932342f9085'
  static TESTNET = ''
  static PRIVATENET = '0xf05651bc505fd5c7d36593f6e8409932342f9085'

  private config: SmartContractConfig

  constructor(configOptions: SmartContractConfig) {
    this.config = configOptions
  }

  /**
   * DO NOT EDIT ME
   * The contract script hash that is being interfaced with.
   */
  get scriptHash(): string {
    if (this.config.scriptHash) {
      return this.config.scriptHash
    }
    throw new Error('no scripthash defined')
  }

  async symbol(): Promise<string> {
    const res = await this.config.invoker.testInvoke({
      invocations: [ItemAPI.symbol(this.config.scriptHash)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0])
  }

  async decimals(): Promise<number> {
    const res = await this.config.invoker.testInvoke({
      invocations: [ItemAPI.decimals(this.config.scriptHash)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0])
  }

  async totalSupply(): Promise<number> {
    const res = await this.config.invoker.testInvoke({
      invocations: [ItemAPI.totalSupply(this.config.scriptHash)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0])
  }

  // TODO - Iterator Support
  async tokensOf(params: { address: string }): Promise<string[]> {
    const res = await this.config.invoker.testInvoke({
      invocations: [ItemAPI.tokensOf(this.config.scriptHash, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }
    const sessionId = res.session as string
    const iteratorId = res.stack[0].id as string

    const res2 = await this.config.invoker.traverseIterator(sessionId, iteratorId, 10)

    return res2.map(item => {
      return u.hexstring2str(u.base642hex(this.config.parser.parseRpcResponse(item)[1].value))
    })
  }

  async balanceOf(params: { address: string }): Promise<number> {
    const res = await this.config.invoker.testInvoke({
      invocations: [ItemAPI.balanceOf(this.config.scriptHash, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0])
  }

  async transfer(params: { to: string; tokenId: string; data: any }): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [ItemAPI.transfer(this.config.scriptHash, params)],
      signers: [],
    })
  }

  async transferConfirmed(params: { to: string; tokenId: string; data: any }): Promise<string> {
    const txid = await this.transfer(params)
    const log = await Utils.transactionCompletion(txid)

    if (log.executions[0].stack!.length === 0) {
      throw new Error('unrecognized response')
    }

    return this.config.parser.parseRpcResponse(log.executions[0].stack![0])
  }

  async ownerOf(params: { tokenId: string }): Promise<string> {
    const res = await this.config.invoker.testInvoke({
      invocations: [ItemAPI.ownerOf(this.config.scriptHash, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0], {
      ByteStringToScriptHash: true,
    })
  }

  async tokens(): Promise<number> {
    const res = await this.config.invoker.testInvoke({
      invocations: [ItemAPI.tokens(this.config.scriptHash)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    const sessionId = res.session as string
    const iteratorId = res.stack[0].id as string

    const res2 = await this.config.invoker.traverseIterator(sessionId, iteratorId, 10)

    console.log(res2)
    return 0
    // return this.config.parser.parseRpcResponse(res.stack[0])
  }

  async properties(params: { tokenId: string }): Promise<string> {
    const res = await this.config.invoker.testInvoke({
      invocations: [ItemAPI.properties(this.config.scriptHash, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0])
  }

  // USER SCOPE

  async getUserJSON(params: { address: string }): Promise<UserAccount> {
    const res = await this.config.invoker.testInvoke({
      invocations: [ItemAPI.getUserJSON(this.config.scriptHash, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0])
  }

  async getUser(params: { address: string }): Promise<string> {
    const res = await this.config.invoker.testInvoke({
      invocations: [ItemAPI.getUser(this.config.scriptHash, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0])
  }

  // TODO
  async setUserPermissions(params: { address: string; permissions: any }): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [ItemAPI.setUserPermissions(this.config.scriptHash, params)],
      signers: [],
    })
  }

  async totalAccounts(): Promise<number> {
    const res = await this.config.invoker.testInvoke({
      invocations: [ItemAPI.totalAccounts(this.config.scriptHash)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0])
  }

  // EPOCH SCOPE

  async createEpoch(params: {
    label: string
    generatorInstanceId: number
    mintFee: number
    sysFee: number
    maxSupply: number
    authAge: number
  }): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [ItemAPI.createEpoch(this.config.scriptHash, params)],
      signers: [],
    })
  }

  async getEpochJSON(params: { epochId: string }): Promise<string> {
    const res = await this.config.invoker.testInvoke({
      invocations: [ItemAPI.getEpochJSON(this.config.scriptHash, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0])
  }

  async getEpoch(params: { epochId: string }): Promise<string> {
    const res = await this.config.invoker.testInvoke({
      invocations: [ItemAPI.getEpoch(this.config.scriptHash, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0])
  }

  async setMintFee(params: { epochId: string; amount: number }): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [ItemAPI.setMintFee(this.config.scriptHash, params)],
      signers: [],
    })
  }

  async totalEpochs(): Promise<string> {
    const res = await this.config.invoker.testInvoke({
      invocations: [ItemAPI.totalEpochs(this.config.scriptHash)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0])
  }

  // ITEM SCOPE
  async auth(params: {
    mode: string
    assetPubKey: string
    blockIndex: number
    signature: string
    burn: boolean
  }): Promise<boolean> {
    const res = await this.config.invoker.testInvoke({
      invocations: [ItemAPI.auth(this.config.scriptHash, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0])
  }

  async authCommit(params: {
    mode: string
    assetPubKey: string
    blockIndex: number
    signature: string
    burn: boolean
  }): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [ItemAPI.auth(this.config.scriptHash, params)],
      signers: [],
    })
  }

  async authCommitConfirmed(params: {
    mode: string
    assetPubKey: string
    blockIndex: number
    signature: string
    burn: boolean
  }): Promise<boolean> {
    const txid = await this.authCommit(params)
    const log = await Utils.transactionCompletion(txid)

    if (log.executions[0].stack!.length === 0) {
      throw new Error('unrecognized response')
    }

    return this.config.parser.parseRpcResponse(log.executions[0].stack![0])
  }

  async bindItem(params: {
    tokenId: string
    assetPubKey: string
    blockIndex: number
    signature: string
  }): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [ItemAPI.bindItem(this.config.scriptHash, params)],
      signers: [],
    })
  }

  async bindItemConfirmed(
    params: {
      tokenId: string
      assetPubKey: string
      blockIndex: number
      signature: string
    },
    mock?: boolean
  ): Promise<boolean> {
    if (mock) {
      return true
    }

    const txid = await this.bindItem(params)
    const log = await Utils.transactionCompletion(txid)

    if (log.executions[0].stack!.length === 0) {
      throw new Error('unrecognized response')
    }

    return this.config.parser.parseRpcResponse(log.executions[0].stack![0])
  }

  async claimBindOnPickup(params: { assetPubKey: string; blockIndex: number; signature: string }): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [ItemAPI.claimBindOnPickup(this.config.scriptHash, params)],
      signers: [],
    })
  }

  async claimBindOnPickupConfirmed(params: {
    assetPubKey: string
    blockIndex: number
    signature: string
  }): Promise<boolean> {
    const txid = await this.claimBindOnPickup(params)
    const log = await Utils.transactionCompletion(txid)

    if (log.executions[0].stack!.length === 0) {
      throw new Error('unrecognized response')
    }

    return this.config.parser.parseRpcResponse(log.executions[0].stack![0])
  }

  async setBindOnPickup(params: { assetPubKey: string; blockIndex: number; signature: string }): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [ItemAPI.setBindOnPickup(this.config.scriptHash, params)],
      signers: [],
    })
  }

  async setBindOnPickupConfirmed(params: {
    assetPubKey: string
    blockIndex: number
    signature: string
  }): Promise<boolean> {
    const txid = await this.setBindOnPickup(params)
    const log = await Utils.transactionCompletion(txid)

    if (log.executions[0].stack!.length === 0) {
      throw new Error('unrecognized response')
    }

    return this.config.parser.parseRpcResponse(log.executions[0].stack![0])
  }

  async getAssetItemJSON(params: { assetPubKey: string }): Promise<string> {
    const res = await this.config.invoker.testInvoke({
      invocations: [ItemAPI.getAssetItemJSON(this.config.scriptHash, params)],
      signers: [],
    })
    console.log(res)
    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0])
  }

  async getItem(params: { tokenId: string }): Promise<string> {
    const res = await this.config.invoker.testInvoke({
      invocations: [ItemAPI.getItem(this.config.scriptHash, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0])
  }

  async getItemJSON(params: { tokenId: string }, mock?: boolean): Promise<ItemType> {
    if (mock) {
      return {
        description: 'An ITEM',
        image: 'https://props.coz.io/img/item/neo/2780587208/1.png',
        name: 'ITEM',
        asset: '0x9f0663cd392d918938a57de3d1318fca2c8130de',
        owner: '0x8a4c7d4629a4e58715945510c0350ae1a5e5a403',
        bindOnPickup: false,
        seed: 'ÛØ0«[ýJcªãF\r\\Àa\x93',
        tokenId: '1',
        tokenURI: 'https://props.coz.io/tok/item/neo/2780587208/1',
        epoch: {
          epochId: 1,
          label: 'Consensus 2023',
          epochAuthAge: 4,
          epochTokenId: 1,
          maxSupply: 100,
        },
        traits: {
          color: 'white',
        },
      }
    }
    const res = await this.config.invoker.testInvoke({
      invocations: [ItemAPI.getItemJSON(this.config.scriptHash, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0], {
      ByteStringToScriptHash: true,
    })
  }

  async getItemJSONFlat(params: { tokenId: string }): Promise<string> {
    const res = await this.config.invoker.testInvoke({
      invocations: [ItemAPI.getItemJSONFlat(this.config.scriptHash, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0])
  }

  async offlineMint(params: { epochId: number; address: string }): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [ItemAPI.offlineMint(this.config.scriptHash, params)],
      signers: [],
    })
  }

  async offlineMintConfirmed(params: { epochId: number; address: string }): Promise<string> {
    const txid = await this.offlineMint(params)
    const log = await Utils.transactionCompletion(txid)

    if (log.executions[0].stack!.length === 0) {
      throw new Error('unrecognized response')
    }

    return this.config.parser.parseRpcResponse(log.executions[0].stack![0])
  }
}
