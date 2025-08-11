start_anvil_with_tsender :; anvil --load-state web3/tsender-deployed.json

start_app :; pnpm dev
build_app :; pnpm next build

