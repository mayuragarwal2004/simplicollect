// models/feeRecieverModel.js
const db = require("../../config/db");

const getCurrentReceivers = async (chapterId, date) => {
  return db("fee_receivers")
    .where("chapterId", chapterId)
    .andWhere("enableDate", "<=", date)
    .andWhere("disableDate", ">=", date)
    .select("*");
};

const getCashReceivers = async (chapterId) => {
  return db("fee_receivers")
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
  return db("fee_receivers").insert(data);
};

const getQRReceivers = async (chapterId) => {
  return db("fee_receivers")
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
      receiverAmountType,
      receiverAmount,
  */
  }
  return db("fee_receivers").insert(data);
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
const deleteCashReceiver = async (chapterId, receiverId) => {
  return db("fee_receivers")
    .where("chapterId", chapterId)
    .andWhere("receiverId", receiverId)
    .del();
}
const deleteQRReceiver = async (chapterId, receiverId) => {
  return db("fee_receivers")
    .where("chapterId", chapterId)
    .andWhere("receiverId", receiverId)
    .del();
};
const updateCashReceiver = async (chapterId, receiverId, data) => {
  return db("fee_receivers")
    .where("chapterId", chapterId)
    .andWhere("receiverId", receiverId)
    .update(data);
}
const updateQRReceiver = async (chapterId, receiverId, data) => {
  return db("fee_receivers")
    .where("chapterId", chapterId)
    .andWhere("receiverId", receiverId)
    .update(data);
};
module.exports = {
  getCurrentReceivers,
  getCashReceivers,
  addCashReceiver,
  getQRReceivers,
  addQRReceiver,
  getAmountCollected,
  deleteCashReceiver,
  deleteQRReceiver,
  updateCashReceiver,
  updateQRReceiver,
};
