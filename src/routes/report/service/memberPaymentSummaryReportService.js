const paymentModel = require("../../payment/model/paymentModel");
const memberModel = require("../../member/model/memberModel");
const ExcelJS = require("exceljs");
const { generatePeriods } = require("../../../utility/dateUtils");
const { format } = require("date-fns");

async function getMemberPaymentSummaryReportService({
  chapterId,
  term,
  period = "monthly",
  weekStartDay = 0,
  customStartDate,
  customEndDate,
}) {
  const termStart = new Date(customStartDate || term.startDate);
  let termEnd = new Date(customEndDate || term.endDate);
  const today = new Date();
  if (today < termEnd) termEnd = today;

  const periods = generatePeriods(period, termStart, termEnd, weekStartDay);
  const members = await memberModel.getAllMembers(chapterId);

  const matrix = [];
  let grandTotal = 0;

  for (const member of members) {
    const row = {
      memberId: member.memberId,
      name: member.label,
      amounts: [],
      total: 0,
    };

    for (const p of periods) {
      const txns = await paymentModel.getTransactionsByChapterAndDateRange(
        chapterId,
        p.start,
        p.end
      );
      const memberTxns = txns.filter((t) => t.memberId === member.memberId);
      const sum = memberTxns.reduce((acc, t) => acc + (t.paidAmount || 0), 0);
      row.amounts.push(sum);
      row.total += sum;
    }

    grandTotal += row.total;
    matrix.push(row);
  }

  return {
    period,
    periodLabels: periods.map((p) => p.label),
    periodDates: periods.map((p) => ({ start: p.start, end: p.end })), // ✨ new for frontend
    members: matrix.map((r) => ({ memberId: r.memberId, name: r.name })),
    matrix: matrix.map((r) => r.amounts),
    totals: matrix.map((r) => r.total),
    grandTotal,
  };
}

async function exportMemberPaymentSummaryExcelService(params) {
  const report = await getMemberPaymentSummaryReportService(params);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Member Payment Summary");

  // --- Title ---
  const lastColumn = 1 + report.periodLabels.length + 1;
  const endMergeColumn = String.fromCharCode(64 + lastColumn); // e.g., 'F'
  sheet.mergeCells(`A1:${endMergeColumn}1`);
  const titleCell = sheet.getCell("A1");
  titleCell.value = "Member Payment Summary Report";
  titleCell.font = { size: 16, bold: true };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  // --- Export Date ---
  const exportDateStr = format(new Date(), "dd MMM yyyy, hh:mm a");
  sheet.mergeCells(`A2:${endMergeColumn}2`);
  const dateCell = sheet.getCell("A2");
  dateCell.value = `Exported on: ${exportDateStr}`;
  dateCell.font = { italic: true, size: 10 };
  dateCell.alignment = { horizontal: "right" };

  sheet.addRow([]); // Empty row (row 3)

  // --- Header Row ---
  const header = ["Member", ...report.periodLabels, "Total"];
  const headerRow = sheet.addRow(header);
  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: "center" };
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFEDF3FE" },
    };
    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // --- Data Rows ---
  report.members.forEach((member, idx) => {
    const row = sheet.addRow([
      member.name,
      ...report.matrix[idx],
      report.totals[idx],
    ]);

    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  // --- Grand Total Row ---
  const grandRow = [
    "Grand Total",
    ...report.periodLabels.map((_, colIdx) =>
      report.matrix.reduce((sum, row) => sum + (row[colIdx] || 0), 0)
    ),
    report.grandTotal,
  ];
  const grandTotalRow = sheet.addRow(grandRow);
  grandTotalRow.font = { bold: true };
  grandTotalRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFEDEDED" },
  };
  grandTotalRow.eachCell((cell) => {
    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // --- Auto Width ---
  sheet.columns.forEach((col) => {
    let maxLen = 12;
    col.eachCell?.({ includeEmpty: true }, (cell) => {
      const len = cell.value?.toString().length || 0;
      if (len > maxLen) maxLen = len;
    });
    col.width = maxLen + 2;
  });

  return workbook;
}

module.exports = {
  getMemberPaymentSummaryReportService,
  exportMemberPaymentSummaryExcelService,
};
