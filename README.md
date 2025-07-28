# TSender UI

This project provides a user interface for the TSender protocol, enabling users to send tokens to a group of addresses across multiple networks in a single transaction

TSender protocol contract source code is at https://github.com/Cyfrin/TSender/blob/main/src/protocol/TSender.sol

and it is deployed to multiple networks including Ethereum, Polygon, and Arbitrum. 

The deployed contract addresses can be found in the [Read the Guide](src/utils/constants.ts) under `chainsToTSender`

# Getting Started

## Requirements

- [node](https://nodejs.org/en/download)
    - You'll know you've installed it right if you can run `node --version` and get a response like `v23.0.1`
- [pnpm](https://pnpm.io/)
    - You'll know you've installed it right if you can run `pnpm --version` and get a response like `10.1.0`
- [git](https://git-scm.com/downloads)
    - You'll know you've installed it right if you can run `git --version` and get a response like `git version 2.33.0`

### Environment Variables

You'll need a `.env.local` the following environment variables:

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Project ID from [reown cloud](https://cloud.reown.com/)

### testing on local anvil



