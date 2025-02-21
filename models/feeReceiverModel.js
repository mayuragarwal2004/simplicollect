// models/feeRecieverModel.js
const db = require("../config/db");

const getCashReceivers = async (chapterId) => {
  return db("cashreceivers").where("chapterId", chapterId).select("*");
};

const addCashReceiver = async (
  cashRecieverId,
  cashRecieverName,
  memberId,
  chapterId,
  enableDate,
  disableDate
) => {
  return db("cashreceivers").insert({
    cashRecieverId,
    cashRecieverName,
    memberId,
    chapterId,
    enableDate,
    disableDate,
  });
};

const getCurrentCashReceivers = async (chapterId, date)=>{
  return db("cashreceivers").where("chapterId", chapterId).andWhere("enableDate", "<=", date).andWhere("disableDate", ">=", date).select("*");
}

const getQRReceivers = async (chapterId) => {
  return db("qrreceivers").where("chapterId", chapterId).select("*");
};

const addQRReceiver = async (data) => {
  return db("qrreceivers").insert(data);
};

const getCurrentQRReceivers = async (chapterId, date)=>{
  return db("qrreceivers").where("chapterId", chapterId).andWhere("enableDate", "<=", date).andWhere("disableDate", ">=", date).select("*");
}

const getAmountCollected = async (chapterId, date) => {
  const cashPayments = await db("transactions as t")
    .join("packages as p", "t.packageId", "p.packageId")
    .where({ "p.chapterId": chapterId, "t.status": "approved" })
    .select(
      db.raw("t.cashPaymentReceivedById as receiverId"),
      db.raw("SUM(t.paidAmount) as totalAmountCollected")
    )
    .groupBy("receiverId");

  const onlinePayments = await db("transactions as t")
    .join("packages as p", "t.packageId", "p.packageId")
    .where({ "p.chapterId": chapterId, "t.status": "approved" })
    .select(
      db.raw("t.onlinePaymentReceivedById as receiverId"),
      db.raw("SUM(t.paidAmount) as totalAmountCollected")
    )
    .groupBy("receiverId");

  return [...cashPayments, ...onlinePayments];
};

module.exports = {
  getCashReceivers,
  addCashReceiver,
  getCurrentCashReceivers,
  getQRReceivers,
  addQRReceiver,
  getCurrentQRReceivers,
  getAmountCollected,
};
