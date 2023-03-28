
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

const projectId = process.env.INFURA_PROJECT_ID_RINKEBY;
const projectId1 = process.env.INFURA_PROJECT_ID_MUMBAI;
const privateKey = process.env.DEPLOYER_SIGNER_PRIVATE_KEY;

module.exports = {
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: '3HYBUBZU6BR67SBU37TTB2JTDDZR7WXKRZ'
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          privateKey,
          `https://rinkeby.infura.io/v3/${projectId}`
        ),
      network_id: 4, // rinkeby id
      gas: 5500000, // Rinkeby has a lower block limit than mainnet
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 500, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
    matic: {
      provider: () =>
        new HDWalletProvider(
          privateKey,
          `https://polygon-mumbai.g.alchemy.com/v2/${projectId1}`
        ),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    stardust: {
      provider: () =>
        new HDWalletProvider(
          privateKey,
          `https://stardust.metis.io/?owner=588`
        ),
      network_id: 588,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      from: "0x74cA136E2a562f4bCd44B5C561d54B621133C200",
    },
    meter: {
      provider: () =>
        new HDWalletProvider(privateKey, `https://rpctest.meter.io`),
      network_id: 83,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      from: "0x74cA136E2a562f4bCd44B5C561d54B621133C200",
    },
  },
  contracts_directory: "./contracts/",
  contracts_build_directory: "./src/truffle_abis/",
  compilers: {
    solc: {
      version: "0.5.0",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
