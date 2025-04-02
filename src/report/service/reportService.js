const { getDateWiseTransactions } = require("../model/reportModel");
const memberModel = require("../../member/model/memberModel");
const packageModel = require("../../package/model/packageModel");
const meetingModel = require("../../meeting/model/meetingModel");
const paymentModel = require("../../payment/model/paymentModel");
const { highlightTableDataRow, highlightTableHeadingRow } = require("../../utility/excelExport");

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

const getReceiverDaywiseJsonReportService = async (chapterId, date) => {
  const transactions = await getDateWiseTransactions(date, chapterId);
  
  // Group transactions by receiver and payment type
  const result = [];
  let currentGroup = null;
  let lastReceiverId = "";
  let lastPaymentType = "";

  // Initialize totals
  const totals = {
    cash: {
      amountPaid: 0,
      receiverFee: 0,
      platformFee: 0,
      penaltyAmount: 0,
      discountAmount: 0
    },
    online: {
      amountPaid: 0,
      receiverFee: 0,
      platformFee: 0,
      penaltyAmount: 0,
      discountAmount: 0
    },
    grand: {
      amountPaid: 0,
      receiverFee: 0,
      platformFee: 0,
      penaltyAmount: 0,
      discountAmount: 0
    }
  };

  transactions.forEach((transaction, index) => {
    // Check if we need a new group
    if (lastReceiverId !== transaction.paymentReceivedById || 
        lastPaymentType !== transaction.paymentType) {
      
      // Push previous group if exists
      if (currentGroup) {
        // Add subtotals to the group
        currentGroup.totals = {
          amountPaid: currentGroup.data.reduce((sum, t) => sum + t.paidAmount, 0),
          receiverFee: currentGroup.data.reduce((sum, t) => sum + t.receiverFee, 0),
          platformFee: currentGroup.data.reduce((sum, t) => sum + t.platformFee, 0),
          penaltyAmount: currentGroup.data.reduce((sum, t) => sum + t.penaltyAmount, 0),
          discountAmount: currentGroup.data.reduce((sum, t) => sum + t.discountAmount, 0)
        };
        result.push(currentGroup);
      }
      
      // Create new group
      currentGroup = {
        receiverName: transaction.paymentReceivedByName,
        paymentReceivedById: transaction.paymentReceivedById,
        paymentType: transaction.paymentType,
        data: []
      };
      
      lastReceiverId = transaction.paymentReceivedById;
      lastPaymentType = transaction.paymentType;
    }
    
    // Add transaction to current group
    const transactionData = {
      membername: `${transaction.firstName} ${transaction.lastName}`,
      memberid: transaction.memberId,
      paymentType: transaction.paymentType,
      paidAmount: transaction.paidAmount, 
      receiverFee: transaction.receiverFee,
      platformFee: transaction.platformFee,
      penaltyAmount: transaction.penaltyAmount,
      discountAmount: transaction.discountAmount,
      status: transaction.status
    };
    
    currentGroup.data.push(transactionData);
    
    // Update totals
    if (transaction.paymentType === 'cash') {
      totals.cash.amountPaid += transaction.paidAmount;
      totals.cash.receiverFee += transaction.receiverFee;
      totals.cash.platformFee += transaction.platformFee;
      totals.cash.penaltyAmount += transaction.penaltyAmount;
      totals.cash.discountAmount += transaction.discountAmount;
    } else {
      totals.online.amountPaid += transaction.paidAmount;
      totals.online.receiverFee += transaction.receiverFee;
      totals.online.platformFee += transaction.platformFee;
      totals.online.penaltyAmount += transaction.penaltyAmount;
      totals.online.discountAmount += transaction.discountAmount;
    }
    
    totals.grand.amountPaid += transaction.paidAmount;
    totals.grand.receiverFee += transaction.receiverFee;
    totals.grand.platformFee += transaction.platformFee;
    totals.grand.penaltyAmount += transaction.penaltyAmount;
    totals.grand.discountAmount += transaction.discountAmount;
  });
  
  // Push the last group
  if (currentGroup) {
    currentGroup.totals = {
      amountPaid: currentGroup.data.reduce((sum, t) => sum + t.paidAmount, 0),
      receiverFee: currentGroup.data.reduce((sum, t) => sum + t.receiverFee, 0),
      platformFee: currentGroup.data.reduce((sum, t) => sum + t.platformFee, 0),
      penaltyAmount: currentGroup.data.reduce((sum, t) => sum + t.penaltyAmount, 0),
      discountAmount: currentGroup.data.reduce((sum, t) => sum + t.discountAmount, 0)
    };
    result.push(currentGroup);
  }
  
  return {
    date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
    transactionCount: transactions.length,
    transactions: result,
    totals: {
      cash: totals.cash,
      online: totals.online,
      grand: totals.grand
    }
  };
};

const getMemberLedgerService = async (memberId, chapterId) => {
  const member = await memberModel.findMemberById(memberId, chapterId);
  const memberPackages = await packageModel.getPackagesByChapterId(
    chapterId,
    memberId
  );
  const memberMeetings =
    await meetingModel.getAllMeetingsUsingMemberIdAndChapterId(
      memberId,
      chapterId
    );
  const memberTransactions = await paymentModel.getTransactionsByMemberId(
    memberId,
    chapterId
  );

  const memberLedger = {
    member,
    memberPackages,
    memberMeetings,
    memberTransactions,
  };

  // 1st find if there is a transaction and too the oldest one with transactionType as 'Balance Update'
  // 2nd then loop through transactions and add it one by one in the following procedure:
  // 2.1 if there is any amount in originalPayableAmount add it as "package charges" and add it in debit column
  // 2.2 if there is any penalty add it as "Penalty" and add it in debit column
  // 2.3 if there is any discount add it as "Discount" and add it in the credit column
  // 2.4 if there is any receiverFee add it as "Online Fee" and add it in the debit column
  // 2.5 if there is and platformFee add it as "Platform Fee" and add it in the debit column
  // 2.6 then add the paidAmount as "Package Paid" in the credit column
  // Step 2 ended - make sure to update the latest balanceAmount at each time

  const columns = ["Date", "Type", "Description", "Debit", "Credit", "Balance"];
  const ledger = [];

  let balance = 0;

  console.log({ memberTransactions });

  for (let i = 0; i < memberLedger.memberTransactions.length; i++) {
    const transaction = memberLedger.memberTransactions[i];
    if (transaction.transactionType === "Balance Update") {
      memberLedger.balance = transaction.balanceAmount;
      balance = transaction.balanceAmount;
      ledger.push([
        transaction.transactionDate,
        "Balance Update",
        "Balance Update",
        "",
        "",
        transaction.balanceAmount,
      ]);
    } else if (transaction.transactionType === "Package Payment") {
      if (transaction.originalPayableAmount) {
        balance += transaction.originalPayableAmount;
        ledger.push([
          transaction.transactionDate,
          "Package Charges",
          "Package Charges",
          transaction.originalPayableAmount,
          "",
          balance,
        ]);
      }
      if (transaction.penaltyAmount) {
        balance += transaction.penaltyAmount;
        ledger.push([
          transaction.transactionDate,
          "Penalty",
          "Penalty",
          transaction.penaltyAmount,
          "",
          balance,
        ]);
      }
      if (transaction.discountAmount) {
        balance -= transaction.discountAmount;
        ledger.push([
          transaction.transactionDate,
          "Discount",
          "Discount",
          "",
          transaction.discountAmount,
          balance,
        ]);
      }
      if (transaction.receiverFee) {
        balance += transaction.receiverFee;
        ledger.push([
          transaction.transactionDate,
          "Online Fee",
          "Online Fee",
          transaction.receiverFee,
          "",
          balance,
        ]);
      }
      if (transaction.platformFee) {
        balance += transaction.platformFee;
        ledger.push([
          transaction.transactionDate,
          "Platform Fee",
          "Platform Fee",
          transaction.platformFee,
          "",
          balance,
        ]);
      }
      balance -= transaction.paidAmount;
      ledger.push([
        transaction.transactionDate,
        "Package Paid",
        "Package Paid",
        "",
        transaction.paidAmount,
        balance,
      ]);
    }
  }

  memberLedger.data = ledger;

  return memberLedger;
};

const convertMemberLedgerToExcel = (worksheet, memberLedger) => {
  worksheet.columns = [
    { width: 15 },
    { width: 15 },
    { width: 25 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
  ];
  worksheet.addRow(["Member Ledger"]);
  worksheet.mergeCells("A1:F1");
  const headingRow = worksheet.getRow(1);
  headingRow.font = { bold: true, size: 16 };
  headingRow.alignment = { horizontal: "center", vertical: "middle" };
  headingRow.height = 25;
  worksheet.addRow(["Export Date-Time:", new Date().toLocaleString()]);
  worksheet.addRow([
    "Member Name:",
    `${memberLedger.member.firstName} ${memberLedger.member.lastName}`,
  ]);
  if (memberLedger.member.email)
    worksheet.addRow(["Member Email:", memberLedger.member.email]);
  if (memberLedger.member.phoneNumber)
    worksheet.addRow(["Member Phone:", memberLedger.member.phoneNumber]);
  worksheet.mergeCells("A6:F6");
  const packageHeadingRow = worksheet.getRow(6);
  packageHeadingRow.font = { bold: true };
  packageHeadingRow.alignment = { horizontal: "center", vertical: "middle" };
  packageHeadingRow.height = 25;
  highlightTableHeadingRow(
    worksheet.addRow([
      "Date",
      "Type",
      "Description",
      "Debit",
      "Credit",
      "Balance",
    ])
  );
  for (let i = 0; i < memberLedger.data.length; i++) {
    highlightTableDataRow(worksheet.addRow(memberLedger.data[i]));
  }
  return worksheet;
};



module.exports = {
  getReceiverDaywiseReportService,
  getMemberLedgerService,
  convertMemberLedgerToExcel,
  getReceiverDaywiseReportService, 
  getReceiverDaywiseJsonReportService // new JSON service
};