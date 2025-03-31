const db = require("../../config/db");
const { search } = require("../route/adminChapterMemberListRoutes");

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
      "members.role",
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
  const roleNames = newRole.split(',').map(role => role.trim());
  
  const roles = await db("roles")
    .select("roleId", "roleName")
    .whereIn("roleName", roleNames);
  if (roles.length !== roleNames.length) {
    throw new Error("One or more invalid role names");
  }

  const roleIds = roles.map(role => role.roleId).join(',');
  const chapter = await db("chapters")
    .select("chapterId")
    .where({ chapterSlug })
    .first();

  if (!chapter) {
    throw new Error(`Chapter '${chapterSlug}' does not exist`);
  }

  await db("members")
    .where({ memberId: userId })
    .update({ role: newRole });

  const existingMapping = await db("member_chapter_mapping")
    .where({ chapterId: chapter.chapterId, memberId: userId })
    .first();

  if (existingMapping) {
    await db("member_chapter_mapping")
      .where({ chapterId: chapter.chapterId, memberId: userId })
      .update({ roleIds: roleIds });
  } else {
    await db("member_chapter_mapping")
      .insert({ chapterId: chapter.chapterId, memberId: userId, roleIds: roleIds });
  }

  return { userId, roleIds, chapterId: chapter.chapterId, roleName: newRole };
};

// Function to update member balance (with optional transaction record)
const updateMemberBalance = async (chapterSlug,userId, newBalance, addToTransaction = false,memberId) => {
  const chapter =await db("chapters")
    .select("chapterId")
    .where({ chapterSlug })
    .first();
  if (!chapter) {
    throw new Error(`Chapter '${chapterSlug}' does not exist`);
  }
  if(addToTransaction){
    const superAdminId = memberId; // Replace with actual super admin ID
    const superAdmin = await db("members")
    .select(db.raw("CONCAT(firstName, ' ', lastName) AS fullName"))
    .where({ memberId })
    .first();
    if (!superAdmin) {
      throw new Error("Super admin not found");
    }

    await db("transactions").insert({
      transactionId: db.raw("UUID()"), // Auto-generated
      chapterId: chapter.chapterId, 
      memberId: userId,
      transactionDate: db.raw("CURRENT_TIMESTAMP"), // Today's date
      transactionType: "Balance Update",
      originalPayableAmount: 0,
      discountAmount: 0,
      penaltyAmount: 0,
      receiverFee: 0,
      amountPaidToChapter: 0,
      amountExpectedToChapter: 0,
      platformFee: 0,
      balanceAmount: newBalance,
      payableAmount: 0,
      paidAmount: 0,
      userRemarks: "Balance Updated by Super Admin",
      systemRemarks: "Balance Updated by Super Admin",
      status: "approved",
      statusUpdateDate: db.raw("CURRENT_TIMESTAMP"), // Today's date
      paymentType: null,
      paymentDate: null,
      paymentImageLink: null,
      paymentReceivedById: null,
      paymentReceivedByName: null,
      packageId: null,
      approvedById: superAdminId, // Replace with actual super admin ID
      approvedByName: superAdmin.fullName, // Replace with actual super admin name
      transferedToChapter: 1,
      transferedToChapterTransactionId: null
  });
    }
    await db("member_chapter_mapping").where({ chapterId:chapter.chapterId, memberId: userId }).update({ balance: newBalance });
  
  return { userId, chapterId: chapter.chapterId, newBalance };
};

const searchMemberForChapterToAdd = async (searchQuery, chapterId) => {
  return db("members as m")
    .select(
      "m.memberId",
      db.raw("CONCAT(m.firstName, ' ', m.lastName) AS fullName"),
      "m.firstName",
      "m.lastName",
      "m.email",
      "m.phoneNumber",
      db.raw("CASE WHEN mc.memberId IS NOT NULL THEN 1 ELSE 0 END AS isInChapter"),
      db.raw(`
        CASE 
          WHEN m.firstName LIKE ? THEN 1
          WHEN m.lastName LIKE ? THEN 2
          WHEN m.email LIKE ? THEN 3
          WHEN m.phoneNumber LIKE ? THEN 4
          ELSE 5 
        END AS relevance
      `, [`${searchQuery}%`, `${searchQuery}%`, `${searchQuery}%`, `${searchQuery}%`]) 
    )
    .leftJoin("member_chapter_mapping as mc", function () {
      this.on("m.memberId", "=", "mc.memberId")
        .andOn("mc.chapterId", "=", db.raw("?", [chapterId]))
        .andOn(db.raw("mc.status = 'joined' OR mc.status IS NULL"));
    })
    .where(function () {
      this.where("m.firstName", "LIKE", `%${searchQuery}%`)
        .orWhere("m.lastName", "LIKE", `%${searchQuery}%`)
        .orWhere("m.email", "LIKE", `%${searchQuery}%`)
        .orWhere("m.phoneNumber", "LIKE", `%${searchQuery}%`);
    })
    .orderBy("relevance", "asc")
    .orderBy("m.firstName", "asc") 
    .orderBy("m.lastName", "asc")
    .limit(50);
};

const searchMemberForChapter = async (searchQuery, chapterId, rows, page) => {
  const offset = (page - 1) * rows; 

  const members = await db("members as m")
    .select(
      "m.memberId",
      db.raw("CONCAT(m.firstName, ' ', m.lastName) AS fullName"),
      "m.firstName",
      "m.lastName",
      "m.email",
      "m.phoneNumber"
    )
    .join("member_chapter_mapping as mc", function () {
      this.on("m.memberId", "=", "mc.memberId")
        .andOn("mc.chapterId", "=", db.raw("?", [chapterId]))
        .andOn(db.raw("mc.status = 'joined'")); 
    })
    .where(function () {
      this.where("m.firstName", "LIKE", `%${searchQuery}%`)
        .orWhere("m.lastName", "LIKE", `%${searchQuery}%`)
        .orWhere("m.email", "LIKE", `%${searchQuery}%`)
        .orWhere("m.phoneNumber", "LIKE", `%${searchQuery}%`);
    })
    .orderBy("m.firstName", "asc")
    .orderBy("m.lastName", "asc")
    .limit(rows)
    .offset(offset);

  const totalResult = await db("members as m")
    .count("m.memberId as count")
    .join("member_chapter_mapping as mc", function () {
      this.on("m.memberId", "=", "mc.memberId")
        .andOn("mc.chapterId", "=", db.raw("?", [chapterId]))
        .andOn(db.raw("mc.status = 'joined'")); 
    })
    .where(function () {
      this.where("m.firstName", "LIKE", `%${searchQuery}%`)
        .orWhere("m.lastName", "LIKE", `%${searchQuery}%`)
        .orWhere("m.email", "LIKE", `%${searchQuery}%`)
        .orWhere("m.phoneNumber", "LIKE", `%${searchQuery}%`);
    })
    .first();

  const total = totalResult ? totalResult.count : 0; 

  return { members, total };
};


module.exports = {
  getChapterMembers,
  removeChapterMember,
  deleteChapterMember,
  updateMemberRole,
  updateMemberBalance,
  searchMemberForChapterToAdd,
  searchMemberForChapter
};
