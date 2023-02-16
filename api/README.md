# Blockchain Scanner
Blockchain Scanner scans all blocks on an EVM compatible chain and saves transactions to defined PostgreSQL database.

## Setup
- `cd api`
- Set the environment variables (example.env)
- Run `yarn docker:up` for starting container

# Notes
- API implementation is not in best structure should create routes folder for routing logic
- Should implement custom error logic and middlewares to catch and return information
- Process manager like PM2 can be used to scale app with clustering
- Unit and integration tests should be implemented