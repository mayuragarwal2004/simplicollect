// controllers/reportControllers.js
// const reportModel = require("../model/reportModel");
const memberModel = require("../../member/model/memberModel");
const packageModel = require("../../package/model/packageModel");
const meetingModel = require("../../meeting/model/meetingModel");
const paymentModel = require("../../payment/model/paymentModel");
const ExcelJS = require("exceljs");
const {
  getReceiverDaywiseReportService,
  getMemberLedgerService,
  convertMemberLedgerToExcel,
} = require("../service/reportService");
const {
  packageAmountCalculations,
} = require("../../utility/packageAmountCalculation");

const getPackageSummaryController = async (req, res) => {
  const { rows = 5, page = 0 } = req.query;
  const { chapterId } = req.params;
  try {
    const { data: chapterMembers, totalRecords } = await memberModel.getMembers(
      chapterId,
      page,
      rows
    );
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
    res.json({ data: chapterMembers, totalRecords });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
const getAllMemberReports = async (req, res) => {
  const { chapterId, rows, page } = req.query;
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
      rows,
      page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getMemberTotalAmountAndDues = async (req, res) => {
  const { chapterId, rows = 5, page = 0 } = req.query;
  try {
    const { transactionreport, totalRecords } =
      await paymentModel.getMemberFinancialSummary(chapterId, rows, page);
    if (!transactionreport || transactionreport.length === 0) {
      return res.status(404).json({ message: "No transactions found" });
    }
    res.json({
      transactionreport,
      totalRecords,
      chapterId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReceiverDaywiseReportController = async (req, res) => {
  const { date } = req.query;
  const { chapterId } = req.params;
  try {
    // 1. Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet("Daywise Report");

    worksheet = await getReceiverDaywiseReportService(
      worksheet,
      chapterId,
      date ? new Date(date) : new Date()
    );

    // 4. Set headers for download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=ReceiverDaywiseReport.xlsx"
    );

    // 5. Write the workbook to response
    await workbook.xlsx.write(res);
    res.end(); // Important to end the response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating Excel report" });
  }
};

const getMemberLedgerController = async (req, res) => {
  const { memberId } = req.query;
  const { chapterId } = req.params;
  try {
    const ledgerData = await getMemberLedgerService(memberId, chapterId);
    // convert to excel
    const workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet("Ledger Report");

    worksheet = await convertMemberLedgerToExcel(worksheet, ledgerData);

    // 4. Set headers for download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=ReceiverDaywiseReport.xlsx"
    );

    // 5. Write the workbook to response
    await workbook.xlsx.write(res);
    res.end(); // Important to end the response
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPackageSummaryController,
  getAllMemberReports,
  getMemberTotalAmountAndDues,
  getReceiverDaywiseReportController,
  getMemberLedgerController,
};
