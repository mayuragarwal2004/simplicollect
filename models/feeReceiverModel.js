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


module.exports = {
  getCashReceivers,
  addCashReceiver,
  getCurrentCashReceivers,
  getQRReceivers,
  addQRReceiver,
  getCurrentQRReceivers,
};
