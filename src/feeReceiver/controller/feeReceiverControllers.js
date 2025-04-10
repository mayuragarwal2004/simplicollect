const feeReceiverModel = require("../model/feeReceiverModel");
const { v4: uuidv4 } = require("uuid");
const feeReceiverService = require("../service/feeReceiverService");

const getCurrentReceiversController = async (req, res) => {
  const { chapterId } = req.params;
  const { date } = req.query; //DD-MM-YYYY
  // convert to YYYY-MM-DD

  const dateParts = date ? date.split("-") : [];
  const formattedDate =
    dateParts.length === 3
      ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
      : null;

  try {
    const currentReceivers =
      await feeReceiverService.getCurrentReceiversService(
        chapterId,
        formattedDate
      );
    res.json(currentReceivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

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
  const { receiverName, memberId, enableDate, disableDate } = req.body;
  try {
    const receiverId = uuidv4();
    const newCashReceiver = await feeReceiverModel.addCashReceiver({
      receiverId,
      receiverName: receiverName,
      memberId,
      chapterId,
      paymentType: "cash",
      enableDate,
      disableDate,
    });
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
  const { qrCodeName, memberId, qrImageLink, enableDate, disableDate, receiverAmountType, receiverAmount } =
    req.body;
  try {
    const receiverId = uuidv4();
    const newQRReceiver = await feeReceiverModel.addQRReceiver({
      receiverId,
      receiverName: qrCodeName,
      memberId,
      chapterId,
      qrImageLink,
      enableDate,
      disableDate,
      paymentType: "online",
      receiverAmountType,
      receiverAmount,
    });
    res.json(newQRReceiver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getAmountCollectedController = async (req, res) => {
  const { chapterId } = req.params;
  const { date } = req.body; //DD-MM-YYYY
  try {
    const dateObject = date ? new Date(date) : new Date();
    const amountCollected = await feeReceiverModel.getAmountCollected(
      chapterId,
      dateObject
    );
    res.json(amountCollected);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
const deleteCashReceiversController = async (req, res) => {
  const { chapterId,receiverId } = req.params;
  try {
    const deletedReceiver = await feeReceiverModel.deleteCashReceiver(
      chapterId,
      receiverId
    );
    res.json(deletedReceiver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
const deleteQRReceiversController = async (req, res) => {
  const { chapterId,receiverId } = req.params;
  try {
    const deletedReceiver = await feeReceiverModel.deleteQRReceiver(
      chapterId,
      receiverId
    );
    res.json(deletedReceiver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
const updateCashReceiversController = async (req, res) => {
  const { chapterId, receiverId } = req.params;
  const { cashRecieverName, memberId, enableDate, disableDate } = req.body;
  try {
    const updatedCashReceiver = await feeReceiverModel.updateCashReceiver({
      receiverId,
      receiverName: cashRecieverName,
      memberId,
      chapterId,
      paymentType: "cash",
      enableDate,
      disableDate,
    });
    res.json(updatedCashReceiver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
const updateQRReceiversController = async (req, res) => {
  const { chapterId, receiverId } = req.params;
  const { qrCodeName, memberId, qrImageLink, enableDate, disableDate } =
    req.body;
  try {
    const updatedQRReceiver = await feeReceiverModel.updateQRReceiver({
      receiverId,
      receiverName: qrCodeName,
      memberId,
      chapterId,
      qrImageLink,
      enableDate,
      disableDate,
      paymentType: "online",
    });
    res.json(updatedQRReceiver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getCurrentReceiversController,
  getCashReceiversController,
  addCashReceiversController,
  getQRReceiversController,
  addQRReceiversController,
  getAmountCollectedController,
  deleteCashReceiversController,
  deleteQRReceiversController,
  updateCashReceiversController,
  updateQRReceiversController
};
