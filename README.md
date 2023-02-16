# Blockchain Indexer System
The system saves and indexes transactions on multiple EVM-compatible networks

# Design
High-level design available in HLD.md

# How to Run
- First, run the dockerized PostgreSQL database and migrate (instructions in database/README.md)
- Start the Blockchain Scanner after setting up (instructions in blockchain-scanner/README.md)
- Start Blockchain Indexer (instructions in blockchain-indexer/README.md)
- Start API (instructions in api/README.md)