const { getDateWiseTransactions } = require("../model/reportModel");

const getReceiverDaywiseReportService = async (
  worksheet,
  chapterId,
  date = new Date()
) => {
  try {
    const transactions = await getDateWiseTransactions(date, chapterId);
    console.log({ transactions });
    console.log({ date });

    worksheet.columns = [
      { width: 5 },
      { width: 15 },
      { width: 25 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
    ];

    worksheet.addRow(["Meeting Day Chapter collection report"]);
    worksheet.mergeCells("A1:J1");
    const headingRow = worksheet.getRow(1);
    headingRow.font = { bold: true, size: 16 };
    headingRow.alignment = { horizontal: "center", vertical: "middle" };
    headingRow.height = 25;

    worksheet.addRow([
      "",
      "Date:",
      `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
      "",
      "No. of transactions:",
      transactions.length,
    ]);

    const AddTableHeading = () => {
      const heading = worksheet.addRow([
        "Sr No",
        "Receiver Name",
        "Member Name",
        "Payment Type",
        "Paid Amount",
        "Receiver Fee",
        "Platform Fee",
        "Penalty Amount",
        "Discount Amount",
        "Status",
      ]);
      heading.font = { bold: true };
      heading.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: "medium" },
          left: { style: "thin" },
          bottom: { style: "medium" },
          right: { style: colNumber === 1 ? "medium" : "thin" },
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "D9D9D9" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });
    };

    const applyBorders = (row) => {
      row.eachCell((cell, colNumber) => {
        // Default thin border for all sides
        let border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        // If it's the first cell, make the RIGHT border medium
        if (colNumber === 1) {
          border.right = { style: "medium" };
        }

        cell.border = border;
      });
    };

    const highlightTotalRow = (row) => {
      row.eachCell({ includeEmpty: false }, (cell) => {
        cell.font = { bold: true };
        // cell.fill = {
        //   type: "pattern",
        //   pattern: "solid",
        //   fgColor: { argb: "D9D9D9" }, // Yellow highlight
        // };
        cell.border = {
          top: { style: "medium" },
          left: { style: "thin" },
          bottom: { style: "medium" },
          right: { style: "thin" },
        };
      });
    };

    let lastReceiverId = "";
    let lastPaymentType = "";
    let totalAmount = {
      amountPaidTotal: 0,
      receiverFeeTotal: 0,
      platformFeeTotal: 0,
      penaltyAmountTotal: 0,
      discountAmountTotal: 0,
    };
    let grandTotal = {
      amountPaidGrandTotal: 0,
      receiverFeeGrandTotal: 0,
      platformFeeGrandTotal: 0,
      penaltyAmountGrandTotal: 0,
      discountAmountGrandTotal: 0,
      cashGrandTotal: 0,
      onlineGrandTotal: 0,
    };
    let cashGrandTotal = {
      amountPaidCash: 0,
      receiverFeeCash: 0,
      platformFeeCash: 0,
      penaltyAmountCash: 0,
      discountAmountCash: 0,
    };
    let onlineGrandTotal = {
      amountPaidOnline: 0,
      receiverFeeOnline: 0,
      platformFeeOnline: 0,
      penaltyAmountOnline: 0,
      discountAmountOnline: 0,
    };
    let srno = 1;
    let receiverCount = 1;

    const addDataRow = (srno, transaction) => {
      const dataRow = worksheet.addRow([
        srno,
        transaction.paymentReceivedByName,
        `${transaction.firstName} ${transaction.lastName}`,
        transaction.paymentType,
        transaction.paidAmount,
        transaction.receiverFee,
        transaction.platformFee,
        transaction.penaltyAmount,
        transaction.discountAmount,
        transaction.status,
      ]);
      applyBorders(dataRow);
    };

    const addTotalRow = () => {
      const totalRow = worksheet.addRow([
        "",
        "",
        "Total:",
        "",
        totalAmount.amountPaidTotal,
        totalAmount.receiverFeeTotal,
        totalAmount.platformFeeTotal,
        totalAmount.penaltyAmountTotal,
        totalAmount.discountAmountTotal,
        "",
      ]);
      highlightTotalRow(totalRow);
      worksheet.addRow([""]);
    };

    const updateTotalAmount = (transaction) => {
      totalAmount.amountPaidTotal += transaction.paidAmount;
      totalAmount.receiverFeeTotal += transaction.receiverFee;
      totalAmount.platformFeeTotal += transaction.platformFee;
      totalAmount.penaltyAmountTotal += transaction.penaltyAmount;
      totalAmount.discountAmountTotal += transaction.discountAmount;
    };

    const updateGrandTotal = () => {
      grandTotal.amountPaidGrandTotal += totalAmount.amountPaidTotal;
      grandTotal.receiverFeeGrandTotal += totalAmount.receiverFeeTotal;
      grandTotal.platformFeeGrandTotal += totalAmount.platformFeeTotal;
      grandTotal.penaltyAmountGrandTotal += totalAmount.penaltyAmountTotal;
      grandTotal.discountAmountGrandTotal += totalAmount.discountAmountTotal;
    };

    const updatePaymentTypeGrandTotal = (transaction) => {
      if (transaction.paymentType === "cash") {
        cashGrandTotal.amountPaidCash += transaction.paidAmount;
        cashGrandTotal.receiverFeeCash += transaction.receiverFee;
        cashGrandTotal.platformFeeCash += transaction.platformFee;
        cashGrandTotal.penaltyAmountCash += transaction.penaltyAmount;
        cashGrandTotal.discountAmountCash += transaction.discountAmount;
      } else {
        onlineGrandTotal.amountPaidOnline += transaction.paidAmount;
        onlineGrandTotal.receiverFeeOnline += transaction.receiverFee;
        onlineGrandTotal.platformFeeOnline += transaction.platformFee;
        onlineGrandTotal.penaltyAmountOnline += transaction.penaltyAmount;
        onlineGrandTotal.discountAmountOnline += transaction.discountAmount;
      }
    };

    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];

      if (
        (lastReceiverId === transaction.paymentReceivedById ||
          lastReceiverId === "") &&
        (lastPaymentType === transaction.paymentType || lastPaymentType === "")
      ) {
        if (lastReceiverId === "" || lastPaymentType === "") AddTableHeading();

        addDataRow(srno, transaction);
        updatePaymentTypeGrandTotal(transaction);
        updateTotalAmount(transaction);
        srno++;
      } else {
        addTotalRow();
        worksheet.addRow([""]);

        updateGrandTotal();

        totalAmount = {
          amountPaidTotal: 0,
          receiverFeeTotal: 0,
          platformFeeTotal: 0,
          penaltyAmountTotal: 0,
          discountAmountTotal: 0,
        };
        receiverCount++;
        AddTableHeading();
        addDataRow(srno, transaction);
        srno++;
        updateTotalAmount(transaction);
        updatePaymentTypeGrandTotal(transaction);
      }
      lastPaymentType = transaction.paymentType;
      lastReceiverId = transaction.paymentReceivedById;
    }

    addTotalRow();
    worksheet.addRow([""]);
    updateGrandTotal();

    const cashTotalRow = worksheet.addRow([
      "",
      "",
      "Cash Total:",
      "",
      cashGrandTotal.amountPaidCash,
      cashGrandTotal.receiverFeeCash,
      cashGrandTotal.platformFeeCash,
      cashGrandTotal.penaltyAmountCash,
      cashGrandTotal.discountAmountCash,
      "",
    ]);
    highlightTotalRow(cashTotalRow);

    const onlineTotalRow = worksheet.addRow([
      "",
      "",
      "Online Total:",
      "",
      onlineGrandTotal.amountPaidOnline,
      onlineGrandTotal.receiverFeeOnline,
      onlineGrandTotal.platformFeeOnline,
      onlineGrandTotal.penaltyAmountOnline,
      onlineGrandTotal.discountAmountOnline,
      "",
    ]);
    highlightTotalRow(onlineTotalRow);

    const grandTotalRow = worksheet.addRow([
      "",
      "",
      "Grand Total:",
      "",
      grandTotal.amountPaidGrandTotal,
      grandTotal.receiverFeeGrandTotal,
      grandTotal.platformFeeGrandTotal,
      grandTotal.penaltyAmountGrandTotal,
      grandTotal.discountAmountGrandTotal,
      "",
    ]);
    highlightTotalRow(grandTotalRow);

    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      console.log(
        `${transaction.paymentReceivedByName} Received ${transaction.paidAmount} from ${transaction.firstName} ${transaction.lastName}`
      );
    }

    return worksheet;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getReceiverDaywiseReportService,
};
