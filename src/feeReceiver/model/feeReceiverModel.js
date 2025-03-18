// models/feeRecieverModel.js
const db = require("../../config/db");

const getCurrentReceivers = async (chapterId, date) => {
  return db("feeReceivers")
    .where("chapterId", chapterId)
    .andWhere("enableDate", "<=", date)
    .andWhere("disableDate", ">=", date)
    .select("*");
};

const getCashReceivers = async (chapterId) => {
  return db("feeReceivers")
    .where("paymentType", "cash")
    .andWhere("chapterId", chapterId)
    .select("*");
};

const addCashReceiver = async (data) => {
  {
    /*
    data = {
      receiverId: uuidv4(),
      receiverName,
      memberId, connection with member table
      chapterId, connection with chapter table
      paymentType: "cash", // or "online"
      enableDate, 
      disableDate,
  */
  }
  return db("feeReceivers").insert(data);
};

const getQRReceivers = async (chapterId) => {
  return db("feeReceivers")
    .where("paymentType", "online")
    .andWhere("chapterId", chapterId)
    .select("*");
};

const addQRReceiver = async (data) => {
  {
    /*
    data = {
      receiverId: uuidv4(),
      receiverName,
      memberId, connection with member table
      chapterId, connection with chapter table
      qrImageLink,
      enableDate, 
      disableDate,
      paymentType: "online",
  */
  }
  return db("feeReceivers").insert(data);
};

const getAmountCollected = async (chapterId, date) => {
  const payments = await db("transactions as t")
    .join("packages as p", "t.packageId", "p.packageId")
    .where({ "p.chapterId": chapterId, "t.status": "approved" })
    .select(
      db.raw("t.paymentReceivedById as receiverId"),
      db.raw("SUM(t.paidAmount) as totalAmountCollected")
    )
    .groupBy("receiverId");
  return payments;
};

module.exports = {
  getCurrentReceivers,
  getCashReceivers,
  addCashReceiver,
  getQRReceivers,
  addQRReceiver,
  getAmountCollected,
};
