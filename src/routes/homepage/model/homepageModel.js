// models/homepageModel.js
const db = require("../../../config/db");
const { formatCurrency } = require("../../../utility/numberFormatter");

// Get statistics for homepage
const getStatistics = async () => {
  try {
    // Get total chapters count
    const chaptersResult = await db("chapters").count("chapterId as count").first();
    const totalChapters = chaptersResult.count || 0;

    // Get total members count
    const membersResult = await db("members").count("memberId as count").first();
    const totalMembers = membersResult.count || 0;

    // Get total amount from successful transactions
    const amountResult = await db("transactions")
      .where("status", "approved")
      .sum("paidAmount as total")
      .first();
    const totalAmountRaw = amountResult.total || 0;
    const totalAmount = formatCurrency(totalAmountRaw);

    return {
      totalChapters,
      totalMembers,
      totalAmount,
      totalAmountRaw // Keep raw amount for any calculations if needed
    };
  } catch (error) {
    throw error;
  }
};

// Save newsletter email
const saveNewsletterEmail = async (email) => {
  try {
    // Check if email already exists
    const existingEmail = await db("newsletter_subscribers")
      .where("email", email)
      .first();

    if (existingEmail) {
      return { success: false, message: "Email already subscribed" };
    }

    // Insert new email
    await db("newsletter_subscribers").insert({
      email: email,
      subscribedAt: new Date(),
      isActive: true
    });

    return { success: true, message: "Successfully subscribed to newsletter" };
  } catch (error) {
    throw error;
  }
};

// Get newsletter subscriber by email
const getNewsletterSubscriber = async (email) => {
  try {
    return await db("newsletter_subscribers")
      .where("email", email)
      .first();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getStatistics,
  saveNewsletterEmail,
  getNewsletterSubscriber
};
