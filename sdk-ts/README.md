<p align="center">
  <img
    src="https://raw.githubusercontent.com/CityOfZion/wallet-connect-sdk/develop/.github/resources/images/coz.png"
    width="200px;"></img>
</p>

<h1 align="center">PROPS Collection SDK</h1>

<p align="center">
  TypeScript SDK for interacting with PROPS Collection smart contracts on Neo N3
  <br/> Made with ❤ by <b>COZ.IO</b>
</p>

## Overview

The PROPS Collection SDK provides a TypeScript interface for interacting with PROPS Collection smart contracts on the Neo N3 blockchain. It simplifies the process of creating, and sampling from collections in your dApps.

## Features

- Full TypeScript support with type definitions
- Creating collections
- Sampling from collections
- Comprehensive test coverage

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download) 20 or higher
- npm 10 or higher
- [CPM](https://github.com/CityOfZion/cpm)
- [Neo-Express](https://github.com/neo-project/neo-express)

### Setup

```bash
# Install dependencies
npm install

# Build package
npm run tsc
```

## Quick Start

```typescript
import { Collection } from '@cityofzion/props-collection'
import { wallet } from "@cityofzion/neon-js"

// Create a Collection object
const node = "https://mainnet1.neo.coz.io:443"                   // refer to dora.coz.io/monitor for a list of nodes.
const scriptHash = "0xf05651bc505fd5c7d36593f6e8409932342f9085"  // if you are using a different network, the script hash might be different
const account = new wallet.Account()                                 // need to use an account with funds to persist the invokes
const collection = await Collection.init({ node, scriptHash, account })

// Create a new collection
const collectionId = await collection.createCollectionSync({
  description: "My first collection",
  collectionType: "string",
  extra: "",
  values: ["Hello", "World"]
})

// Sample from the collection
const samples = await collection.sampleFromCollectionSync({
  collectionId,
  samples: 2
})
```

### Testing

Before testing locally, ensure that the PROPS Collection and PROPS Dice smart contracts are deployed on your private chain.
The Dice smart contract is required, because Collection uses it to randomly sample collections.

#### Setting Up the Contracts

Use [CPM](https://github.com/CityOfZion/cpm) with the config file at the contract project to download Dice and Collection to your private chain at `default.neo-express`.

```bash
cd ../contract
cpm run
```

#### Preparing the Private Blockchain

After deploying the contracts, set up the private blockchain with Neo-Express by running the following commands at the repository root:

```bash
# Add some funds to the testing account
neoxp transfer 1000 GAS genesis TestAccount -i default.neo-express

# Run the private blockchain while generating blocks faster and discarding changes after exiting
neoxp run -i default.neo-express -s 3 -d
```

#### Running the Tests

Once the private blockchain is running, run the test command at this project:

```bash
# Run all tests
npm run test
```

#### Testing a local version of the contract

If you want to test a local version of the contract, you can compile the contract and then deploy it to your private chain using the following commands:

```bash
# Build the contract
neo3-boa compile ../contract/collection.py

# Deploy the contract to your private chain
neoxp contract deploy ../contract/collection.nef TestAccount -i ../default.neo-express --force
```

Running the deploy command will output the script hash of the contract, it will be different from the contract that CPM got. You can then use this new script hash in your tests when initializing the Collection SDK:

```typescript
// sdk-ts/tests/collection.spec.ts

describe('Basic Collection Test Suite', function () {
// ...
  before(async function () {
    // create a new class instance
    collection = await Collection.init({
      node, // change this if you want to connect to mainnet
      account,
      scriptHash: '0xfaf64c31ac9f580bf4d1d7ca34335567da907706',
    })
  })
// ...
})
```