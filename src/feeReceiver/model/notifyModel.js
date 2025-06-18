const db = require("../../config/db");

const getPendingRequestsGrouped = async () => {
  return db('transactions')
    .where('status', 'pending')
    .select(
      'transactions.paymentReceivedById',
      'transactions.chapterId',
      'transactions.memberId',
      'members.firstname as memberFirstName',
      'members.lastname as memberLastName',
      'receiver.email as receiverEmail',
      'chapters.chapterName'
    )
    .leftJoin('members', 'transactions.memberId', 'members.memberId')
    .leftJoin('members as receiver', 'transactions.paymentReceivedById', 'receiver.memberId')
    .leftJoin('chapters', 'transactions.chapterId', 'chapters.chapterId');
};

module.exports = {
  getPendingRequestsGrouped,
};
