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

const getCurrentCashReceivers = async (chapterId, today)=>{
  return db("cashreceivers").where("chapterId", chapterId).andWhere("enableDate", "<=", today).andWhere("disableDate", ">=", today).select("*");
}

const getQRReceivers = async (chapterId) => {
  return db("qrreceivers").where("chapterId", chapterId).select("*");
};

const addQRReceiver = async (data) => {
  return db("qrreceivers").insert(data);
};

const getCurrentQRReceivers = async (chapterId, today)=>{
  return db("qrreceivers").where("chapterId", chapterId).andWhere("enableDate", "<=", today).andWhere("disableDate", ">=", today).select("*");
}


module.exports = {
  getCashReceivers,
  addCashReceiver,
  getCurrentCashReceivers,
  getQRReceivers,
  addQRReceiver,
  getCurrentQRReceivers,
};
