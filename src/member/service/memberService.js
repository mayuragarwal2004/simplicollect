const memberModel = require("../model/memberModel");
const paymentModel = require("../../payment/model/paymentModel");
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

module.exports = {
  updateMemberBalanceService,
};
