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
      "",
      page,
      rows
    );
    console.log({ chapterMembers });
    
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
const PDFDocument = require('pdfkit');

const getAllMemberReports = async (req, res) => {
  const { chapterId } = req.params;
  const { rows = 10, page = 0 } = req.query;
  const { startDate, endDate } = req.body;

  try {
    // Fetching transactions using the updated model
    const { transactions, totalRecords } = await paymentModel.getTransactions(
      chapterId,
      rows,
      page,
      startDate,
      endDate
    );

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found" });
    }

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    // Set headers for the response (we'll serve the PDF directly)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="member-transactions.pdf"');

    // Pipe the PDF output to the response stream
    doc.pipe(res);

    // Add Title
    doc.fontSize(16).text('Member Transactions Report', { align: 'center' });
    doc.moveDown();

    // Column headers (specific to the data selected)
    const columns = [
      'Member Name', 'Amount Paid', 'Balance', 'Package Name', 'Payment Type',
      'Collected By', 'Approved By', 'Date', 'Approval Status'
    ];

    // Set column widths (for proper table alignment)
    const columnWidths = [
      150, 60, 60, 100, 80, 100, 100, 100, 100
    ];

    // Draw the table header
    doc.fontSize(12).font('Helvetica-Bold');
    columns.forEach((header, i) => {
      doc.text(header, 20 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), 80);
    });
    doc.moveDown();

    // Draw the table rows (Transaction data)
    doc.font('Helvetica').fontSize(10);
    transactions.forEach((transaction, rowIndex) => {
      const row = [
        `${transaction.firstName} ${transaction.lastName}`, // Member Name
        transaction.paidAmount,  // Amount Paid
        transaction.balanceAmount, // Balance
        transaction.packageName,  // Package Name
        transaction.paymentType,  // Payment Type
        transaction.paymentReceivedByName,  // Collected By
        transaction.approvedByName,  // Approved By
        new Date(transaction.transactionDate).toLocaleDateString(),  // Date
        transaction.approvalStatus  // Approval Status
      ];

      row.forEach((cell, colIndex) => {
        doc.text(cell.toString(), 20 + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0), 100 + (rowIndex * 20));
      });
    });

    // Finalize the PDF (only call end after everything is done)
    doc.end();
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
const {
  getReceiverDaywiseJsonReportService,
} = require("../service/reportService");

const getReceiverDaywiseJsonReportController = async (req, res) => {
  const { date } = req.query;
  const { chapterId } = req.params;

  try {
    const reportData = await getReceiverDaywiseJsonReportService(
      chapterId,
      date ? new Date(date) : new Date()
    );

    res.json({
      success: true,
      data: reportData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error generating JSON report",
      error: err.message,
    });
  }
};

const getMemberLedgerController = async (req, res) => {
  let { memberId } = req.query;
  if (!memberId) {
    memberId = req.user.memberId;
  }
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

const getMemberLedgerJSONController = async (req, res) => {
  let { memberId } = req.query;
  if (!memberId) {
    memberId = req.user.memberId;
  }
  const { chapterId } = req.params;
  try {
    const { labelledData } = await getMemberLedgerService(memberId, chapterId);
    res.json(labelledData);
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
  getReceiverDaywiseJsonReportController,
  getMemberLedgerController,
  getMemberLedgerJSONController,
};
