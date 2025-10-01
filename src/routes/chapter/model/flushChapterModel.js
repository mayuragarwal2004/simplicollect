const db = require("../../../config/db");

// Flush all transactions for a chapter
const flushChapterTransactions = async (chapterId) => {
  // Delete from transactions table
  await db("transactions").where({ chapterId }).del();
  // Delete from member_meeting_mapping table
await db("members_meeting_mapping")
    .whereIn(
        "meetingId",
        db("meetings").select("meetingId").where({ chapterId })
    )
    .del();
  return { success: true };
};

module.exports = {
  flushChapterTransactions,
};
