const chapterModel = require("../../chapter/model/chapterModel");
const memberModel = require("../../member/model/memberModel");
const packageModel = require("../../package/model/packageModel");
const { extractMemberDueSummaryData } = require("../../report/service/memberDueSummaryService");
const { sendWhatsAppMessage } = require("../../../config/whatsapp");
const db = require("../../../config/db");

const getDuesBroadcastList = async (req, res) => {
  const { termId, packageParent } = req.query;
  const { chapterId } = req.params;
  
  if (!termId) {
    return res.status(400).json({ error: "termId is required." });
  }

  try {
    const { data } = await extractMemberDueSummaryData(
      chapterId,
      termId,
      { packageParent }
    );
    res.json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const sendDuesNotification = async (req, res) => {
  const { chapterId } = req.params;
  const { members, termId, packageId } = req.body;

  const { memberId } = req.user;

  if (!members || !members.length || !termId || !packageId) {
    return res.status(400).json({
      error: "Members array, termId, and packageId are required."
    });
  }

  const trx = await db.transaction();

  try {
    const chapter = await chapterModel.findChapterById(chapterId);
    if (!chapter) {
      throw new Error("Chapter not found");
    }

    // Create broadcast history record
    const [broadcastId] = await trx("BroadcastHistory").insert({
      chapterId,
      termId,
      packageId,
      triggeredBy: memberId,
      totalMembersSent: members.length,
      successCount: 0,
      failureCount: 0,
      triggeredAt: db.fn.now()
    });

    const results = [];
    for (const member of members) {
      if (!member.phoneNumber || !member.dueAmount) continue;

      const templateData = {
        templateName: "pay_due_remind",
        languageCode: "en",
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: `${member.firstName} ${member.lastName}` },
              { type: "text", text: member.dueAmount.toString() },
              { type: "text", text: member.packageName },
              { type: "text", text: chapter.chapterName }
            ]
          }
        ]
      };

      try {
        const result = await sendWhatsAppMessage(
          "utility",
          member.phoneNumber,
          templateData
        );

        // Record member broadcast history
        await trx("BroadcastMemberHistory").insert({
          broadcastId,
          memberId: member.memberId,
          memberName: `${member.firstName} ${member.lastName}`,
          phoneNumber: member.phoneNumber,
          dueAmount: member.dueAmount,
          packageName: member.packageName,
          status: result.ok ? 'success' : 'failed',
          errorMessage: result.ok ? null : result.message,
          sentAt: db.fn.now()
        });

        results.push({
          memberId: member.memberId,
          success: result.ok,
          message: result.message
        });
      } catch (error) {
        // Record failed attempt
        await trx("BroadcastMemberHistory").insert({
          broadcastId,
          memberId: member.memberId,
          memberName: `${member.firstName} ${member.lastName}`,
          phoneNumber: member.phoneNumber,
          dueAmount: member.dueAmount,
          packageName: member.packageName,
          status: 'failed',
          errorMessage: error.message,
          sentAt: db.fn.now()
        });

        results.push({
          memberId: member.memberId,
          success: false,
          message: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    // Update broadcast history with final counts
    await trx("BroadcastHistory")
      .where({ id: broadcastId })
      .update({
        successCount,
        failureCount
      });

    await trx.commit();

    res.json({
      message: `Successfully sent ${successCount} notifications. ${failureCount} failed.`,
      results,
      broadcastId
    });
  } catch (error) {
    await trx.rollback();
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDuesBroadcastList,
  sendDuesNotification
};