const db = require("../../config/db"); // Adjust path if needed

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
    .where({ memberId, chapterId });
};

const isValidRoleForChapter = async (roleId, chapterId) => {
  const [role] = await db("roles")
    .select("roleId")
    .where({ roleId, chapterId });
  return role;
};



  

module.exports = {
  findMemberByEmail,
  findMemberByPhone,
  isMemberInChapter,
  isValidRoleForChapter
};
