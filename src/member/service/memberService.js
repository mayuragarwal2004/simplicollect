const memberModel = require("../model/memberModel");
const paymentModel = require("../../payment/model/paymentModel");
const chapterModel = require("../../chapter/model/chapterModel");
const db = require("../../config/db");

const updateMemberBalanceService = async (
  member,
  chapterId,
  amount,
  reason,
  currentUser = null,
  superAdmin = false,
  addToTransaction = true
) => {
  const trx = await db.transaction();
  try {
    // Update member balance
    const updatedMember = await memberModel.updateMemberBalance(
      member,
      chapterId,
      amount,
      reason,
      trx
    );

    // Do not run if superAdmin is true and addToTransaction is false, in all other cases it should run
    if (!(superAdmin && addToTransaction === false)) {
      await paymentModel.addMemberBalanceTransaction(trx, {
        member,
        chapterId,
        amount,
        reason,
        currentUser,
      });
    }

    await trx.commit();
    return updatedMember;
  } catch (error) {
    await trx.rollback();
    console.log(
      "Error updating member balance and logging transaction:",
      error
    );

    throw new Error("Error updating member balance and logging transaction");
  }
};

const updateMemberRoleService = async (
  member,
  chapter,
  roleIds,
  currentUser,
  trx
) => {
  try {
    // check if the roleIds is an array, and have valid roleIds by fetching all roles from
    const allRoles = await chapterModel.getRolesByChapterSlug(
      chapter.chapterSlug
    );
    if (!Array.isArray(roleIds) || roleIds.length === 0) {
      throw new Error("Role IDs must be a non-empty array");
    }
    const validRoleIds = allRoles.map((role) => role.roleId);
    for (const roleId of roleIds) {
      if (!validRoleIds.includes(roleId)) {
        throw new Error(`Invalid role ID: ${roleId}`);
      }
    }

    const updatedMember = await memberModel.updateMemberRoleModel(
      member,
      chapter,
      roleIds,
      trx
    );
    return updatedMember;
  } catch (error) {
    console.error("Error updating member role:", error);
    throw new Error("Error updating member role");
  }
};

const removeMemberService = async (member, chapterId, leaveDate) => {
  try {
    // Remove member from chapter
    await memberModel.removeMemberFromChapter(member, chapterId, leaveDate);
    return { success: true, message: "Member removed successfully" };
  } catch (error) {
    console.error("Error removing member:", error);
    throw new Error("Error removing member");
  }
};

module.exports = {
  updateMemberBalanceService,
  updateMemberRoleService,
  removeMemberService,
};
