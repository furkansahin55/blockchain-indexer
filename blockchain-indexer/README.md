# Blockchain Indexer
Blockchain Indexer creates workers that connects to rabbitMQ message queue and fetch tasks one by one to execute them if task fails it routed to dead letter queue "failed_task"

## Setup
- `cd blockchain-indexer`
- Set the environment variables (example.env)
- Set networks to listen and provider urls of them in src/networks.js
- Run `yarn docker:up` for starting container

# Notes
- Script to handle failed tasks should be implemented
- Remote control mechanism for adding and removing workers should be implemented. (Can be a new MQ queue that we can listen for commands)
- Graceful exit should be implemented (finish task in progress and disconnect from MQ)
- Unit and integration tests should be implemented