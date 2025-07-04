// controllers/paymentControllers.js
const db = require("../../config/db");
const memberModel = require("../../member/model/memberModel");
const paymentModel = require("../model/paymentModel");
const paymentService = require("../service/paymentService");
const { v4: uuidv4 } = require("uuid");

const addPayment = async (req, res) => {
  let {memberId} = req.body;
  if (!memberId) {
    memberId = req.user.memberId;
  }
  console.log({ check: req.user });

  const paymentDetails = req.body;

  const transactionTableData = {
    transactionId: uuidv4(),
    memberId,
    chapterId: paymentDetails.chapterId,
    packageId: paymentDetails.packageId,
    transactionDate: new Date(),
    transactionType: paymentDetails.transactionType || "Package Payment",
    payableAmount: paymentDetails.payableAmount,
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
  // make data to insert in db table of members_meeting_mapping
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
  let { memberId } = req.query;
  if (!memberId) {
    memberId = req.user.memberId;
  }
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

    // if (transaction.memberId !== memberId) {
    //   return res
    //     .status(403)
    //     .json({ error: "You are not authorized to delete this request" });
    // }

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
      const balanceList = transactionDetails.map((transaction) => ({
        memberId: transaction.memberId,
        chapterId: transaction.chapterId,
        balance: transaction.balanceAmount,
      }));
      await paymentModel.updateBalance(balanceList, trx);

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

const getMemberChapterBalancesController = async (req, res) => {
  let { memberId } = req.query;
  if (!memberId) {
    memberId = req.user.memberId;
  }
  const { chapterId } = req.params;

  try {
    const balances = await paymentModel.getMemberChapterDue(
      memberId,
      chapterId
    );
    res.json(balances);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getMetaDataController = async (req, res) => {
  const { memberId } = req.user;
  const { chapterId } = req.params;

  try {
    const metaData = await paymentService.getMetaDataService(
      memberId,
      chapterId
    );
    res.json(metaData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const moveApprovedToPendingController = async (req, res) => {
  const { memberId } = req.user;
  const { transactionDetails } = req.body;
  try {
    await db.transaction(async (trx) => {
      // Step 1: Move to Pending
      await paymentModel.moveApprovedToPending(transactionDetails, trx);
      // Step 2: Set isPaid to false
      const transactionIdsArray = transactionDetails.map((t) => t.transactionId);
      await Promise.all(transactionIdsArray.map((transactionId) =>
        trx("members_meeting_mapping").where({ transactionId }).update({ isPaid: false })
      ));
      // Step 3: Optionally update balances if needed (not implemented here)
      res.json({ success: true });
    });
  } catch (error) {
    console.error("Transaction Failed:", error);
    res.status(500).json({ error: "Transaction Failed", details: error.message });
  }
};

// Save edited fee details without changing status
const saveEditedFeeDetailsController = async (req, res) => {
  const { transactionId, updateFields } = req.body;
  const { user } = req;
  if (!transactionId || !updateFields || typeof updateFields !== 'object') {
    return res.status(400).json({ message: 'transactionId and updateFields are required.' });
  }
  // Remove status if present in updateFields to prevent status change
  if ('status' in updateFields) delete updateFields.status;
  // Pass editor info for systemRemarks
  const editorInfo = {
    userName: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user?.name || 'Unknown'),
    userId: user?.memberId || user?.id || 'Unknown',
  };
  await paymentModel.saveEditedFeeDetails([
    { transactionId, ...updateFields }
  ], editorInfo);
  res.status(200).json({ message: 'Fee details updated successfully.' });
};

module.exports = {
  addPayment,
  checkPendingPayments,
  deleteRequest,
  chapterPendingPayments,
  approvePendingPaymentController,
  getPaymentRequestsController,
  getMemberChapterBalancesController,
  getMetaDataController,
  moveApprovedToPendingController,
  saveEditedFeeDetailsController, // <-- export new controller
};
