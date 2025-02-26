<p align="center">
  <img
    src="https://raw.githubusercontent.com/CityOfZion/wallet-connect-sdk/develop/.github/resources/images/coz.png"
    width="200px;"></img>
</p>

<h1 align="center">Props Collection SDK</h1>

<p align="center">
  TypeScript SDK for interacting with Props Collection smart contracts on Neo N3
  <br/> Made with ❤ by <b>COZ.IO</b>
</p>

## Overview

The Props Collection SDK provides a TypeScript interface for interacting with Props Collection smart contracts on the Neo N3 blockchain. It simplifies the process of creating, managing, and sampling from collections in your dApps.

## Features

- Full TypeScript support with type definitions
- Creating collections
- Sampling from collections
- Transaction monitoring and event handling
- Comprehensive test coverage

## Getting Started

### Prerequisites

- Node.js 20 or higher
- pnpm 10 or higher

### Setup

```bash
# Install dependencies
pnpm install

# Build package
pnpm run tsc
```

## Quick Start

```typescript
import { Props } from '@cityofzion/props-collection'

// Create a new collection
const collectionId = await Props.createCollectionSync({
  description: "My first collection",
  collectionType: "string",
  extra: "",
  values: ["Hello", "World"]
})

// Sample from the collection
const samples = await Props.sampleFromCollectionSync({
  collectionId,
  samples: 2
})
```

### Testing

Before testing locally, you need to have the Props Collection and Props Dice smart contracts on your private chain. 

Use [CPM](https://github.com/CityOfZion/cpm) with the config file at [`contract`](../contract/cpm.yaml) to download Dice and Collection to your private chain at [`default.neo-express`](../default.neo-express).

Then run the following commands at the repository root:

```bash
# Add some funds to the testing account
neoxp transfer 1000 GAS genesis NPtWsZzf32C1J6tDrWFsDnNwN1d8HSEPaS -i default.neo-express

# Run the private blockchain while generating blocks faster and discarding changes after exiting
neoxp run -i default.neo-express -s 5 -d
```

Finally, run the test command at this project:

```bash
# Run all tests
pnpm run test
```
