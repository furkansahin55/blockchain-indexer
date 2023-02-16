const ethers = require("ethers");
const { NODE_ENV } = require("./config");

const production = [
  {
    name: "ethereum_mainnet",
    providerURL: "http://host.docker.internal:8545",
  },
  {
    name: "ethereum_testnet",
    providerURL: "http://host.docker.internal:8545",
  },
];

const development = [
  {
    name: "ethereum_mainnet",
    providerURL: "http://localhost:8545",
  },
  {
    name: "ethereum_testnet",
    providerURL: "http://localhost:8545",
  },
];

function getNetworks() {
  let networks = development;

  if (NODE_ENV === "production") {
    networks = production;
  }

  networks.forEach((network) => {
    // eslint-disable-next-line no-param-reassign
    network.provider = new ethers.providers.JsonRpcBatchProvider(
      network.providerURL
    );
  });

  return networks;
}

module.exports = getNetworks();
