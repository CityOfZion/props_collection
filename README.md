<p align="center">
  <img
    src="https://raw.githubusercontent.com/CityOfZion/wallet-connect-sdk/develop/.github/resources/images/coz.png"
    width="200px;"></img>
</p>

<h1 align="center">PROPS</h1>

<p align="center">
  General purpose smart contracts and developer framework for Neo N3
  <br/> Made with ❤ by <b>COZ.IO</b>
</p>


# Overview

In an effort to enhance the developer experience of the Neo N3 platform, COZ has developed the PROPS project.  This project is the first of many which
will significantly improve the ease of use and scalability of both smart contracts and off-chain integrations within our ecosystem.

The PROPS project has 3 primary goals:
1. Produce a Smart Contract package ecosystem which provides developers with the tools they need to deliver complex on-chain routines to their users out-of-the-box.
2. Provide a straight-forward framework/template for new projects to clone and build upon.
3. Deliver real-world contracts with off-chain integrations for developer reference.

The PROPS project is ambiguous in scope outside of those goals.

**Fork me for all the tools required to build a dApp**

### contract
This directory contains the project smart contract.  The directory contains both the
source ([boa](https://github.com/CityOfZion/neo3-boa)) and compiled version of the contract.

### sdk-*
In addition to the smart contract, this project includes a complete, well documented SDK which outlines best practices for
integrating with smart contracts in the Neo N3 ecosystem for off-chain applications.  The SDK includes many design patterns and parsing examples as well as
a complete integration with the pre-packaged `PROPS` smart contracts.

## Quickstart

### For interfacing off-chain
```json
npm install @cityofzion/props-collection
```

**To get a Collection**
```ts
import { Collection } from '@cityofzion/props-collection'

const collection = new Collection()

const collectionJSON = await collection.getCollectionJSON({
    collectionId: 1
})
console.log(collectionJSON)
```

**To sample from a Collection**
```ts
import { Collection, Utils } from '@cityofzion/props-collection'

const collection = new Collection({
    account: new Neon.wallet.Account('{{YOUR_WIF}}')
})

const txid = await collection.sampleFromCollection({
    collectionId: 1
})
const result = await Utils.transactionCompletion(txid)
```

For more examples, refer to the tests directory.

### For Interfacing On-Chain
Add the collections contract to your cpm.yaml file:
```
cpm download contract -c 0xf05651bc505fd5c7d36593f6e8409932342f9085 -n mainnet -s
cpm run
```
**To get a collection**
```python
from cpm_out.collection.contract import Collection
collection = Collection.get_collection_json(1)
```

**To sample from a collection**
```python
from cpm_out.collection.contract import Collection
sample = Collection.sample_from_collection(1)
```