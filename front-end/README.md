<p align="center">
  <img
    src="https://raw.githubusercontent.com/CityOfZion/wallet-connect-sdk/develop/.github/resources/images/coz.png"
    width="200px;"></img>
</p>

<h1 align="center">PROPS Collection Front-end</h1>

<p align="center">
  General purpose smart contracts and developer framework for Neo N3
  <br/> Made with ❤ by <b>COZ.IO</b>
</p>

## Overview

This front-end package demonstrates how to integrate the PROPS Collection smart contract into web applications. Showcasing real-world usage of the PROPS Collection SDK.

### Technologies Used

- TypeScript
- Vite
- Bootstrap 5
- SASS
- WalletConnect/Reown SDK

## Features

- Connect with Neo N3 wallets via WalletConnect/Reown
- Create and manage collections
- Runtime sampling from collections
- Runtime collection sampling
- Real-time transaction monitoring
- Code examples in TypeScript and Boa

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm 10 or higher
- A WalletConnect/Reown project ID

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Change the variables at the [`.env.development`](front-end/.env.development) and [`.env.production`](front-end/.env.production) files, you won't be able to connect with WalletConnect/Reown if you don't add a [Project ID](https://docs.reown.com/appkit/vue/cloud/relay#project-id).

```env
VITE_PROJECT_ID="WalletConnect/Reown Project ID"
```
