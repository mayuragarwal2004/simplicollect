const chapterPaymentService = require("../service/chapterPaymentService");
const getApprovedTransactionsController = async (req, res) => {
  const { memberId } = req.user;
  const { filter } = req.query;
  const { chapterId } = req.params;
  if (filter && filter.date) {
    filter.date = new Date(filter.date);
  }
  try {
    const approvedTransactions =
      await chapterPaymentService.getApprovedTransactionsService(
        memberId,
        chapterId,
        filter
      );
    const totalAmount = approvedTransactions.reduce(
      (total, transaction) => total + transaction.paidAmount,
      0
    );
    res.json({ transactions: approvedTransactions, totalAmount });
  } catch (error) {
    console.error("Error fetching approved transactions:", error);
    res.status(500).json({ error: error.message });
  }
};

const payToChapterController = async (req, res) => {
  const { memberId } = req.user;
  const { chapterId } = req.params;
  const { totalAmount, transferredAmount, filter } = req.body;

  try {
    const result = await chapterPaymentService.payToChapterService(
      memberId,
      chapterId,
      totalAmount,
      transferredAmount,
      filter
    );
    res.json(result);
  } catch (error) {
    console.error("Error paying to chapter:", error);
    res.status(500).json({ error: error.message });
  }
};

const getPendingTransactionsController = async (req, res) => {
  const { memberId } = req.user;
  const { chapterId } = req.params;
  try {
    const pendingTransactions =
      await chapterPaymentService.getPendingTransactionsService(
        memberId,
        chapterId
      );
    const totalAmount = pendingTransactions.reduce(
      (total, transaction) => total + transaction.paidAmount,
      0
    );
    res.json(pendingTransactions);
  } catch (error) {
    console.error("Error fetching pending transactions:", error);
    res.status(500).json({ error: error.message });
  }
};

const approvePaymentController = async (req, res) => {
  const { memberId } = req.user;
  const { transactionId } = req.params;
  try {
    const result = await chapterPaymentService.approvePaymentService(
      memberId,
      transactionId
    );
    res.json(result);
  } catch (error) {
    console.error("Error approveing payment:", error);
    res.status(500).json({ error: error.message });
  }
};

const getChapterTransactionsController = async (req, res) => {
  const { chapterId } = req.params;
  const { rows = 5, page = 0 } = req.query;

  try {
    const transactions =
      await chapterPaymentService.getChapterTransactionsService(
        chapterId,
        rows,
        page
      );
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching chapter transactions:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getApprovedTransactionsController,
  payToChapterController,
  getPendingTransactionsController,
  approvePaymentController,
  getChapterTransactionsController,
};
