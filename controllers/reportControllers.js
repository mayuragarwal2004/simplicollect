// controllers/reportControllers.js
// const reportModel = require("../models/reportModel");
const memberModel = require("../models/memberModel");
const packageModel = require("../models/packageModel");
const meetingModel = require("../models/meetingModel");
const paymentModel = require("../models/paymentModel");
const {
  packageAmountCalculations,
} = require("../utility/packageAmountCalculation");

const getPackageSummaryController = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const chapterMembers = await memberModel.getMembers(chapterId);
    for (let i = 0; i < chapterMembers.length; i++) {
      console.log(`Processing member ${i + 1}/${chapterMembers.length}`);

      const member = chapterMembers[i];
      const packageData = await packageModel.getPackagesByChapterId(
        chapterId,
        member.memberId
      );
      const meetingData =
        await meetingModel.getAllMeetingsUsingMemberIdAndChapterId(
          member.memberId,
          chapterId
        );
      //   chapterMembers[i].packageData = packageData;
      for (let j = 0; j < packageData.length; j++) {
        const package = packageData[j];

        const calculatedResult = packageAmountCalculations(
          new Date(),
          package,
          meetingData,
          0
        );
        packageData[j].calculatedResult = calculatedResult;
      }
      chapterMembers[i].packageData = packageData;
    }
    res.json(chapterMembers,row,page);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
const getAllMemberReports = async (req, res) => {
  const { chapterId, rows = 5, page = 0 } = req.query;

  if (!chapterId) {
    return res.status(400).json({ message: "Chapter ID is required" });
  }

  try {
    const { transactions, totalRecords } = await paymentModel.getTransactions(
      chapterId,
      rows,
      page
    );

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found" });
    }

    res.json({
      data: transactions,
      totalRecords,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getMemberTotalAmountAndDues = async (req, res) => {
  const { chapterId, rows = 5, page = 0 } = req.query;
  try {
    const { transactionreport, totalRecords } = await paymentModel.getMemberFinancialSummary(chapterId, rows, page);
    if (!transactionreport || transactionreport.length === 0) {
      return res.status(404).json({ message: "No transactions found" });
    }
    res.json({
      transactionreport,
      totalRecords,
      chapterId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPackageSummaryController,
  getAllMemberReports,
  getMemberTotalAmountAndDues,
};
