const { v4: uuidv4 } = require("uuid");
const chapterPaymentModel = require("../model/chapterPaymentModel");
const memberModel = require("../../member/model/memberModel");
const db = require("../../config/db");

const getChapterTransactionsService = async (
  chapterId,
  rows,
  page
) => {
  const transactions = await chapterPaymentModel.getChapterTransactions(
    chapterId,
    rows,
    page
  );
  return transactions;
};

const getApprovedTransactionsService = async (memberId, chapterId, filter) => {
  const transactions = await chapterPaymentModel.getApprovedTransactions(
    memberId,
    chapterId,
    filter
  );
  return transactions;
};

const payToChapterService = async (
  memberId,
  chapterId,
  totalAmount,
  transferredAmount,
  filter
) => {
  const trx = await db.transaction(); // Start transaction

  try {
    // 1. Get approved transactions
    const transactions = await getApprovedTransactionsService(
      memberId,
      chapterId,
      filter
    );

    // 2. Get member details
    const member = await memberModel.findMemberById(memberId);

    const data = {
      id: uuidv4(),
      senderId: memberId,
      chapterId,
      payableAmount: totalAmount,
      transferredAmount,
      senderName: `${member.firstName} ${member.lastName}`,
    };

    // 3. Insert payment record within transaction
    await chapterPaymentModel.payToChapter(data, trx);

    // 4. Update transactions to link with payment record within transaction
    const transactionIds = transactions.map(
      (transaction) => transaction.transactionId
    );
    await chapterPaymentModel.updateTransactionsTransferToChapter(
      transactionIds,
      data.id,
      trx
    );

    await trx.commit(); // Commit transaction if all succeeded
    return { success: true, data: data.id };
  } catch (error) {
    await trx.rollback(); // Rollback on any failure
    console.error("Transaction failed:", error);
    throw error;
  }
};

const getPendingTransactionsService = async (memberId, chapterId) => {
  const transactions = await chapterPaymentModel.getPendingChapterTransactions(
    memberId,
    chapterId
  );
  return transactions;
};

const approvePaymentService = async (memberId, transactionId) => {
  const memberDetails = await memberModel.findMemberById(memberId);
  const transactionData = {
    approvedById: memberId,
    approvedByName: `${memberDetails.firstName} ${memberDetails.lastName}`,
    transactionId,
    status: "approved",
  };
  const result = await chapterPaymentModel.approvePendingRequest(
    transactionData.transactionId,
    transactionData.approvedById,
    transactionData.approvedByName
  );
  return result;
};

module.exports = {
  getApprovedTransactionsService,
  payToChapterService,
  getPendingTransactionsService,
  approvePaymentService,
  getChapterTransactionsService,
};
