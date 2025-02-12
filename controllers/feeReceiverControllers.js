const feeReceiverModel = require("../models/feeReceiverModel");
const { v4: uuidv4 } = require("uuid");

const getCashReceiversController = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const cashReceivers = await feeReceiverModel.getCashReceivers(chapterId);
    res.json(cashReceivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const addCashReceiversController = async (req, res) => {
  const { chapterId } = req.params;
  const {
    cashRecieverName,
    memberId,
    enableDate,
    disableDate,
  } = req.body;
  try {
    const cashRecieverId = uuidv4();
    const newCashReceiver = await feeReceiverModel.addCashReceiver(
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
    const qrReceivers = await feeReceiverModel.getQRReceivers(chapterId);
    res.json(qrReceivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const addQRReceiversController = async (req, res) => {
  const { chapterId } = req.params;
  const { qrCode, memberId, qrCodeName,qrImageLink, enableDate, disableDate } =
    req.body;
  try {
    const qrCodeId = uuidv4();
    const newQRReceiver = await feeReceiverModel.addQRReceiver(
      {qrCodeId,qrCode,
      memberId,
      chapterId,
      qrCodeName,
      qrImageLink,
      enableDate,
      disableDate}
    );
    res.json(newQRReceiver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getCurrentCashReceiversController = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const today = new Date();
    const cashReceivers = await feeReceiverModel.getCurrentCashReceivers(chapterId, today);
    res.json(cashReceivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

const getCurrentQRReceiversController = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const today = new Date();
    const qrReceivers = await feeReceiverModel.getCurrentQRReceivers(chapterId, today);
    res.json(qrReceivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getCashReceiversController,
  addCashReceiversController,
  getCurrentCashReceiversController,
  getQRReceiversController,
  addQRReceiversController,
  getCurrentQRReceiversController
};
