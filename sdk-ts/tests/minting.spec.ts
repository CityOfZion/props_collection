import { NeonInvoker } from '@cityofzion/neon-invoker'
import { NeonParser } from '@cityofzion/neon-parser'
import { Item, Utils } from '../dist/esm'
import { Generator, helpers } from '@cityofzion/props'
import * as Neon from '@cityofzion/neon-core'
import { assert } from 'chai'

// TODO - Mint and verify total supply change
// TODO - Transfer tests
describe('Minting', function () {
  this.timeout(60000)

  // contract admin
  const ACCOUNT = new Neon.wallet.Account('')
  const testAccount = new Neon.wallet.Account('f82dac3b9b5361917fd0d3467a68677ed4debe2357e1e8e525c67c51c97a8bb7')

  const scriptHash = Item.PRIVATENET
  const NODE = 'http://127.0.0.1:50012'

  const getSDK = async (account?: any) => {
    return new Item({
      scriptHash,
      invoker: await NeonInvoker.init(NODE, account),
      parser: NeonParser,
    })
  }

  it('should create a new generator instance', async function () {
    console.log(ACCOUNT.address)
    const generator = await new Generator({
      scriptHash: '0x0e312c70ce6ed18d5702c6c5794c493d9ef46dc9',
    })
    await generator.init()

    const txid = await generator.createInstance(1, ACCOUNT)
    const log = await Utils.transactionCompletion(txid)
    const generatorInstanceId = NeonParser.parseRpcResponse(log.executions[0].stack![0])
    console.log(generatorInstanceId)
    assert.isAbove(generatorInstanceId, 0)
  })

  it('Should create an item epoch using the new generator instance', async function () {
    const maxSupply = 1000
    const generatorInstanceId = 11
    const sdk = await getSDK(ACCOUNT)

    const txid = await sdk.createEpoch({
      label: 'DK1',
      generatorInstanceId,
      mintFee: 10 * 10 ** 8,
      sysFee: 0.4 * 10 ** 8,
      maxSupply,
      authAge: 4,
    })
    const log = await Utils.transactionCompletion(txid)
    const epochId = NeonParser.parseRpcResponse(log.executions[0].stack![0])
    log.executions[0].notifications!.forEach(notif => {
      console.log(NeonParser.parseRpcResponse(notif.state))
    })
    console.log(epochId)
    console.log(txid)
    assert.isAbove(epochId, 0)
  })

  it('Should set use permissions for the generator instance', async function () {
    const epochId = 1
    const generatorInstanceId = 11

    const authorizedContracts = [
      {
        scriptHash,
        code: epochId,
      },
    ]
    const generator = await new Generator({
      scriptHash: '0x0e312c70ce6ed18d5702c6c5794c493d9ef46dc9',
    })
    await generator.init()

    const txid = await generator.setInstanceAuthorizedContracts(generatorInstanceId, authorizedContracts, ACCOUNT)
    const log = await Utils.transactionCompletion(txid)
    const res = NeonParser.parseRpcResponse(log.executions[0].stack![0])
    console.log(res)
    assert.equal(res, 1)
  })

  it('Should mint an ITEM', async function () {
    const epochId = 1
    const sdk = await getSDK(ACCOUNT)
    console.log(testAccount.address)
    const txid = await sdk.offlineMint({
      epochId,
      address: testAccount.address,
    })
    const log = await Utils.transactionCompletion(txid)
    const event = NeonParser.parseRpcResponse(log.executions[0].notifications![0].state, {
      ByteStringToScriptHash: true,
    })

    console.log(event)
    assert.equal(event[0], undefined)
    assert.equal(event[1], '0x' + testAccount.scriptHash)
    assert.equal(event[2], 1)
    assert.isAbove(event[3], 0)

    const res = NeonParser.parseRpcResponse(log.executions[0].stack![0])
    assert.equal(res, 1)
  })

  it('Should verify the ITEM was minted using account state', async function () {
    const sdk = await getSDK(ACCOUNT)

    const account = await sdk.getUserJSON({
      address: testAccount.address,
    })
    console.log(account.balance)
    assert.equal(account.balance, 1)
  })

  it('Should get the ITEM that was minted', async function () {
    const sdk = await getSDK(ACCOUNT)
    const res = await sdk.getItemJSON({
      tokenId: '1',
    })
    console.log(res)
    assert.isUndefined(res.asset)
    assert.isAbove(Object.keys(res.traits).length, 0)
    assert.equal(res.epoch.epochId, 1)
    assert.equal(res.tokenId, '1')

    const flatRes = await sdk.getItemJSONFlat({
      tokenId: '1',
    })

    const properties = await sdk.properties({
      tokenId: '1',
    })
  })
})
