const feeReceiverModel = require("../model/feeReceiverModel");

const getCurrentReceiversService = async (chapterId, date) => {
  try {
    const currentReceivers = await feeReceiverModel.getCurrentReceivers(
      chapterId,
      date
    );
    return currentReceivers;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

module.exports = {
  getCurrentReceiversService,
};
