const paymentModel = require("../model/paymentModel");

const getMetaDataService = async (memberId, chapterId) => {
  try {
    const metaData = await paymentModel.getMetaData(memberId, chapterId);
    return metaData;
  } catch (error) {
    console.error("Error fetching metadata:", error);
    throw error;
  }
};

module.exports = {
  getMetaDataService,
};
