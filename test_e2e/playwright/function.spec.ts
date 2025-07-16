import basicSetup from '../wallet-setup/basic.setup'
import { testWithSynpress } from '@synthetixio/synpress'
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright'

// Set up the test environment with Synpress and MetaMask fixtures, using the basic setup configuration
const test = testWithSynpress(metaMaskFixtures(basicSetup))
// const { expect } = test

test(`should connect to MetaMask and display the airdrop form`, async ({ page, context, metamaskPage, extensionId }) => {
    // Create a new MetaMask instance with the provided context, page, password, and extension ID
    const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId)

    // Navigate to the root page
    await page.goto('/')

    // Click the connect button to initiate the wallet connection
    await page.getByTestId('rk-connect-button').click()
    await page.getByTestId('rk-wallet-option-io.metamask').waitFor({
        state: 'visible',
        timeout: 30000
    });
    await page.getByTestId('rk-wallet-option-io.metamask').click();
    await metamask.connectToDapp();
})
