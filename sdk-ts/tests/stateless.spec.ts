import { NeonInvoker } from '@cityofzion/neon-invoker'
import { NeonParser } from '@cityofzion/neon-parser'
import { Item, Utils } from '../dist/esm'
import Neon, { u } from '@cityofzion/neon-core'
import { assert } from 'chai'

// TODO - Mint and verify total supply change
// TODO - Transfer tests
describe('Stateless Item', function () {
  this.timeout(60000)

  const scriptHash = Item.MAINNET
  const NODE = 'https://mainnet1.neo.coz.io:443'

  const getSDK = async (account?: any) => {
    return new Item({
      scriptHash,
      invoker: await NeonInvoker.init(NODE, account),
      parser: NeonParser,
    })
  }

  it('should get the NFT token symbol', async function () {
    const sdk = await getSDK()
    const res = await sdk.symbol()
    assert.equal(res, 'ITEM')
  })

  it('should get the NFT token decimals', async function () {
    const sdk = await getSDK()
    const res = await sdk.decimals()
    assert.equal(res, 0)
  })

  it('should get the NFT total supply', async function () {
    const sdk = await getSDK()
    const res = await sdk.totalSupply()
    assert.isAbove(res, -1)
  })

  it('should get the balance of a new account', async function () {
    const account = new Neon.wallet.Account()
    const sdk = await getSDK()
    const res = await sdk.balanceOf({
      address: account.address,
    })
    console.log(res)
    assert.equal(res, 0)
  })

  it('should get the tokens of a new account', async function () {
    const account = new Neon.wallet.Account()
    const sdk = await getSDK()
    const res = await sdk.tokensOf({
      address: account.address,
    })
    assert.isUndefined(res)
  })

  it('should get the tokens', async function () {
    const account = new Neon.wallet.Account()
    const sdk = await getSDK()
    const res = await sdk.tokens()
    assert.equal(res, 0)
  })

  it('should get the owner of a null token', async function () {
    const account = new Neon.wallet.Account()
    const sdk = await getSDK()
    try {
      const res = await sdk.ownerOf({
        tokenId: '100000000000',
      })
      assert.fail()
    } catch (err) {}
  })

  it('should get the total number of accounts', async function () {
    const account = new Neon.wallet.Account()
    const sdk = await getSDK()
    const res = await sdk.totalAccounts()
    assert.equal(res, 2)
  })

  it('should get account permissions', async function () {
    const account = new Neon.wallet.Account('NaZwraSdJv9BYwYzZryiZcydaPDof56beK')
    const sdk = await getSDK()
    const res = await sdk.getUserJSON(account)
    console.log(res)
  })

  it('should get a token using a public key', async function () {
    const sdk = await getSDK(new Neon.wallet.Account(''))

    const someTokenByAsset = await sdk.getAssetItemJSON({
      assetPubKey: '031b228b6aa2c9caebca782d81acd708fae5a794a1bd46de65fb3eaa64e4c7b2fc',
    })
    console.log(someTokenByAsset)
  })
})
