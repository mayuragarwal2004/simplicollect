const db = require("../../config/db"); // Adjust path if needed
const { v4: uuidv4 } = require("uuid");
const findMemberByEmail = async (email) => {
  return await db("members")
    .select("memberId")
    .whereRaw("LOWER(email) = ?", [email.toLowerCase()]);
};

const findMemberByPhone = async (phone) => {
  return await db("members")
    .select("memberId")
    .where("phoneNumber", phone);
};

const isMemberInChapter = async (memberId, chapterId) => {
  return await db("member_chapter_mapping")
    .select("*")
    .where({ memberId, chapterId, status: "joined" });
};

const isValidRoleForChapter = async (roleId, chapterId) => {
  const [role] = await db("roles")
    .select("roleId")
    .where({ roleId, chapterId });
  return role;
};
//insert new member
const insertMember = async ({ firstName, lastName, email, phoneNumber, password , roleId }) => {
  const memberId = uuidv4();
  await db("members").insert({
    memberId,
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    role: Array.isArray(roleId) ? roleId.join(",") : roleId.toString()
  });
  return memberId;
};

//check full mapping record even if status is not joined
const getMemberChapterMapping = async (memberId, chapterId) => {
  return await db("member_chapter_mapping")
    .select("*")
    .where({ memberId, chapterId })
    .first();
};

//insert new mapping
const mapMemberToChapter = async ({ memberId, chapterId, roleId, joinDate }) => {
  await db("member_chapter_mapping").insert({
    memberId,
    chapterId,
    roleIds: Array.isArray(roleId) ? roleId.join(",") : roleId.toString(),
    status: "joined",
    joinedDate: joinDate
  });

  // update the members role in the members table
  await db("members")
    .where({ memberId })
    .update({
      role: Array.isArray(roleId) ? roleId.join(",") : roleId.toString()
    });

  return true;
};

//update status to joined if previously left
const rejoinMemberToChapter = async ({ memberId, chapterId, roleId, joinDate }) => {
  return await db("member_chapter_mapping")
    .where({ memberId, chapterId })
    .update({
      status: "joined",
      joinedDate: joinDate,
      roleIds: roleId.toString()
    });
};

module.exports = {
  findMemberByEmail,
  findMemberByPhone,
  isMemberInChapter,
  isValidRoleForChapter,
  insertMember,
  getMemberChapterMapping,
  mapMemberToChapter,
  rejoinMemberToChapter
};
