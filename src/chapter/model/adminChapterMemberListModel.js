const db = require("../../config/db");

// Function to get all members of a chapter
const getChapterMembers = async (chapterSlug, rows, page) => {
  const chapter = await db("chapters")
    .where("chapters.chapterSlug", chapterSlug)
    .select("chapterId")
    .first();

  if (!chapter) {
    throw new Error("Chapter not found!");
  }

  const chapterId = chapter.chapterId;

  const total = await db("memberchaptermapping")
    .where("chapterId", chapterId)
    .count("memberId as count")
    .first();

  const offsetValue = Math.max(0, (page - 1) * rows);

  const members = await db("memberchaptermapping")
    .join("members", "memberchaptermapping.memberId", "members.memberId")
    .where("memberchaptermapping.chapterId", chapterId)
    .select(
      "members.memberId",
      "members.firstName",
      "members.lastName",
      "members.email",
      "members.phoneNumber",
      "memberchaptermapping.balance"
    )
    .orderBy("members.firstName", "asc")
    .limit(rows)
    .offset(offsetValue);

  // Ensure it always returns an array
  return { members: members || [], total: total.count };
};




// Function to remove a member from a chapter (keeps record, adds leave date)
const removeChapterMember = async (chapterId, userId, leaveDate) => {
  return db("chapter_members")
    .where({ chapterId, userId })
    .update({ leaveDate });
};

// Function to delete a member (completely removes all data)
const deleteChapterMember = async (userId) => {
  return db.transaction(async (trx) => {
    await trx("chapter_members").where("userId", userId).del();
    await trx("users").where("userId", userId).del();
  });
};

// Function to update a member's role in a chapter
const updateMemberRole = async (chapterId, userId, newRole) => {
  return db("chapter_members")
    .where({ chapterId, userId })
    .update({ role: newRole })
    .returning("*");
};

// Function to update member balance (with optional transaction record)
const updateMemberBalance = async (userId, newBalance, addToTransaction = false) => {
  return db.transaction(async (trx) => {
    await trx("chapter_members")
      .where("userId", userId)
      .update({ balance: newBalance });

    if (addToTransaction) {
      await trx("transactions").insert({
        userId,
        amount: newBalance,
        transactionDate: new Date(),
        type: "balance_update",
      });
    }
  });
};

module.exports = {
  getChapterMembers,
  removeChapterMember,
  deleteChapterMember,
  updateMemberRole,
  updateMemberBalance,
};
