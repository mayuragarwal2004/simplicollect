const db = require("../../config/db");

const addTransaction = async (data) => {
  return db("transactions").insert(data);
};

const addPayment = async (newRecords) => {
  try {
    const result = await db("membersmeetingmapping").insert(newRecords);
    return result;
  } catch (error) {
    throw error;
  }
};

const getMembersPendingPayments = async (memberId) => {
  try {
    const pendingPayments = await db("membersmeetingmapping")
      .where({ memberId, status: "pending" })
      .select();
    return pendingPayments;
  } catch (error) {
    throw error;
  }
};

const getMembersPendingPaymentsWithPackageDetails = async (memberId) => {
  try {
    const pendingPayments = await db("membersmeetingmapping as mmm")
      .leftJoin("transactions as t", "mmm.transactionId", "t.transactionId")
      .join("packages as p", "t.packageId", "p.packageId")
      .where({ "mmm.memberId": memberId, "t.status": "pending" })
      .select("mmm.*", "p.*", "t.*");
    return pendingPayments;
  } catch (error) {
    throw error;
  }
};

const getPaymentRequests = async (
  memberId,
  chapterId,
  getAllRequests,
  status
) => {
  return db("transactions as t")
    .join("packages as p", "t.packageId", "p.packageId")
    .join("members as m", "t.memberId", "m.memberId")
    .where({ "p.chapterId": chapterId, "t.status": status })
    .andWhere(function () {
      if (getAllRequests) return this.where({ "t.status": status });
      return this.where({ "t.paymentReceivedById": memberId });
    })
    .distinct("t.transactionId")
    .select(
      "p.*",
      "t.*",
      "m.firstName",
      "m.lastName",
      "m.email",
      "m.phoneNumber"
    );
};

const getChapterPendingPayments = async (chapterId) => {
  try {
    const pendingPayments = await db("transactions as t")
      .join("packages as p", "t.packageId", "p.packageId")
      .join("members as mm", "t.memberId", "mm.memberId")
      .join("meetings as m", function () {
        this.on(
          "p.meetingIds",
          "like",
          db.raw("concat('%', m.meetingId, '%')")
        );
      })
      .distinct("p.packageId")
      .where({ "m.chapterId": chapterId, "t.status": "pending" })
      .select("p.*", "t.*", "mm.*");
    return pendingPayments;
  } catch (error) {
    throw error;
  }
};

const deletePendingRequest = async (memberId, transactionId) => {
  try {
    const result = await db("membersmeetingmapping")
      .where({ memberId, transactionId })
      .del();
    await db("transactions").where({ transactionId }).del();
    return result;
  } catch (error) {
    throw error;
  }
};

const getTransactionById = async (transactionId) => {
  try {
    const transaction = await db("transactions")
      .where({ transactionId })
      .select();
    return transaction;
  } catch (error) {
    throw error;
  }
};

// data is an array of objects containing transactionId, approvedById and status
const approvePendingPayment = async (data, trx) => {
  try {
    const updatePromises = data.map((transaction) => {
      const { transactionId, ...updateData } = transaction;
      return trx("transactions").where({ transactionId }).update(updateData);
    });
    await Promise.all(updatePromises);
  } catch (error) {
    throw error;
  }
};

const setIsPaid = async (transactionIdsArray, trx) => {
  try {
    const updatePromises = transactionIdsArray.map((transactionId) => {
      return trx("membersmeetingmapping")
        .where({ transactionId })
        .update({ isPaid: true });
    });
    await Promise.all(updatePromises);
  } catch (error) {
    throw error;
  }
};

const addBalance = async (balanceList, trx) => {
  for (const { memberId, chapterId, balance } of balanceList) {
    await trx("memberChapterMapping")
      .where({ memberId, chapterId })
      .update({
        balance: trx.raw("balance + ?", [balance]), // Directly add/subtract balance
      });
  }
};

const updateBalance = async (balanceList) => {
  for (const { memberId, chapterId, balance } of balanceList) {
    await db("memberChapterMapping").where({ memberId, chapterId }).update({
      balance, // Directly set balance
    });
  }
};

const getMemberChapterDue = async (memberId, chapterId) => {
  return db("memberChapterMapping")
    .where({ memberId, chapterId })
    .select("balance")
    .first();
};
const getTransactions = async (chapterId, rows, page) => {
  const offset = parseInt(page, 10) * parseInt(rows, 10);

  const transactions = await db("transactions as t")
    .join("members as m", "t.memberId", "m.memberId")
    .join("packages as p", "t.packageId", "p.packageId")
    .where("p.chapterId", chapterId)  // Ensure chapter filtering
    .select(
      "t.transactionId",
      "m.firstName",
      "m.lastName",
      "t.payableAmount",
      "t.paidAmount",
      "t.balanceAmount",
      "p.packageName",
      "t.paymentType",
      "t.paymentReceivedByName",
      "t.approvedByName",
      "t.transactionDate",
      "t.status as approvalStatus"
    )
    .limit(parseInt(rows, 10))
    .offset(offset);

  const [{ count }] = await db("transactions as t")
    .count("t.transactionId as count")
    .join("packages as p", "t.packageId", "p.packageId")
    .where("p.chapterId", chapterId);

  return { transactions, totalRecords: parseInt(count, 10) };
};


const getMemberFinancialSummary = async (chapterId,row,page) => {
  const offset = parseInt(page, 10) * parseInt(row, 10);
  const transactionreport = await db("transactions as t")
    .join("members as m", "t.memberId", "m.memberId")
    .join("packages as p", "t.packageId", "p.packageId")
    .where("p.chapterId", chapterId)
    .select(
      "m.memberId",
      db.raw("CONCAT(m.firstName, ' ', m.lastName) as memberName"),
      db.raw("SUM(t.paidAmount) as amountTotal"),
      db.raw("SUM(t.balanceAmount) as totalDues")
    )
    .groupBy("m.memberId", "m.firstName", "m.lastName")
    .limit(parseInt(row, 10))
    .offset(offset);
  const [{ count }] = await db("transactions as t")
    .count("t.transactionId as count")
    .join("packages as p", "t.packageId", "p.packageId")
    .where("p.chapterId", chapterId);
  return { transactionreport,chapterId, totalRecords: parseInt(count, 10) };
}
;

module.exports = {
  addTransaction,
  addPayment,
  getMembersPendingPayments,
  getMembersPendingPaymentsWithPackageDetails,
  getPaymentRequests,
  deletePendingRequest,
  getChapterPendingPayments,
  getTransactionById,
  approvePendingPayment,
  setIsPaid,
  addBalance,
  updateBalance,
  getMemberChapterDue,
  getTransactions,
  getMemberFinancialSummary,
};
