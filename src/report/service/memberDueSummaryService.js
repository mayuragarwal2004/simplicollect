const memberModel = require("../../member/model/memberModel");
const packageModel = require("../../package/model/packageModel");
const meetingModel = require("../../meeting/model/meetingModel");
const {
  packageAmountCalculations,
} = require("../../utility/packageAmountCalculation");
const ExcelJS = require("exceljs");

// Service to extract member due summary data
async function extractMemberDueSummaryData(
  chapterId,
  termId,
  { page = 0, rows = 10000 } = {}
) {
  const { data: chapterMembers, totalRecords } = await memberModel.getMembers(
    chapterId,
    "",
    page,
    rows
  );
  for (let i = 0; i < chapterMembers.length; i++) {
    const member = chapterMembers[i];
    const packageData = await packageModel.getPackagesByChapterAndTerm(
      chapterId,
      termId,
      member.memberId
    );
    const meetingData =
      await meetingModel.getAllMeetingsUsingMemberIdAndChapterId(
        member.memberId,
        chapterId
      );
    for (let j = 0; j < packageData.length; j++) {
      const pkg = packageData[j];
      const calculatedResult = packageAmountCalculations(
        new Date(),
        pkg,
        meetingData,
        0
      );
      packageData[j].calculatedResult = calculatedResult;
    }
    chapterMembers[i].packageData = packageData;
  }
  return { data: chapterMembers, totalRecords };
}

// Service to convert member due summary data to Excel
async function memberDueSummaryToExcel(data, exportDate = new Date()) {
    // Group by packageParent
    const grouped = {};
    data.forEach((member) => {
        (member.packageData || []).forEach((pkg) => {
            if (!grouped[pkg.packageParent]) grouped[pkg.packageParent] = [];
            grouped[pkg.packageParent].push({ member, pkg });
        });
    });

    // Prepare sheet info: { parent, rows, packageNames, memberNames, memberMap }
    const sheets = Object.entries(grouped).map(([parent, rows]) => {
        const packageNames = Array.from(
            new Set(rows.map((r) => r.pkg.packageName))
        );
        const memberNames = Array.from(
            new Set(rows.map((r) => r.member.firstName + " " + r.member.lastName))
        );
        const memberMap = {};
        rows.forEach(({ member, pkg }) => {
            const name = member.firstName + " " + member.lastName;
            if (!memberMap[name]) memberMap[name] = {};
            let value, status;
            if (
                pkg.calculatedResult?.message === "Package has overlapping payments"
            ) {
                value = "✔️";
                status = "approved";
            } else if (!pkg.status || pkg.status === "") {
                value = pkg.calculatedResult?.totalAmount || "";
                status = "";
            } else {
                value = pkg.paidAmount || "";
                status = pkg.status;
            }
            memberMap[name][pkg.packageName] = { value, status };
        });
        return {
            parent,
            rows,
            packageNames,
            memberNames,
            memberMap,
            columnCount: packageNames.length + 1, // +1 for "Member Name"
        };
    });

    // Sort sheets by descending order of number of columns (most columns first)
    sheets.sort((a, b) => b.columnCount - a.columnCount);

    const workbook = new ExcelJS.Workbook();
    for (const sheet of sheets) {
        const { parent, packageNames, memberNames, memberMap } = sheet;
        // Prepare worksheet data
        const wsData = [
            ["Member Name", ...packageNames],
            ...memberNames.map((name) => [
                name,
                ...packageNames.map((pkgName) => memberMap[name][pkgName]?.value || ""),
            ]),
        ];
        const worksheet = workbook.addWorksheet(parent || "Unknown");
        // Add heading and date
        worksheet.addRow(["Member Due summary report"]);
        worksheet.mergeCells(1, 1, 1, wsData[0].length);
        worksheet.getRow(1).font = { bold: true, size: 16 };
        worksheet.getRow(1).alignment = { horizontal: "center" };
        worksheet.addRow([`Export Date: ${exportDate.toLocaleDateString()}`]);
        worksheet.mergeCells(2, 1, 2, wsData[0].length);
        worksheet.getRow(2).alignment = { horizontal: "center" };
        // Add table data
        wsData.forEach((row) => worksheet.addRow(row));
        // Style header
        worksheet.getRow(3).font = { bold: true };
        worksheet.getRow(3).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "D9E1F2" },
        };
        worksheet.columns.forEach((col) => {
            col.width = 20;
        });
        // Apply cell formatting based on status
        for (let i = 0; i < memberNames.length; i++) {
            const rowIdx = i + 4; // Data starts from row 4
            for (let j = 0; j < packageNames.length; j++) {
                const colIdx = j + 2; // First column is member name
                const pkgName = packageNames[j];
                const memberName = memberNames[i];
                const cell = worksheet.getRow(rowIdx).getCell(colIdx);
                const status = memberMap[memberName][pkgName]?.status;
                // Center align the cell
                cell.alignment = { horizontal: "center" };
                if (status === "approved") {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "C6EFCE" }, // light green
                    };
                    cell.font = { color: { argb: "006100" } }; // dark green
                } else if (status === "pending") {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FFF7CB" }, // light yellow
                    };
                    cell.font = { color: { argb: "9C6500" } }; // dark yellow/brown
                } else if (status === "rejected") {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FFC7CE" }, // light red
                    };
                    cell.font = { color: { argb: "9C0006" } }; // dark red
                }
            }
        }
        // Add borders: thick for headings, thin for body
        const totalRows = worksheet.rowCount;
        const totalCols = wsData[0].length;
        // Heading rows (1, 2, 3)
        for (let rowIdx = 1; rowIdx <= 3; rowIdx++) {
            const row = worksheet.getRow(rowIdx);
            for (let colIdx = 1; colIdx <= totalCols; colIdx++) {
                row.getCell(colIdx).border = {
                    top: { style: "thick" },
                    left: { style: "thick" },
                    bottom: { style: "thick" },
                    right: { style: "thick" },
                };
            }
        }
        // Body rows (from 4 to end)
        for (let rowIdx = 4; rowIdx <= totalRows; rowIdx++) {
            const row = worksheet.getRow(rowIdx);
            for (let colIdx = 1; colIdx <= totalCols; colIdx++) {
                row.getCell(colIdx).border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            }
        }
    }
    return workbook;
}

module.exports = {
  extractMemberDueSummaryData,
  memberDueSummaryToExcel,
};
