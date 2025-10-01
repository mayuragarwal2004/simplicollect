const termModel = require("../../term/model/termModel");
const {
  exportMemberPaymentSummaryExcelService,
  getMemberPaymentSummaryReportService,
} = require("../service/memberPaymentSummaryReportService");

const getMemberPaymentSummaryReportController = async (req, res) => {
  const { chapterId } = req.params;
  const {
    termId,
    period = "monthly",
    weekStartDay = 0,
    startDate,
    endDate,
  } = req.query;

  if (!termId && (!startDate || !endDate)) {
    return res.status(400).json({
      error: "Either termId or both startDate and endDate are required.",
    });
  }

  try {
    const term = termId
      ? await termModel.getTermById(termId)
      : { startDate, endDate };

    const reportData = await getMemberPaymentSummaryReportService({
      chapterId,
      term,
      period,
      weekStartDay: parseInt(weekStartDay),
      customStartDate: startDate,
      customEndDate: endDate,
    });

    res.json(reportData);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: error.message });
  }
};

const exportMemberPaymentSummaryExcelController = async (req, res) => {
  const { chapterId } = req.params;
  const {
    termId,
    period = "monthly",
    weekStartDay = 0,
    startDate,
    endDate,
  } = req.query;

  if (!termId && (!startDate || !endDate)) {
    return res.status(400).json({
      error: "Either termId or both startDate and endDate are required.",
    });
  }

  try {
    const term = termId
      ? await termModel.getTermById(termId)
      : { startDate, endDate };

    const workbook = await exportMemberPaymentSummaryExcelService({
      chapterId,
      term,
      period,
      weekStartDay: parseInt(weekStartDay),
      customStartDate: startDate,
      customEndDate: endDate,
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=member_payment_summary.xlsx"
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Excel export error:", error);
    res.status(500).json({ error: "Failed to export Excel." });
  }
};

module.exports = {
  exportMemberPaymentSummaryExcelController,
  getMemberPaymentSummaryReportController,
};
