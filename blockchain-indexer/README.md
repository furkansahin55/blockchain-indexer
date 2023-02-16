# Blockchain Indexer
Blockchain Indexer creates workers that connect to rabbitMQ message queue and fetch tasks one by one to execute them if the task fails it routed to the dead letter queue "failed_task"

## Setup
- `cd blockchain-indexer`
- Install dependencies `yarn install`
- Set the environment variables (example.env)
- Set networks to listen and provider URLs of them in src/networks.js
- Run `yarn docker:up` for starting container

# Notes
- Script to handle failed tasks should be implemented
- Remote control mechanism for adding and removing workers should be implemented. (Can be a new MQ queue that we can listen for commands)
- Graceful exit should be implemented (finish the task in progress and disconnect from MQ)
- Unit and integration tests should be implemented