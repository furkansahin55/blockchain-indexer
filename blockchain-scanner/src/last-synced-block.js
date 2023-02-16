class LastSyncedBlock {
  /**
   * Create a new LastSyncedBlock instance
   * @param {import("sequelize").Model} lastSyncedBlockModel
   */
  constructor(networksModel) {
    if (!networksModel) throw new Error("networksModel is required");
    this.lastSyncedBlockModel = networksModel;
  }

  /**
   * Get the last synced block number for a network
   * @returns {number}
   */
  async get(networkName) {
    const lastSyncedBlock = await this.lastSyncedBlockModel.findOne({
      where: { network: networkName },
    });

    // if no last synced block found, return -1
    if (!lastSyncedBlock) return -1;

    return lastSyncedBlock.blockNumber;
  }

  /**
   * Upsert the last synced block number
   * @param {number} blockNumber
   * @returns {void}
   */
  set(networkName, blockNumber) {
    this.lastSyncedBlockModel.upsert({
      network: networkName,
      blockNumber,
    });
  }
}

module.exports = LastSyncedBlock;
