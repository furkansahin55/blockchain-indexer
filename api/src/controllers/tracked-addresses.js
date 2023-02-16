const mq = require("../mq");
const db = require("../models");

/**
 * Add address to tracked addresses
 */
exports.trackedAddressesAddController = async (req, res) => {
  const { address } = req.params;

  // check if address is already tracked
  const trackedAddress = await db.tracked_addresses.findOne({
    where: {
      address,
    },
  });

  // if address is already tracked, return error
  if (trackedAddress) {
    res.send({ success: "false", reason: "address already tracked" });
    return;
  }

  // send task to queue
  await mq.sendTask("index-address-transactions", {
    address,
  });

  res.send({ success: "true" });
};
