<p align="center">
  <img
    src="https://raw.githubusercontent.com/CityOfZion/wallet-connect-sdk/develop/.github/resources/images/coz.png"
    width="200px;"></img>
</p>

<h1 align="center">PROPS Collection</h1>

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
integrating with smart contracts in the Neo N3 ecosystem for off-chain applications. The SDK includes many design patterns and parsing examples as well as
a complete integration with the pre-packaged `PROPS` smart contracts.

## Quickstart

### Clone the repository

```bash
git clone https://github.com/CityOfZion/props_collection.git
cd props_collection
```

### Run the dApp locally

While at the root of the monorepo, run the following commands: 
```bash
npm i
npm run build-sdk
npm run dev
```
You need to `npm run build-sdk` first, because this will build the `sdk` documentation and put it on the `front-end` project.

The `front-end` project also uses the local `sdk-ts` package to format the requests' parameters that will be sent to the blockchain.

> To connect to WalletConnect, you'll need to have an [Project ID](https://docs.reown.com/appkit/vue/cloud/relay#project-id) and add it to your environments ([dev](front-end/.env.development) and [prod](front-end/.env.production)). You can create one and configure it [here](https://cloud.reown.com/?utm_source=cloud_banner&utm_medium=docs&utm_campaign=backlinks).

### Build the dApp and preview it

```bash
npm run build-dapp
npm run preview
```

### For interfacing off-chain

You can install the `sdk-ts` package with npm or you could use a local copy if you cloned this repository.

```bash
# installing via npm
npm install @cityofzion/props-collection
```
```json
// referencing local copy
{
  "dependencies": {
    "@cityofzion/props-collection": "file:path/to/sdk-ts"
  }
}
```

**To get a Collection**
```ts
import { Collection } from '@cityofzion/props-collection'

const collection = await Collection.init({
  node: "https://mainnet1.neo.coz.io:443"
})

const collectionJSON = await collection.getCollectionJSON({
  collectionId: 1
})
console.log(collectionJSON)
```

**To sample from a Collection**
```ts
import { Collection } from '@cityofzion/props-collection'
import { wallet } from '@cityofzion/neon-js'

const collection = await Collection.init({
  node: "https://mainnet1.neo.coz.io:443"
  account: new wallet.Account('{{YOUR_WIF}}')
})

const samples = await collection.sampleFromCollectionSync({
  collectionId: 1,
  samples: 5
})
```

For more examples, refer to the [tests directory](./sdk-ts/tests/collection.spec.ts).

### For Interfacing On-Chain
Add the collection contract to your cpm.yaml file:
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