/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
class BlockScanner {
  /**
   * Create a new BlockScanner instance
   * @param {import("./networks")} networks
   * @param {import("./block-exporter")} blockExporter
   * @param {import("./last-synced-block")} lastSyncedBlock
   * @param {import("./mq")} mq
   * @param {import("pino").Logger} logger
   */
  constructor(networks, lastSyncedBlock, mq, logger) {
    this.networks = networks;
    this.lastSyncedBlock = lastSyncedBlock;
    this.mq = mq;
    this.logger = logger;
    this.lastExportedBlocks = {};
  }

  /**
   * Subscribe to new block events over WebSocket
   * @returns {Promise<void>}
   * @private
   */
  subscribeNewBlockEvent() {
    this.networks.forEach((network) => {
      // subscribe to new block events
      network.provider.on("block", (blockNumber) => {
        this.logger.info(
          `${network.name} - ${blockNumber} -  new block arrived`
        );
        // check if the new block is greater than the last exported block
        if (blockNumber <= this.lastExportedBlocks[network.name]) {
          this.logger.warn(
            `${network.name} - ${blockNumber} - block reorg detected skipping`
          );
          // TOOD : handle block reorg
        } else {
          for (
            let i = this.lastExportedBlocks[network.name] + 1;
            i <= blockNumber;
            i++
          ) {
            this.logger.info(`${network.name} - ${i} - block added to queue`);
            this.sendTaskToQueue(network.name, i);
          }
        }
        this.lastExportedBlocks[network.name] = blockNumber;
      });

      // handle errors
      network.provider.on("error", (error) => {
        this.logger.error(error, `websocket error`);
        // TODO : handle websocket error
      });
    });
  }

  /**
   * Send task to queue
   * @param {number} blockNumber
   * @returns {Promise<void>}
   * @private
   * */
  async sendTaskToQueue(networkName, blockNumber) {
    // send task to queue
    await this.mq.sendTask(
      "save-block-transactions",
      {
        network: networkName,
        blockNumber,
      },
      10
    );
    await this.lastSyncedBlock.set(networkName, blockNumber);
  }

  /**
   * Catch up from last synced block to current block
   * @returns {Promise<void>}
   * @private
   * */
  async catchUpLastBlock() {
    this.networks.forEach(async (network) => {
      // get current block number
      const currentBlockNumber = await network.provider.getBlockNumber();

      // get last synced block
      const lastSyncedBlock = await this.lastSyncedBlock.get(network.name);

      this.logger.info(
        `${network.name} - last synced block : ${lastSyncedBlock}`
      );

      if (lastSyncedBlock <= currentBlockNumber && lastSyncedBlock > 0) {
        this.logger.info(
          `${network.name} - catching up to block: ${currentBlockNumber}`
        );
        // loop through all blocks from last synced block to current block
        for (let i = lastSyncedBlock; i <= currentBlockNumber; i++) {
          // export block and save raw data to db
          await this.sendTaskToQueue(network.name, i);
        }
        this.logger.info(`${network.name} - catchup blocks sent to queue`);
      }

      // update last exported block
      this.lastExportedBlocks[network.name] = currentBlockNumber;
    });
  }

  /**
   * Start block scanner
   * @returns {Promise<void>}
   */
  async run() {
    this.logger.info("block scanner started");

    // catch up from last synced block to current block
    this.catchUpLastBlock();

    this.logger.info(`listening for new blocks`);

    // subscribe to new block events
    this.subscribeNewBlockEvent();
  }
}

module.exports = BlockScanner;
