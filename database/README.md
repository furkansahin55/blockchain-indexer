# Database
PostgreSQL Database for raw blockchain transaction and structured indexes

## Setup
- cd to database directory `cd database`
- Install dependencies `yarn install`
- Set the environment variables (example.env)
- Run `yarn docker:up` for starting container
- Run `npx sequelize-cli db:create` to create database
- Run `npx sequelize-cli db:migrate` to migrate database

# Notes
- Since Blockchain Indexer works with multiple workers it would be nice to have connection pooling proxy like Pgpool. So connection overhead will be reduced and overall throughput increased.
- For horizontal scalability we will need PostgreSQL native logical streaming solution or 3rd party replication software like Pgpool.
- For load balancing of read queries sequelize can be used. Or Pgpool can be used to load balance.