const db = require("../../config/db");

const getChapterTransactions = async (chapterId, rows, page) => {
  const transactions = await db("receiverChapterTransactions as r")
    .where({
      "r.chapterId": chapterId,
    })
    .orderBy("r.createdAt", "desc")
    .limit(rows)
    .offset(rows * page)
    .select("r.*");

  // total records
  const totalRecords = await db("receiverChapterTransactions as r")
    .where({
      "r.chapterId": chapterId,
    })
    .count("r.id as totalRecords")
    .first();
  return { data: transactions, totalRecords: totalRecords.totalRecords };
};

const getApprovedTransactions = async (memberId, chapterId, filter) => {
  console.log({ memberId, chapterId, filter });

  const transactions = await db("transactions as t")
    .join("members as m", "t.memberId", "m.memberId")
    .where({
      "t.paymentReceivedById": memberId,
      "t.status": "approved",
      "t.chapterId": chapterId,
      "t.paymentType": "cash",
      "t.transferedToChapterTransactionId": null,
    })
    .andWhere(function () {
      if (filter.date) {
        this.where(
          "t.transactionDate",
          `${filter.date.getFullYear()}-${
            filter.date.getMonth() + 1
          }-${filter.date.getDate()}`
        );
      } else if (filter.startDate && filter.endDate) {
        this.whereBetween("t.transactionDate", [
          filter.startDate,
          filter.endDate,
        ]);
      }
    })
    .select("t.*", "m.firstName", "m.lastName", "m.email", "m.phoneNumber");
  return transactions;
};

{
  /* CREATE TABLE
      receiverChapterTransactions (
          id VARCHAR(255) PRIMARY KEY,
          chapterId VARCHAR(255) NOT NULL,
          senderId VARCHAR(255) NOT NULL,
          senderName VARCHAR(255) NOT NULL,
          approvedById VARCHAR(255) DEFAULT NULL,
          approvedByName VARCHAR(255) DEFAULT NULL,
          payableAmount DECIMAL(10, 2) NOT NULL,
          transferredAmount DECIMAL(10, 2) NOT NULL,
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (chapterId) REFERENCES chapters (chapterId),
          FOREIGN KEY (senderId) REFERENCES members (memberId),
          FOREIGN KEY (approvedById) REFERENCES members (memberId)
      );
  */
}

const payToChapter = async (data, trx) => {
  {
    /*
      data = {
        chapterId: "1",
        senderId: "ergioheohjgbiehjgbdl",
        senderName: "John Doe",
        payableAmount: 1000,
        transferredAmount: 1000
      }
    */
  }
  return await db("receiverChapterTransactions").transacting(trx).insert(data);
};

const updateTransactionsTransferToChapter = async (
  transactionIds,
  transferId,
  trx
) => {
  {
    /*
      transactionIds = ["ergioheohjgbiehjgbdl", "ergioheohjgbiehjgbdl"]
      transferId = "ergioheohjgbiehjgbdl"
    */
  }
  console.log({ transactionIds });

  return await db("transactions")
    .transacting(trx)
    .whereIn("transactionId", transactionIds)
    .update({ transferedToChapterTransactionId: transferId });
};

const getPendingChapterTransactions = async (memberId, chapterId) => {
  console.log({ memberId, chapterId });

  const transactions = await db("receiverChapterTransactions as r")
    .where({
      "r.status": "pending",
      "r.chapterId": chapterId,
    })
    .select("r.*");
  return transactions;
};

const approvePendingRequest = async (
  transactionid,
  approvedById,
  approvedByName
) => {
  return db("receiverChapterTransactions")
    .where({ id: transactionid })
    .update({ status: "approved", approvedById, approvedByName });
};

module.exports = {
  getChapterTransactions,
  getApprovedTransactions,
  payToChapter,
  updateTransactionsTransferToChapter,
  getPendingChapterTransactions,
  approvePendingRequest,
};
