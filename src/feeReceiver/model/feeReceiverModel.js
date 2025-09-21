// models/feeRecieverModel.js
const db = require("../../config/db");

const getCurrentReceivers = async (chapterId, date) => {
  return db("fee_receivers as fr")
    .leftJoin("members as m", "fr.memberId", "m.memberId")
    .where("fr.chapterId", chapterId)
    .andWhere("fr.enableDate", "<=", date)
    .andWhere("fr.disableDate", ">=", date)
    .select(
      "fr.*", 
      "m.firstName", 
      "m.lastName",
      db.raw("CONCAT(m.firstName, ' ', COALESCE(m.lastName, '')) as memberName")
    );
};

const getCashReceivers = async (chapterId) => {
  return db("fee_receivers as fr")
    .leftJoin("members as m", "fr.memberId", "m.memberId")
    .where("fr.paymentType", "cash")
    .andWhere("fr.chapterId", chapterId)
    .select(
      "fr.*", 
      "m.firstName", 
      "m.lastName",
      db.raw("CONCAT(m.firstName, ' ', COALESCE(m.lastName, '')) as memberName")
    );
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
  return db("fee_receivers as fr")
    .leftJoin("members as m", "fr.memberId", "m.memberId")
    .where("fr.paymentType", "online")
    .andWhere("fr.chapterId", chapterId)
    .select(
      "fr.*", 
      "m.firstName", 
      "m.lastName",
      db.raw("CONCAT(m.firstName, ' ', COALESCE(m.lastName, '')) as memberName")
    );
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
    .leftJoin("fee_receivers as fr", "t.paymentReceivedById", "fr.receiverId")
    .leftJoin("members as m", "fr.memberId", "m.memberId")
    .where({ "p.chapterId": chapterId, "t.status": "approved" })
    .select(
      db.raw("t.paymentReceivedById as receiverId"),
      db.raw("SUM(t.paidAmount) as totalAmountCollected"),
      "m.firstName",
      "m.lastName",
      db.raw("CONCAT(m.firstName, ' ', COALESCE(m.lastName, '')) as memberName"),
      "fr.receiverName"
    )
    .groupBy("receiverId", "m.firstName", "m.lastName", "fr.receiverName");
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
