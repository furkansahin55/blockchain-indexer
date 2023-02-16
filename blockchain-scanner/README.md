# Blockchain Scanner
Blockchain Scanner listens for the new block from defined EVM-compatible chains and sends tasks to the message queue for saving the block transactions.

## Setup
- `cd blockchain-scanner`
- Install dependencies `yarn install`
- Set the environment variables (example.env)
- Set networks to listen and provide URLs of them in src/networks.js
- Run `yarn docker:up` for starting container (blockchain-scanner will keep exiting and restart until rabbitMQ is healthy)

# Notes
- Block reorganizations should be handled block can be followed at least 10 blocks late or we can handle them by deleting faulty transactions on the database
- Graceful exit should be implemented (disconnect from web socket)
- Unit and integration tests should be implemented