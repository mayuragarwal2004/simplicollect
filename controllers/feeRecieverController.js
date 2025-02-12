const FeeReciever = require("../models/feeRecieverModel");

const getCashReceiversController = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const cashReceivers = await FeeReciever.getCashReceivers(chapterId);
    res.json(cashReceivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const addCashReceiverController = async (req, res) => {
  const { chapterId } = req.params;
  const {
    cashRecieverId,
    cashRecieverName,
    memberId,
    enableDate,
    disableDate,
  } = req.body;
  try {
    const newCashReceiver = await FeeReciever.addCashReceiver(
      cashRecieverId,
      cashRecieverName,
      memberId,
      chapterId,
      enableDate,
      disableDate
    );
    res.json(newCashReceiver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getQRReceiversController = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const qrReceivers = await FeeReciever.getQRReceivers(chapterId);
    res.json(qrReceivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const addQRReceiverController = async (req, res) => {
  const { chapterId } = req.params;
  const { qrCodeId, qrCode, memberId, qrCodeName, enableDate, disableDate } =
    req.body;
  try {
    const newQRReceiver = await FeeReciever.addQRReceiver(
      qrCodeId,
      qrCode,
      memberId,
      chapterId,
      qrCodeName,
      enableDate,
      disableDate
    );
    res.json(newQRReceiver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCashReceiversController,
  addCashReceiverController,
  getQRReceiversController,
  addQRReceiverController,
};
