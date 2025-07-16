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

// Unified controller to get all receivers
const getAllReceiversController = async (req, res) => {
  const { chapterId } = req.params;
  const { type } = req.query; // 'cash', 'online', or undefined for all

  try {
    let receivers;
    if (type === "cash") {
      receivers = await feeReceiverModel.getCashReceivers(chapterId);
    } else if (type === "online") {
      receivers = await feeReceiverModel.getQRReceivers(chapterId);
    } else {
      // Get both types
      const cashReceivers = await feeReceiverModel.getCashReceivers(chapterId);
      const qrReceivers = await feeReceiverModel.getQRReceivers(chapterId);
      receivers = { cash: cashReceivers, online: qrReceivers };
    }
    res.json(receivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Unified controller to add receivers
const addReceiverController = async (req, res) => {
  const { chapterId } = req.params;
  const {
    receiverName,
    memberId,
    enableDate,
    disableDate,
    paymentType,
    qrImageLink,
    receiverAmountType,
    receiverAmount,
    receiverFeeOptional,
    receiverFeeOptionalMessage,
  } = req.body;

  try {
    const receiverId = uuidv4();
    const baseData = {
      receiverId,
      receiverName,
      memberId,
      chapterId,
      paymentType,
      enableDate,
      disableDate,
      receiverAmountType: receiverAmountType || null,
      receiverAmount: receiverAmount || null,
      receiverFeeOptional: receiverFeeOptional || false,
      receiverFeeOptionalMessage: receiverFeeOptionalMessage,
    };

    let newReceiver;
    if (paymentType === "cash") {
      // Include receiverAmountType and receiverAmount for cash receivers too
      newReceiver = await feeReceiverModel.addCashReceiver({
        ...baseData,
      });
    } else if (paymentType === "online") {
      newReceiver = await feeReceiverModel.addQRReceiver({
        ...baseData,
        qrImageLink,
      });
    } else {
      return res.status(400).json({ error: "Invalid payment type" });
    }

    res.json(newReceiver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Unified controller to update receivers
const updateReceiverController = async (req, res) => {
  const { chapterId, receiverId } = req.params;
  const {
    receiverName,
    memberId,
    enableDate,
    disableDate,
    paymentType,
    qrImageLink,
    receiverAmountType,
    receiverAmount,
    receiverFeeOptional,
    receiverFeeOptionalMessage,
  } = req.body;

  try {
    const updateData = {
      receiverName,
      memberId,
      enableDate,
      disableDate,
      receiverAmountType: receiverAmountType || null,
      receiverAmount: receiverAmount || null,
      receiverFeeOptional:
        receiverFeeOptional !== undefined ? receiverFeeOptional : false,
      receiverFeeOptionalMessage: receiverFeeOptionalMessage,
    };

    let updatedReceiver;
    if (paymentType === "cash") {
      // Include receiverAmountType and receiverAmount for cash receivers too
      updatedReceiver = await feeReceiverModel.updateCashReceiver(
        chapterId,
        receiverId,
        {
          ...updateData,
        }
      );
    } else if (paymentType === "online") {
      updatedReceiver = await feeReceiverModel.updateQRReceiver(
        chapterId,
        receiverId,
        {
          ...updateData,
          qrImageLink,
        }
      );
    } else {
      return res.status(400).json({ error: "Invalid payment type" });
    }

    res.json(updatedReceiver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Unified controller to delete receivers
const deleteReceiverController = async (req, res) => {
  const { chapterId, receiverId } = req.params;
  const { paymentType } = req.query;

  try {
    let deletedReceiver;
    if (paymentType === "cash") {
      deletedReceiver = await feeReceiverModel.deleteCashReceiver(
        chapterId,
        receiverId
      );
    } else if (paymentType === "online") {
      deletedReceiver = await feeReceiverModel.deleteQRReceiver(
        chapterId,
        receiverId
      );
    } else {
      return res
        .status(400)
        .json({ error: "Payment type is required for deletion" });
    }

    res.json(deletedReceiver);
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

// Legacy controllers for backward compatibility
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

module.exports = {
  getCurrentReceiversController,
  getAllReceiversController,
  addReceiverController,
  updateReceiverController,
  deleteReceiverController,
  getAmountCollectedController,
  // Legacy exports
  getCashReceiversController,
  getQRReceiversController,
};
