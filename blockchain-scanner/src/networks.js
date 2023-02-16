const ethers = require("ethers");
const { NODE_ENV } = require("./config");

const production = [
  {
    name: "ethereum_mainnet",
    providerURL: "ws://host.docker.internal:8546",
  },
  {
    name: "ethereum_testnet",
    providerURL: "ws://host.docker.internal:8546",
  },
];

const development = [
  {
    name: "ethereum_mainnet",
    providerURL: "ws://localhost:8546",
  },
  {
    name: "ethereum_testnet",
    providerURL: "ws://localhost:8546",
  },
];

function getNetworks() {
  let networks = development;

  if (NODE_ENV === "production") {
    networks = production;
  }

  networks.forEach((network) => {
    // eslint-disable-next-line no-param-reassign
    network.provider = new ethers.providers.WebSocketProvider(
      network.providerURL
    );
  });

  return networks;
}

module.exports = getNetworks();
