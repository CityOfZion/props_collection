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

# PROPS - Collection Smart Contract and SDK

Props Collection is a smart contract that allows for the creation of collections and the sampling of items from those collections.  This project also includes an off-chain SDK for interfacing with the smart contract.

This project is part of the PROPS project, a collection of smart contracts and off-chain SDKs that are designed to be used as a reference for developers building on the Neo N3 platform.

Visit the [PROPS](https://props.coz.io/d) website for more information.

The smart-contract was developed with [Neo3-boa](https://github.com/cityofzion/neo3-boa), using Python.

## Quickstart

### Smart Contract Quickstart

The following examples are in Python but it can be used with any language that supports the Neo N3 blockchain.

#### Using CPM

Use [CPM]() to install the contract on your local environment. Click [here]((contract/cpm.yaml)) to view a `cpm.yaml` an example.

1. Add the `Dice` and `Collection` contracts to your `cpm.yaml` file:

  ```yaml
  contracts:
      - label: PROPS - Dice
        script-hash: 0x4380f2c1de98bb267d3ea821897ec571a04fe3e0
        source-network: mainnet
        generate-sdk: true
        download: true
      - label: PROPS - Collection
        script-hash: 0xf05651bc505fd5c7d36593f6e8409932342f9085
        source-network: mainnet
        generate-sdk: true
        download: true
  ```

2. Use `cpm run` to download and install the contract.

3. Import the `Collection` interface from the CPM output directory:

```python
from cpm_out.collection.contract import Collection
```

4. Use the `Collection` class to interact with the smart contract.

```python
# Create a Collection
collection_id = Collection.create_collection("My Collection", "This is a collection of items", ["Item 1", "Item 2", "Item 3"])

# Add an item to the collection
Collection.add_item("My Collection", "Item 4")

# Sample an item from the collection
item = Collection.sample_from_collection("My Collection")
```

#### Using `Call Contract`

Alternatively, use the `Call Contract` interop to interact with the collection smart contract.

```python

from boa3.builtin.interop.contract import call_contract

# Collection Contract ScriptHash
collection_hash = "0xf05651bc505fd5c7d36593f6e8409932342f9085"

# Create a Collection
collection_id = call_contract(collection_hash, 'create_collection', ["My Collection", "This is a collection of items"])

# Add an item to the collection
call_contract(collection_hash, 'add_item', ["My Collection", "Item 1"])
```

### Collection Contract Hashes

The props collection contract can be found on the Neo N3 network at the following addresses:

- Mainnet: `0xf05651bc505fd5c7d36593f6e8409932342f9085`
- Testnet: `0xf05651bc505fd5c7d36593f6e8409932342f9085`

[View on Dora](https://dora.coz.io/contract/0xf05651bc505fd5c7d36593f6e8409932342f9085)

### SDK Quickstart

The SDK is available as an NPM package.  To install the package, run the following command:

```bash
npm install @cityofzion/props-collection
```

Basic usage of the SDK is as follows:

```ts
import { Collection, Utils } from '@cityofzion/props-collection'

// Create an instance of the Collection class
const collection = new Collection({
    account: new Neon.wallet.Account('{{YOUR_WIF}}') // Optional
})

// Create a collection
const collectionId = await collection.createCollection({
    name: "My Collection",
    description: "This is a collection of items",
    items: ["Item 1", "Item 2", "Item 3"]
}).AwaitResult()

// Add an item to the collection
await collection.addItem({
    collectionId: 1
    item: "Item 4"
}).AwaitResult()

// Sample an item from the collection
await item = collection.sampleFromCollection({
    collectionId: 1
}).AwaitResult()

// Get a Collection
const collectionJson = collection.getCollectionJson({
    collectionId: 1
}).AwaitResult()

```

For more examples, refer to the tests directory.

## Manually Deploying and Updating the Collection Smart Contract

Use the following steps to manually deploy and update the collection smart contract.

Deployment Example:

1. Install `neon-js` using NPM:
  
  ```bash
  npm install @cityofzion/neon-js
  ```

2. (Optional) Recompile the smart contract using the `neo3-boa` to generate the NEF and Manifest files:

  ```bash
  neo3-boa compile collection.py
  ```
  
If you are using CPM, you can use the `.nef` and `.manifest.json` files from the CPM output directory.

3. Use the following code to deploy the collection smart contract:

```ts
import { wallet } from '@cityofzion/neon-js'
import { NeonParser, NeonInvoker } from "@cityofzion/neon-dappkit";


account = new wallet.Account("{{YOUR_WIF}}");

const rpcAddress = "https://testnet1.neo.coz.io:443";
const invoker = await NeonInvoker.init({ rpcAddress, account });

// Replace the following with the path to the NEF and Manifest files
const nef = fs.readFileSync('collection.nef');
const manifest = fs.readFileSync('collection.manifest.json');

const args = [
    NeonParser.formatRpcArgument(nef, { type: 'ByteArray' }),
    NeonParser.formatRpcArgument(manifest, { type: 'String' })
];

const resp = await invoker.invokeFunction({
    invocations: [{
        scriptHash: '0xfffdc93764dbaddd97c48f252a53ea4643faa3fd',
        operation: 'deploy',
        args
    }],
});
```

To update the collection smart contract, use the following code:

```ts
import { wallet } from '@cityofzion/neon-js'
import { NeonParser, NeonInvoker } from "@cityofzion/neon-dappkit";


account = new wallet.Account("{{YOUR_WIF}}");

const rpcAddress = "https://testnet1.neo.coz.io:443";
const invoker = await NeonInvoker.init({ rpcAddress, account });

// Replace the following with the path to the NEF and Manifest files
const nef = fs.readFileSync('collection.nef');
const manifest = fs.readFileSync('collection.manifest.json');

const args = [
    NeonParser.formatRpcArgument(nef, { type: 'ByteArray' }),
    NeonParser.formatRpcArgument(manifest, { type: 'ByteArray' })
];

const resp = await invoker.invokeFunction({
    invocations: [{
        scriptHash: '<Existing Contract Script Hash>',
        operation: 'update',
        args
    }],
});
```

[Use Dora](https://dora.coz.io/contracts/) to find your existing deployed contract script hash.

## Support

If you encounter problems using the collection smart contract or the SDK, please open an issue on this repository or request help on the [COZ Discord](https://discord.gg/BB8zUApu).
