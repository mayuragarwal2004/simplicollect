const db = require("../../config/db");

const addTransaction = async (data) => {
  return db("transactions").insert(data);
};

const addPayment = async (newRecords) => {
  try {
    const result = await db("members_meeting_mapping").insert(newRecords);
    return result;
  } catch (error) {
    throw error;
  }
};

const getMembersPendingPayments = async (memberId) => {
  try {
    const pendingPayments = await db("members_meeting_mapping")
      .where({ memberId, status: "pending" })
      .select();
    return pendingPayments;
  } catch (error) {
    throw error;
  }
};

const getMembersPendingPaymentsWithPackageDetails = async (memberId) => {
  try {
    const pendingPayments = await db("members_meeting_mapping as mmm")
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
    const result = await db("members_meeting_mapping")
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
    // Only approve if status is 'approved', otherwise just update fields
    const updatePromises = data.map((transaction) => {
      const { transactionId, status, ...updateData } = transaction;
      if (status === 'approved') {
        // Approve: set approvedById, approvedByName, status
        return trx("transactions").where({ transactionId }).update({
          ...updateData,
          status: 'approved',
          approvedById: transaction.approvedById,
          approvedByName: transaction.approvedByName,
        });
      } else {
        // Save only: update allowed fields, do not set status to 'approved' or update approvedById/approvedByName
        return trx("transactions").where({ transactionId }).update({
          ...updateData,
          status: 'pending',
        });
      }
    });
    await Promise.all(updatePromises);
  } catch (error) {
    throw error;
  }
};

const setIsPaid = async (transactionIdsArray, trx) => {
  try {
    const updatePromises = transactionIdsArray.map((transactionId) => {
      return trx("members_meeting_mapping")
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
    await trx("member_chapter_mapping")
      .where({ memberId, chapterId })
      .update({
        balance: trx.raw("balance + ?", [balance]), // Directly add/subtract balance
      });
  }
};

const updateBalance = async (balanceList) => {
  for (const { memberId, chapterId, balance } of balanceList) {
    await db("member_chapter_mapping").where({ memberId, chapterId }).update({
      balance, // Directly set balance
    });
  }
};

const getMemberChapterDue = async (memberId, chapterId) => {
  return db("member_chapter_mapping")
    .where({ memberId, chapterId })
    .select("balance")
    .first();
};
const getTransactions = async (chapterId, rows, page, startDate, endDate) => {
  const parsedRows = parseInt(rows, 10) || 10;
  const parsedPage = parseInt(page, 10) || 0;
  const offset = parsedPage * parsedRows;

  let query = db("transactions as t")
    .join("members as m", "t.memberId", "m.memberId")
    .join("packages as p", "t.packageId", "p.packageId")
    .where("p.chapterId", chapterId);

  // Add date filter if both are provided
  if (startDate && endDate) {
    query = query.whereBetween("t.transactionDate", [startDate, endDate]);
  }

  // Select only the required fields
  const transactions = await query
    .select(
      "m.firstName",  // Member Name (First Name)
      "m.lastName",   // Member Name (Last Name)
      "t.paidAmount", // Amount Paid
      "t.balanceAmount", // Balance
      "p.packageName",  // Package Name
      "t.paymentType",  // Payment Type
      "t.paymentReceivedByName",  // Collected By
      "t.approvedByName",  // Approved By
      "t.transactionDate",  // Date
      "t.status as approvalStatus" // Approval Status
    )
    .limit(parsedRows)
    .offset(offset);

  // Count query with the same date filter
  let countQuery = db("transactions as t")
    .count("t.transactionId as count")
    .join("packages as p", "t.packageId", "p.packageId")
    .where("p.chapterId", chapterId);

  if (startDate && endDate) {
    countQuery = countQuery.whereBetween("t.transactionDate", [startDate, endDate]);
  }

  const [{ count }] = await countQuery;

  return { transactions, totalRecords: parseInt(count, 10) };
};



const getMemberFinancialSummary = async (chapterId, row, page) => {
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
  return { transactionreport, chapterId, totalRecords: parseInt(count, 10) };
};

const getTransactionsByMemberId = async (memberId, chapterId) => {
  return db("transactions as t")
    .join("packages as p", "t.packageId", "p.packageId")
    .where({ "t.memberId": memberId, "p.chapterId": chapterId })
    .orderBy("t.transactionDate", "desc")
    .select("t.*");
};

const getMetaData = async (memberId, chapterId) => {
  try {
    const metaData = await db("transactions")
      .where("chapterId", chapterId)
      .andWhere("paymentReceivedById", memberId)
      .select(
        db.raw(
          `COALESCE(SUM(CASE WHEN status IN ('Pending', 'Approved') THEN paidAmount ELSE 0 END), 0) as totalCollected`
        ),
        db.raw(
          `COALESCE(SUM(CASE WHEN status = 'Pending' THEN paidAmount ELSE 0 END), 0) as pendingAmount`
        ),
        db.raw(
          `COALESCE(SUM(CASE WHEN status = 'Approved' THEN paidAmount ELSE 0 END), 0) as approvedAmount`
        ),
        db.raw(
          `COALESCE(SUM(CASE WHEN transferedToChapterTransactionId IS NOT NULL THEN amountPaidToChapter ELSE 0 END), 0) as totalTransferredToChapter`
        ),
        db.raw(`
      GREATEST(
        COALESCE(SUM(CASE WHEN status = 'Approved' THEN paidAmount ELSE 0 END), 0) -
        COALESCE(SUM(CASE WHEN transferedToChapterTransactionId IS NOT NULL THEN amountPaidToChapter ELSE 0 END), 0),
        0
      ) as remainingToTransfer
    `)
      )
      .first();
    return metaData;
  } catch (error) {
    throw error;
  }
};

// Move approved fee to pending
const moveApprovedToPending = async (data, trx) => {
  try {
    const updatePromises = data.map((transaction) => {
      const { transactionId, termId, ...updateData } = transaction;
      return trx("transactions").where({ transactionId }).update({ status: "pending" });
    });
    await Promise.all(updatePromises);
  } catch (error) {
    throw error;
  }
};

// Save edited fee details without changing status
const saveEditedFeeDetails = async (data, editorInfo = {}) => {
  try {
    const updatePromises = data.map(async (transaction) => {
      const { transactionId, paidAmount, paymentReceivedById, paymentType, paymentReceivedByName, platformFee = 0, receiverFee = 0, payableAmount = 0 } = transaction;
      // Fetch current transaction for systemRemarks and old values
      const [current] = await db("transactions").where({ transactionId }).select();
      let changes = [];
      if (typeof paidAmount === 'number' && paidAmount !== current.paidAmount) changes.push(`paidAmount: ${current.paidAmount} → ${paidAmount}`);
      if (paymentReceivedById && paymentReceivedById !== current.paymentReceivedById) changes.push(`paymentReceivedById: ${current.paymentReceivedById} → ${paymentReceivedById}`);
      if (paymentType && paymentType !== current.paymentType) changes.push(`paymentType: ${current.paymentType} → ${paymentType}`);
      if (paymentReceivedByName && paymentReceivedByName !== current.paymentReceivedByName) changes.push(`paymentReceivedByName: ${current.paymentReceivedByName} → ${paymentReceivedByName}`);
      // Calculate new balanceAmount and amountPaidToChapter
      const newBalanceAmount = typeof paidAmount === 'number' && typeof payableAmount === 'number'
        ? paidAmount - payableAmount
        : current.balanceAmount;
      const newAmountPaidToChapter = typeof paidAmount === 'number'
        ? (paidAmount - (parseFloat(platformFee) || 0) - (parseFloat(receiverFee) || 0))
        : current.amountPaidToChapter;
      // Prepare systemRemarks
      let newSystemRemarks = current.systemRemarks || '';
      if (changes.length > 0 && editorInfo.userName && editorInfo.userId) {
        const now = new Date();
        const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
        newSystemRemarks += `\n[${timestamp}] Edited by ${editorInfo.userName} (${editorInfo.userId}): ${changes.join(', ')}`;
      }
      return db("transactions")
        .where({ transactionId })
        .update({
          paidAmount,
          paymentReceivedById,
          paymentType,
          paymentReceivedByName,
          balanceAmount: newBalanceAmount,
          amountPaidToChapter: newAmountPaidToChapter,
          systemRemarks: newSystemRemarks,
        });
    });
    await Promise.all(updatePromises);
  } catch (error) {
    throw error;
  }
};

// Get all transactions for a chapter in a date range
const getTransactionsByChapterAndDateRange = async (chapterId, startDate, endDate) => {
  return db('transactions as t')
    .join('packages as p', 't.packageId', 'p.packageId')
    .where('p.chapterId', chapterId)
    .andWhere('t.transactionDate', '>=', startDate)
    .andWhere('t.transactionDate', '<=', endDate)
    .select('t.*', 'p.*');
};

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
  getTransactionsByMemberId,
  getMetaData,
  moveApprovedToPending,
  saveEditedFeeDetails, // <-- add export
  getTransactionsByChapterAndDateRange,
};
