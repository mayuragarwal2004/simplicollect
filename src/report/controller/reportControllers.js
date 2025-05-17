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
// to generate excel or pdf report
const PdfPrinter = require("pdfmake");
const moment = require("moment");

const printer = new PdfPrinter({
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
});

const columnMap = {
  "Sr. No.": (t, i) => i + 1,
  "Member Name": (t) => `${t.firstName} ${t.lastName}`,
  "Amount Paid": (t) => t.paidAmount,
  Balance: (t) => t.balanceAmount,
  "Package Name": (t) => t.packageName,
  "Payment Type": (t) => t.paymentType,
  "Collected By": (t) => t.paymentReceivedByName,
  "Approved By": (t) => t.approvedByName,
  Date: (t) => moment(t.transactionDate).format("DD/MM/YYYY"),
  "Approval Status": (t) => t.approvalStatus,
};

const fieldKeyToHeader = {
  name: "Sr. No.",
  memberName: "Member Name",
  paidAmount: "Amount Paid",
  balanceAmount: "Balance",
  packageName: "Package Name",
  paymentType: "Payment Type",
  paymentReceivedByName: "Collected By",
  approvedByName: "Approved By",
  transactionDate: "Date",
  approvalStatus: "Approval Status",
};

const getAllMemberTransactionsReportController = async (req, res) => {
  const { chapterId } = req.params;
  const { rows = 10, page = 0 } = req.query;
  const { startDate, endDate, selectedColumns, type = "pdf" } = req.body;

  try {
    const { transactions } = await paymentModel.getTransactions(
      chapterId,
      rows,
      page,
      startDate,
      endDate
    );

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found" });
    }

    const headers = selectedColumns
      .map((key) => fieldKeyToHeader[key])
      .filter((header) => header && columnMap[header]);

    const dataRows = transactions.map((t, index) =>
      headers.map((header) => columnMap[header](t, index))
    );

    if (type === "excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Transactions");

      const headerRow = worksheet.addRow(headers);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "ADD8E6" },
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      dataRows.forEach((rowData, index) => {
        const row = worksheet.addRow(rowData);
        const fillColor = index % 2 === 0 ? "FFFFFF" : "F2F2F2";
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: fillColor },
          };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      worksheet.columns.forEach((column) => {
        let maxLength = 10;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const cellLength = (cell.value || "").toString().length;
          if (cellLength > maxLength) {
            maxLength = cellLength;
          }
        });
        column.width = maxLength + 2;
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=member-transactions.xlsx"
      );

      await workbook.xlsx.write(res);
      res.end();
    } else {
      const tableBody = [headers, ...dataRows];

      const docDefinition = {
        pageOrientation: "landscape",
        pageMargins: [20, 40, 20, 40],
        content: [
          {
            table: {
              headerRows: 1,
              widths: new Array(headers.length).fill("*"),
              body: tableBody,
            },
            layout: {
              fillColor: (rowIndex) =>
                rowIndex === 0
                  ? "#ADD8E6"
                  : rowIndex % 2 === 0
                  ? "#f2f2f2"
                  : null,
              hLineWidth: () => 0.5,
              vLineWidth: () => 0.5,
              hLineColor: () => "#ccc",
              vLineColor: () => "#ccc",
            },
          },
          {
            text: "\nPowered by SimpliCollect",
            alignment: "right",
            margin: [0, 20, 20, 0],
            fontSize: 10,
            color: "#888",
          },
        ],
      };

      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="member-transactions.pdf"'
      );
      pdfDoc.pipe(res);
      pdfDoc.end();
    }
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllMemberTransactionsJSONReportController = async (req, res) => {
  const { chapterId } = req.params;
  const { rows = 10, page = 0, type = "pdf" } = req.query;
  const { startDate, endDate, selectedColumns } = req.body;

  try {
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

    return res.json({
      success: true,
      data: transactions,
      totalRecords,
    });
  } catch (error) {
    console.error("Export error:", error);
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
  getAllMemberTransactionsJSONReportController,
  getAllMemberTransactionsReportController,
  getMemberTotalAmountAndDues,
  getReceiverDaywiseReportController,
  getReceiverDaywiseJsonReportController,
  getMemberLedgerController,
  getMemberLedgerJSONController,
};
