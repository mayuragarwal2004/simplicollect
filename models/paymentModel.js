const db = require("../config/db");

const addPayment = async (newRecords) => {
  try {
    const result = await db("membersmeetingmapping").insert(newRecords);
    return result;
  } catch (error) {
    throw error;
  }
};

const getPendingPayments = async (memberId) => {
  try {
    const pendingPayments = await db("membersmeetingmapping")
      .where({ memberId, status: "pending" })
      .select();
    return pendingPayments;
  } catch (error) {
    throw error;
  }
};

const getPendingPaymentsWithPackageDetails = async (memberId) => {
  try {
    const pendingPayments = await db("membersmeetingmapping as mmm")
      .join("packages as p", "mmm.packageId", "p.packageId")
      .where({ "mmm.memberId": memberId, "mmm.status": "pending" })
      .select("mmm.*", "p.*");
    return pendingPayments;
  } catch (error) {
    throw error;
  }
};

const deletePendingRequest = async (packageId) => {
  try {
    const result = await db("membersmeetingmapping").where({ packageId }).del();
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addPayment,
  getPendingPayments,
  getPendingPaymentsWithPackageDetails,
  deletePendingRequest,
};
