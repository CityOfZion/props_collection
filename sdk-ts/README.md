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

The PROPS Collection SDK provides a TypeScript interface for interacting with PROPS Collection smart contracts on the Neo N3 blockchain. It simplifies the process of creating, managing, and sampling from collections in your dApps.

## Features

- Full TypeScript support with type definitions
- Creating collections
- Sampling from collections
- Comprehensive test coverage

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm 10 or higher

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

Before testing locally, you need to have the PROPS Collection and PROPS Dice smart contracts on your private chain. 

Use [CPM](https://github.com/CityOfZion/cpm) with the config file at [`contract`](../contract/cpm.yaml) to download Dice and Collection to your private chain at [`default.neo-express`](../default.neo-express).

```bash
cd ../contract
cpm run
```

Then run the following commands at the repository root:

```bash
# Add some funds to the testing account
neoxp transfer 1000 GAS genesis NPtWsZzf32C1J6tDrWFsDnNwN1d8HSEPaS -i default.neo-express

# Run the private blockchain while generating blocks faster and discarding changes after exiting
neoxp run -i default.neo-express -s 3 -d
```

Finally, run the test command at this project:

```bash
# Run all tests
npm run test
```
