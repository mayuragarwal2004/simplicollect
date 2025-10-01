const db = require("../../../config/db");

const getDateWiseTransactions = async (date, chapterId) => {
    console.log({chapterId});
    
  return db("transactions")
    .where(
      "paymentDate",
      `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    )
    .andWhere("chapterId", chapterId)
    .leftJoin("members", "transactions.memberId", "members.memberId")
    .orderBy("paymentType", "asc")
    .orderBy("paymentReceivedById", "asc")
    .orderBy("paymentDate", "asc") // replace with timestamp
    .select("*");
};

module.exports = {
  getDateWiseTransactions,
};
