const db = require("../../config/db");

// Specific update methods for better control
const updateName= async (memberId, firstName, lastName) => {
    try {
        const result = await db("members")
      .where("memberId", memberId)
      .update({
        firstName: firstName,
        lastName: lastName,
      })
      .returning(["memberId", "firstName", "lastName"]);
      console.log('Update result:', result); // Add logging
      return result;
    } catch (error) {
      console.error('Model error:', error);
      throw error;
    }
  };
  getById= async (memberId) => {
    return db('members')
      .where('memberId', memberId)
      .first();
  };
  updateEmail= async (memberId, newEmail) => {
    await db('members')
      .where('memberId', memberId)
      .update({
        email: newEmail,
        updated_at: db.fn.now()
      });

    return db('members')
      .where('memberId', memberId)
      .first();
  };

module.exports={
    updateName,
    getById,
    updateEmail,
};
