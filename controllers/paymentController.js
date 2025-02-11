// controllers/paymentControllers.js
const paymentModel = require("../models/paymentModel");

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
  const paymentDetails = req.body;
  // make data to insert in db
  const newRecords = [];

  paymentDetails.meetingIds.forEach((meetingId) => {
    newRecords.push({
      memberId,
      meetingId,
      packageId: paymentDetails.packageId,
      payableAmount: paymentDetails.payableAmount,
      paymentAmount: paymentDetails.paymentAmount,
      paymentDate: new Date(),
      dueAmount: paymentDetails.dueAmount,
      advanceAmount: paymentDetails.advanceAmount,
      status: "pending",
      statusUpdateDate: new Date(),
    });
  });

  try {
    const result = await paymentModel.addPayment(newRecords);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const checkPendingPayments = async (req, res) => {
  const { memberId } = req.user;
  try {
    const pendingPayments = await paymentModel.getPendingPaymentsWithPackageDetails(memberId);

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
        meetingIds: pendingPayments.filter((p) => p.packageId === packageId).map((p) => p.meetingId),
        meetingId: undefined,
      })
    }

    res.json(finalResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteRequest = async (req, res) => {
  const { packageId } = req.params;
  try {
    const result = await paymentModel.deletePendingRequest(packageId);
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
};
