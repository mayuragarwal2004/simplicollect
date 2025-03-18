// controllers/paymentControllers.js
const db = require("../../config/db");
const memberModel = require("../../member/model/memberModel");
const paymentModel = require("../model/paymentModel");
const { v4: uuidv4 } = require("uuid");

paymentDetails = {
  packageId: "1",
  amount: "1000",
  meetingIds: ["1", "2"],
  due: "200",
  advance: "800",
};

// -- Create membersmeetingmapping table
// CREATE TABLE simplicollect.membersmeetingmapping (
//   memberId VARCHAR(255) NOT NULL,
//   meetingId VARCHAR(255) NOT NULL,
//   packageId VARCHAR(255),
//   notToPay BOOLEAN DEFAULT FALSE,
//   notToPayReason TEXT,
//   isPaid BOOLEAN DEFAULT FALSE,
//   payableAmount BIGINT,
//   paymentAmount BIGINT,
//   paymentDate DATE,
//   dueAmount BIGINT,
//   advanceAmount BIGINT,
//   status VARCHAR(255),
//   statusUpdateDate DATE,
//   FOREIGN KEY (memberId) REFERENCES members(memberId) ON DELETE CASCADE,
//   FOREIGN KEY (meetingId) REFERENCES meetings(meetingId) ON DELETE CASCADE,
//   FOREIGN KEY (packageId) REFERENCES packages(packageId) ON DELETE CASCADE
// ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

const addPayment = async (req, res) => {
  const { memberId } = req.user;
  console.log({ check: req.user });

  const paymentDetails = req.body;

  const transactionTableData = {
    transactionId: uuidv4(),
    memberId,
    packageId: paymentDetails.packageId,
    transactionDate: new Date(),
    payableAmount: paymentDetails.payableAmount,
    dueAmount: paymentDetails.dueAmount,
    status: "pending",
    statusUpdateDate: new Date(),

    payableAmount: paymentDetails.payableAmount || 0,
    paidAmount: paymentDetails.paidAmount || 0,
    originalPayableAmount: paymentDetails.originalPayableAmount || 0,
    discountAmount: paymentDetails.discountAmount || 0,
    penaltyAmount: paymentDetails.penaltyAmount || 0,
    receiverFee: paymentDetails.receiverFee || 0,
    amountPaidToChapter: paymentDetails.amountPaidToChapter || 0,
    amountExpectedToChapter: paymentDetails.amountExpectedToChapter || 0,
    platformFee: paymentDetails.platformFee || 0,
    balanceAmount: paymentDetails.balanceAmount || 0,

    // more details
    paymentType: paymentDetails.paymentType || "",
    paymentDate: paymentDetails.paymentDate
      ? new Date(paymentDetails.paymentDate)
      : new Date(),
    paymentImageLink: paymentDetails.paymentImageLink || "",
    paymentReceivedById: paymentDetails.paymentReceivedById || "",
    paymentReceivedByName: paymentDetails.paymentReceivedByName || "",
  };
  // make data to insert in db table of membersmeetingmapping
  const newRecords = [];

  if (typeof paymentDetails.meetingIds === "string") {
    paymentDetails.meetingIds = JSON.parse(paymentDetails.meetingIds);
  }

  paymentDetails.meetingIds.forEach((meetingId) => {
    newRecords.push({
      memberId,
      meetingId,
      transactionId: transactionTableData.transactionId,
    });
  });

  try {
    const result1 = await paymentModel.addTransaction(transactionTableData);
    const result = await paymentModel.addPayment(newRecords);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const chapterPendingPayments = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const pendingPayments = await paymentModel.getChapterPendingPayments(
      chapterId
    );
    res.json(pendingPayments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const checkPendingPayments = async (req, res) => {
  const { memberId } = req.user;
  try {
    const pendingPayments =
      await paymentModel.getMembersPendingPaymentsWithPackageDetails(memberId);

    const finalResponse = [];
    const packageIds = [];
    // group by packageId
    for (let i = 0; i < pendingPayments.length; i++) {
      const paymentData = pendingPayments[i];

      if (packageIds.includes(paymentData.packageId)) {
        continue;
      }

      const packageId = paymentData.packageId;
      packageIds.push(packageId);

      finalResponse.push({
        ...paymentData,
        meetingIds: pendingPayments
          .filter((p) => p.packageId === packageId)
          .map((p) => p.meetingId),
        meetingId: undefined,
      });
    }

    res.json(finalResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteRequest = async (req, res) => {
  const { memberId } = req.user;
  const { transactionId } = req.params;
  try {
    let transaction = await paymentModel.getTransactionById(transactionId);
    transaction = transaction[0];

    if (transaction.memberId !== memberId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this request" });
    }

    if (transaction.status !== "pending") {
      return res
        .status(400)
        .json({ error: "Transaction is already processed" });
    }
    const result = await paymentModel.deletePendingRequest(
      memberId,
      transactionId
    );
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const approvePendingPaymentController = async (req, res) => {
  const { memberId } = req.user;
  const { transactionDetails } = req.body;

  try {
    await db.transaction(async (trx) => {
      const memberDetails = await memberModel.findMemberById(memberId);

      const transactionData = transactionDetails.map((element) => ({
        approvedById: memberId,
        approvedByName: `${memberDetails.firstName} ${memberDetails.lastName}`,
        transactionId: element.transactionId,
        status: "approved",
      }));

      // Step 1: Approve Payments
      await paymentModel.approvePendingPayment(transactionData, trx);

      // Step 2: Set isPaid to true
      const transactionIdsArray = transactionDetails.map(
        (t) => t.transactionId
      );
      await paymentModel.setIsPaid(transactionIdsArray, trx);

      // Step 3: Add Dues
      const dueList = transactionDetails.map((transaction) => ({
        memberId: transaction.memberId,
        chapterId: transaction.chapterId,
        due: transaction.dueAmount,
      }));
      await paymentModel.updateDue(dueList, trx);

      // If all succeeds, transaction commits automatically
      res.json({ success: true });
    });
  } catch (error) {
    console.error("Transaction Failed:", error);
    res
      .status(500)
      .json({ error: "Transaction Failed", details: error.message });
  }
};

const getPaymentRequestsController = async (req, res) => {
  const { memberId } = req.user;
  const { chapterId } = req.params;
  const { status, currentState } = req.body;

  try {
    const getAllRequests = currentState === "all_members_approval";
    const pendingPayments = await paymentModel.getPaymentRequests(
      memberId,
      chapterId,
      getAllRequests,
      status
    );
    res.json(pendingPayments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getMemberChapterDueController = async (req, res) => {
  const { memberId } = req.user;
  const { chapterId } = req.params;

  try {
    const dues = await paymentModel.getMemberChapterDue(memberId, chapterId);
    res.json(dues);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addPayment,
  checkPendingPayments,
  deleteRequest,
  chapterPendingPayments,
  approvePendingPaymentController,
  getPaymentRequestsController,
  getMemberChapterDueController,
};
