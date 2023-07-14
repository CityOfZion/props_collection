import { NeonInvoker } from '@cityofzion/neon-invoker'
import { NeonParser } from '@cityofzion/neon-parser'
import { Item, Utils } from '../dist/esm'
import { Generator, helpers } from '@cityofzion/props'
import Neon, { u } from '@cityofzion/neon-core'
import { assert } from 'chai'

// TODO - Mint and verify total supply change
// TODO - Transfer tests
describe('Bind on pickup', function () {
  this.timeout(60000)

  // contract admin
  const ACCOUNT = new Neon.wallet.Account('')
  const testAccount = new Neon.wallet.Account('f82dac3b9b5361917fd0d3467a68677ed4debe2357e1e8e525c67c51c97a8bb7')
  const mockITEM = new Neon.wallet.Account()

  const scriptHash = Item.PRIVATENET
  const NODE = 'http://127.0.0.1:50012'

  const getSDK = async (account?: any) => {
    return new Item({
      scriptHash,
      invoker: await NeonInvoker.init(NODE, account),
      parser: NeonParser,
    })
  }

  it('Should create an item epoch using a generator instance', async function () {
    const maxSupply = 5000
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

  it('should transfer an item', async function () {
    const epochId = 1
    const sdk = await getSDK(ACCOUNT)

    console.log('minting a token')
    const txid = await sdk.offlineMint({
      epochId,
      address: ACCOUNT.address,
    })
    const log = await Utils.transactionCompletion(txid)

    const tokenId = NeonParser.parseRpcResponse(log.executions[0].stack![0])
    console.log(tokenId)

    const res = await sdk.transferConfirmed({
      to: testAccount.address,
      tokenId: tokenId.toString(),
      data: '',
    })
    assert.isTrue(res)

    const ownerRes = await sdk.ownerOf({
      tokenId: tokenId.toString(),
    })
    assert.equal(Neon.wallet.getAddressFromScriptHash(ownerRes.slice(2)), testAccount.address)
  })

  it('should get the tokens of the root account', async function () {
    const sdk = await getSDK()

    const t = await sdk.tokensOf({
      address: ACCOUNT.address,
    })
    console.log(t)
  })
})
