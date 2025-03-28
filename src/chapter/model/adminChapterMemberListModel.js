const db = require("../../config/db");

const getChapterMembers = async (chapterSlug, rows, page) => {
  const chapter = await db("chapters")
    .where("chapters.chapterSlug", chapterSlug)
    .select("chapterId")
    .first();

  if (!chapter) {
    throw new Error("Chapter not found!");
  }

  const chapterId = chapter.chapterId;

  const total = await db("member_chapter_mapping")
    .where("chapterId", chapterId)
    .andWhere("status", "joined")
    .count("memberId as count")
    .first();

  const offsetValue = Math.max(0, (page - 1) * rows);

  const members = await db("member_chapter_mapping")
    .join("members", "member_chapter_mapping.memberId", "members.memberId")
    .where("member_chapter_mapping.chapterId", chapterId)
    .andWhere("member_chapter_mapping.status", "joined") 
    .select(
      "members.memberId",
      "members.firstName",
      "members.lastName",
      "members.email",
      "members.phoneNumber",
      "member_chapter_mapping.balance"
    )
    .orderBy("members.firstName", "asc")
    .limit(rows)
    .offset(offsetValue);

  return { members: members || [], total: total.count };
};




// Function to remove a member from a chapter (keeps record, adds leave date)
const removeChapterMember = async (chapterSlug, memberId, leaveDate) => {
  // Get chapterId from chapterSlug
  const chapter = await db("chapters")
    .select("chapterId")
    .where({ chapterSlug: chapterSlug })
    .first();

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  const removedMember = await db("member_chapter_mapping")
    .where({ 
      chapterId: chapter.chapterId, 
      memberId: memberId,
      status: "joined" 
    })
    .update({
      leaveDate: leaveDate,
      status: "left",
    });

  if (removedMember === 0) {
    throw new Error("Member not found in this chapter or already left");
  }

  return { memberId, chapterId: chapter.chapterId, status: "left", leaveDate };
};

const deleteChapterMember = async (chapterSlug,memberId) => {
  const chapter = await db("chapters")
    .select("chapterId")
    .where({ chapterSlug })
    .first();

  if (!chapter) {
    throw new Error(`Chapter '${chapterSlug}' does not exist`);
  }

  const member = await db("members")
    .select("memberId")
    .where({ memberId })
    .first();

  if (!member) {
    throw new Error(`Member ID '${memberId}' does not exist`);
  }

  await db("member_chapter_mapping")
    .where({ chapterId:chapter.chapterId, memberId })
    .del();

  await db("members")
    .where({ memberId })
    .del();
  return member;
};

// Function to update a member's role in a chapter
const updateMemberRole = async (chapterSlug, userId, newRole) => {
    const role = await db("roles")
        .select("roleId")
        .where({ roleName: newRole })
        .first();

    if (!role) {
      throw new Error("Invalid role name");
    }
    const roleId = role.roleId;

    const chapter = await db("chapters")
        .select("chapterId")
        .where({ chapterSlug })
        .first();

    if (!chapter) {
      throw new Error(`Chapter '${chapterSlug}' does not exist`);
    }

    const member = await db("members")
        .select("memberId")
        .where({ memberId: userId })
        .first();

    if (!member) {
      throw new Error(`User ID '${userId}' does not exist in members table`);
    }
    await db("members").where({ memberId: userId }).update({ role: newRole });

    const existingMapping = await db("member_chapter_mapping")
      .where({ chapterId:chapter.chapterId, memberId: userId })
      .first();

    if (existingMapping) {
      await db("member_chapter_mapping")
        .where({ chapterId:chapter.chapterId, memberId: userId })
        .update({ roleId });
    } else {
      await db("member_chapter_mapping").insert({ chapterId:chapter.chapterId, memberId: userId, roleId });
    }
    return { userId, roleId, chapterId: chapter.chapterId, roleName: newRole };
};

// Function to update member balance (with optional transaction record)
const updateMemberBalance = async (chapterSlug,userId, newBalance, addToTransaction = false) => {
  const chapter =await db("chapters")
    .select("chapterId")
    .where({ chapterSlug })
    .first();
    
  if (!chapter) {
    throw new Error(`Chapter '${chapterSlug}' does not exist`);
  }
  if(addToTransaction){
    //yet to implement with transaction after discussion
  }else{
    await db("member_chapter_mapping").where({ chapterId:chapter.chapterId, memberId: userId }).update({ balance: newBalance });
  }
  return { userId, chapterId: chapter.chapterId, newBalance };
};

module.exports = {
  getChapterMembers,
  removeChapterMember,
  deleteChapterMember,
  updateMemberRole,
  updateMemberBalance,
};
