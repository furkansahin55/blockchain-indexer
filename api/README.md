# Blockchain Scanner
Blockchain Scanner scans all blocks on an EVM-compatible chain and saves transactions to a defined PostgreSQL database.

## Setup
- `cd api`
- Install dependencies `yarn install`
- Set the environment variables (example.env)
- Run `yarn docker:up` for starting container

## Routes
- GET /transactions?addresses={comma separated addresses},limit={limit of transactions to show}&page={page number}
- POST /tracked-addresses/add/{address to track}

# Notes
- API implementation is not in the best structure should create a routes folder for the routing logic
- Should implement custom error logic and middleware to catch and return information
- Process managers like PM2 can be used to scale the app with clustering
- Unit and integration tests should be implemented