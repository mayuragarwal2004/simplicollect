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

const getQRReceivers = async (chapterId) => {
  return db("qrreceivers").where("chapterId", chapterId).select("*");
};

const addQRReceiver = async (
  qrCodeId,
  qrCode,
  memberId,
  chapterId,
  qrCodeName,
  enableDate,
  disableDate
) => {
  return db("qrreceivers").insert({
    qrCodeId,
    qrCode,
    memberId,
    chapterId,
    qrCodeName,
    enableDate,
    disableDate,
  });
};

module.exports = {
  getCashReceivers,
  addCashReceiver,
  getQRReceivers,
  addQRReceiver,
};
