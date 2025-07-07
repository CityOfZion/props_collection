import { Collection } from '../src'
import { wallet, u } from '@cityofzion/neon-js'
import { chiSquaredTest } from './helper'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { NeonEventListener, NeonParser, TypeChecker } from '@cityofzion/neon-dappkit'
import wordsJson from './words.json' assert { type: 'json' }

chai.use(chaiAsPromised)
const assert = chai.assert

describe('Basic Collection Test Suite', function () {
  this.timeout(60000)
  let collection: Collection
  const node = 'http://127.0.0.1:50012'
  const listener: NeonEventListener = new NeonEventListener(node)
  const account = new wallet.Account('f648c2f94ac19108433dd4763448c4c5ea2f13db8215ac1736637b8c6b00cf9b')

  before(async function () {
    // create a new class instance
    collection = await Collection.init({
      node, // change this if you want to connect to mainnet
      account,
    })
  })

  describe('Unit tests', function () {
    it('should create a very large collection', async () => {
      const collectionLength = 2000
      const values: string[] = []
      for (let i = 0; i < collectionLength; i++) {
        values.push(generateName())
      }

      const txid = await collection.createCollection({
        description: 'a collection with 2000 objects',
        collectionType: 'string',
        extra: '',
        values,
      })
      const log = await listener.waitForApplicationLog(txid)

      if (!TypeChecker.isRpcResponseStackItem(log.executions[0].stack?.[0])) {
        throw new Error('Invalid stack item')
      }

      const collectionId = NeonParser.parseRpcResponse(log.executions[0].stack?.[0])
      const collectionJSON = await collection.getCollectionJSON({
        collectionId,
      })

      values.forEach((val: any, i: number) => {
        assert.deepEqual(val, collectionJSON.values[i])
      })
    })

    it('should synchronously create a collection', async () => {
      const collectionLength = 100
      const values: string[] = []
      for (let i = 0; i < collectionLength; i++) {
        values.push(generateName())
      }

      const collectionId = await collection.createCollectionSync({
        description: 'a collection with 100 objects',
        collectionType: 'string',
        extra: '',
        values,
      })

      const collectionJSON = await collection.getCollectionJSON({
        collectionId,
      })

      values.forEach((val: any, i: number) => {
        assert.deepEqual(val, collectionJSON.values[i])
      })
    })

    it('should create a integer collection', async () => {
      const collectionLength = 10
      const values: string[] = []
      for (let i = 0; i < collectionLength; i++) {
        values.push(i.toString())
      }

      const collectionId = await collection.createCollectionSync({
        description: 'a collection with 10 objects',
        collectionType: 'integer',
        extra: '',
        values,
      })

      const collectionJSON = await collection.getCollectionJSON({
        collectionId,
      })

      values.forEach((val: any, i: number) => {
        assert.deepEqual(Number(val), collectionJSON.values[i])
      })
    })

    it('should get a collection in JSON format', async () => {
      const collectionLength = 20
      const values: string[] = []
      for (let i = 0; i < collectionLength; i++) {
        values.push(generateName())
      }

      const description = 'a collection with 20 objects'
      const collectionType = 'string'
      const extra = 'extra information'

      const collectionId = await collection.createCollectionSync({
        description,
        collectionType,
        extra,
        values,
      })

      const collectionJSON = await collection.getCollectionJSON({
        collectionId,
      })

      assert.deepEqual(u.HexString.fromBase64(u.utf82base64(collectionJSON.id)).toNumber(), collectionId)
      assert.deepEqual(u.HexString.fromBase64(collectionJSON.author).toLittleEndian(), account.scriptHash)
      assert.deepEqual(collectionJSON.description, description)
      assert.deepEqual(collectionJSON.type, collectionType)
      assert.deepEqual(collectionJSON.extra, extra)
      assert.sameDeepMembers(collectionJSON.values, values)
    })

    it('should get a collection', async () => {
      const collectionLength = 20
      const values: string[] = []
      for (let i = 0; i < collectionLength; i++) {
        values.push(generateName())
      }

      const description = 'a collection with 20 objects'
      const collectionType = 'string'
      const extra = 'extra information'

      const collectionId = await collection.createCollectionSync({
        description,
        collectionType,
        extra,
        values,
      })

      const collectionList = await collection.getCollection({
        collectionId,
      })

      assert.deepEqual(u.HexString.fromBase64(u.utf82base64(collectionList[0])).toNumber(), collectionId)
      assert.deepEqual(u.HexString.fromBase64(collectionList[1]).toLittleEndian(), account.scriptHash)
      assert.deepEqual(collectionList[2], description)
      assert.deepEqual(collectionList[3], collectionType)
      assert.deepEqual(collectionList[4], extra)
      assert.sameDeepMembers(collectionList[5], values)
    })

    it('should get elements from a very large collection', async () => {
      const values: string[] = []
      for (let i = 0; i < 500; i++) {
        values.push(generateName())
      }

      const txid = await collection.createCollection({
        description: 'a small collection',
        collectionType: 'string',
        extra: '',
        values,
      })

      const log = await listener.waitForApplicationLog(txid)

      if (!TypeChecker.isRpcResponseStackItem(log.executions[0].stack?.[0])) {
        throw new Error('Invalid stack item')
      }

      const collectionId = NeonParser.parseRpcResponse(log.executions[0].stack?.[0])

      let collectionElement
      for (let i = 0; i < values.length; i++) {
        const val = values[i]
        collectionElement = await collection.getCollectionElement({
          collectionId,
          index: i,
        })
        assert.deepEqual(val, collectionElement)
      }
    })

    it('should get the collection length', async () => {
      const values: string[] = []
      for (let i = 0; i < 100; i++) {
        values.push(generateName())
      }

      const collectionId = await collection.createCollectionSync({
        description: 'a collection with 100 objects',
        collectionType: 'string',
        extra: '',
        values,
      })

      const collectionLength = await collection.getCollectionLength({
        collectionId,
      })
      assert.deepEqual(values.length, collectionLength)
    })

    it('should get a collection values', async () => {
      const collectionLength = 50
      const values: string[] = []
      for (let i = 0; i < collectionLength; i++) {
        values.push(generateName())
      }
      const collectionId = await collection.createCollectionSync({
        description: 'a collection with 50 objects',
        collectionType: 'string',
        extra: '',
        values,
      })

      const collectionValues = await collection.getCollectionValues({
        collectionId,
      })

      values.forEach((val: any, i: number) => {
        assert.deepEqual(val, collectionValues[i])
      })
    })

    it('should get a value from the collection based on entropy', async () => {
      const collectionLength = 100
      const values: string[] = []
      for (let i = 0; i < collectionLength; i++) {
        values.push(generateName())
      }

      const collectionId = await collection.createCollectionSync({
        description: 'a collection with 100 objects',
        collectionType: 'string',
        extra: '',
        values,
      })

      const collectionValueSync = await collection.mapBytesOntoCollectionSync({
        collectionId,
        entropy: '1',
      })
      const txId = await collection.mapBytesOntoCollection({
        collectionId,
        entropy: '1',
      })

      const log = await listener.waitForApplicationLog(txId)
      if (!TypeChecker.isRpcResponseStackItem(log.executions[0].stack?.[0])) {
        throw new Error('Invalid stack item')
      }
      const collectionValueAsync = NeonParser.parseRpcResponse(log.executions[0].stack?.[0])

      assert.deepEqual(collectionValueSync, collectionValueAsync)
    })

    it('should synchronously sample from the range of values in a collection', async () => {
      const collectionLength = 100

      const values: string[] = []
      for (let i = 0; i < collectionLength; i++) {
        values.push(generateName())
      }

      const collectionId = await collection.createCollectionSync({
        description: 'a collection with 100 objects',
        collectionType: 'string',
        extra: '',
        values,
      })
      const samples = await collection.sampleFromCollectionSync({
        collectionId,
        samples: 10,
      })

      assert.includeMembers(values, samples)
    })

    it('should synchronously sample from a runtime sample', async () => {
      const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
      const samples = await collection.sampleFromRuntimeCollectionSync({
        values,
        samples: 10,
        pick: false,
      })

      assert.includeMembers(values, samples)
    })

    it('should get every collection in the contract', async () => {
      const total = await collection.totalCollections()

      for (let collectionId = 1; collectionId <= total; collectionId++) {
        const c = await collection.getCollectionJSON({
          collectionId,
        })
        assert.notDeepEqual(c, undefined)
      }
    })

    it('should throw an error after timing out', async () => {
      const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

      await assert.isRejected(
        collection.sampleFromRuntimeCollectionSync(
          {
            values,
            samples: 10,
            pick: false,
          },
          { timeout: 1 }
        ),
        'Unknown transaction/blockhash'
      )
    })
  })

  describe('Sample behavior tests', function () {
    it('should uniformly sample from the range of values in a collection using the multiple sample feature', async () => {
      const collectionLength = 50
      const samplesPerInvocation = 10
      const runSize = 400

      const values = []
      for (let i = 0; i < collectionLength; i++) {
        values.push(generateName())
      }

      const txid = await collection.createCollection({
        description: 'a collection with 50 objects',
        collectionType: 'string',
        extra: '',
        values,
      })
      let log = await listener.waitForApplicationLog(txid)
      if (!TypeChecker.isRpcResponseStackItem(log.executions[0].stack?.[0])) {
        throw new Error('Invalid stack item')
      }
      const collectionId = NeonParser.parseRpcResponse(log.executions[0].stack?.[0])

      const txids = []
      for (let i = 0; i < runSize; i++) {
        const txid = await collection.sampleFromCollection({
          collectionId,
          samples: samplesPerInvocation,
        })
        txids.push(txid)
      }
      await listener.waitForApplicationLog(txids[txids.length - 1])

      let results: any[] = []
      for (const txid of txids) {
        log = await listener.waitForApplicationLog(txid)
        if (!TypeChecker.isRpcResponseStackItem(log.executions[0].stack?.[0])) {
          throw new Error('Invalid stack item')
        }
        results = results.concat(NeonParser.parseRpcResponse(log.executions[0].stack?.[0]))
      }
      const chiSquared = chiSquaredTest(results)
      assert.isBelow(chiSquared, 73, `chi-squared: ${chiSquared}`)
    })

    it('should uniformly sample from the range of values in a collection', async () => {
      const collectionLength = 100
      const runSize = 2000

      const values = []
      for (let i = 0; i < collectionLength; i++) {
        values.push(generateName())
      }

      const txid = await collection.createCollection({
        description: 'a collection with 100 objects',
        collectionType: 'string',
        extra: '',
        values,
      })
      let log = await listener.waitForApplicationLog(txid)
      if (!TypeChecker.isRpcResponseStackItem(log.executions[0].stack?.[0])) {
        throw new Error('Invalid stack item')
      }
      const collectionId = NeonParser.parseRpcResponse(log.executions[0].stack?.[0])

      const txids = []
      for (let i = 0; i < runSize; i++) {
        const txid = await collection.sampleFromCollection({
          collectionId,
          samples: 1,
        })
        txids.push(txid)
      }
      await listener.waitForApplicationLog(txids[txids.length - 1])

      let results: any[] = []
      for (const txid of txids) {
        log = await listener.waitForApplicationLog(txid)
        if (!TypeChecker.isRpcResponseStackItem(log.executions[0].stack?.[0])) {
          throw new Error('Invalid stack item')
        }
        results = results.concat(NeonParser.parseRpcResponse(log.executions[0].stack?.[0]))
      }
      const chiSquared = chiSquaredTest(results)
      assert.isBelow(chiSquared, 132, `chi-squared: ${chiSquared}`)
    })

    it('should sample uniformly from a runtime sample', async () => {
      const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
      const txid = await collection.sampleFromRuntimeCollection({
        values,
        samples: 1000,
        pick: false,
      })
      const log = await listener.waitForApplicationLog(txid)
      if (!TypeChecker.isRpcResponseStackItem(log.executions[0].stack?.[0])) {
        throw new Error('Invalid stack item')
      }
      const result = NeonParser.parseRpcResponse(log.executions[0].stack?.[0])

      const chiSquared = chiSquaredTest(result)
      assert.isBelow(chiSquared, 20)
    })

    it('should pick 9 of the 10 samples multiple times without repeating', async () => {
      const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

      const txids: string[] = []
      for (let i = 0; i < 20; i++) {
        const txid = await collection.sampleFromRuntimeCollection({
          values,
          samples: 9,
          pick: true,
        })
        txids.push(txid)
      }
      let log
      await listener.waitForApplicationLog(txids[txids.length - 1])
      for (const txid of txids) {
        log = await listener.waitForApplicationLog(txid)
        if (!TypeChecker.isRpcResponseStackItem(log.executions[0].stack?.[0])) {
          throw new Error('Invalid stack item')
        }
        const result = NeonParser.parseRpcResponse(log.executions[0].stack?.[0])
        assert.deepEqual(result.length, result.filter(onlyUnique).length)
      }

      function onlyUnique(value: any, index: number, self: any) {
        return self.indexOf(value) === index
      }
    })

    it('should reject a runtime sampling because the picks count is larger than the array length', async () => {
      const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

      try {
        await collection.sampleFromRuntimeCollection({
          values,
          samples: 12,
          pick: true,
        })
        assert.fail('this tx should fail due to sample length')
      } catch (e) {}
    })
  })
})

function capFirst(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}

function generateName() {
  const { adjectives, nouns } = wordsJson
  return capFirst(adjectives[getRandomInt(0, adjectives.length)]) + ' ' + capFirst(nouns[getRandomInt(0, nouns.length)])
}
