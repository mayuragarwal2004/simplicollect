// controllers/paymentControllers.js
const memberModel = require("../models/memberModel");
const paymentModel = require("../models/paymentModel");
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
    paidAmount: paymentDetails.paymentAmount,
    dueAmount: paymentDetails.dueAmount,
    status: "pending",
    statusUpdateDate: new Date(),

    // more details
    paymentType: paymentDetails.paymentType || "",
    paymentDate: new Date(paymentDetails.paymentDate) || "",
    paymentImageLink: paymentDetails.paymentImageLink || "",
    cashPaymentReceivedById: paymentDetails.cashPaymentReceivedById || "",
    cashPaymentReceivedByName: paymentDetails.cashPaymentReceivedByName || "",
    onlinePaymentReceivedById: paymentDetails.onlinePaymentReceivedById || "",
    onlinePaymentReceivedByName:
      paymentDetails.onlinePaymentReceivedByName || "",
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
  const { transactionIds } = req.body;
  try {
    const memberDetails = await memberModel.findMemberById(memberId);
    const transactionData = transactionIds.map((transactionId) => {
      return {
        approvedById: memberId,
        approvedByName: `${memberDetails.firstName} ${memberDetails.lastName}`,
        transactionId,
        status: "approved",
      };
    });

    const result = await paymentModel.approvePendingPayment(transactionData);

    // set isPaid to true in membersmeetingmapping table using transactionId
    const transactionIdsArray = transactionIds.map((transactionId) => {
      return transactionId;
    });

    const result2 = await paymentModel.setIsPaid(transactionIdsArray);
    res.json(result);
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
};
