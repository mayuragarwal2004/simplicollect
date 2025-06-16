// models/chapterModel.js
const db = require("../../config/db");

// Function to get features by memberId and chapterId
const getRightsByMemberIdAndChapterIdAndMenu = async (memberId, chapterId) => {
  console.log({ memberId, chapterId });

  return db.raw(
    `SELECT DISTINCT 
      fm.featureId, 
      fm.featureName, 
      fm.featureDescription, 
      fm.featureType, 
      fm.featureParent, 
      fm.featureUrl, 
      fm.featureIcon, 
      fm.featureOrder, 
      fm.featureDisabled
    FROM 
      member_chapter_mapping mcm
    JOIN 
      roles ro ON FIND_IN_SET(ro.roleId, mcm.roleIds) > 0
    JOIN 
      features_master fm ON FIND_IN_SET(fm.featureId, ro.rights) > 0
    WHERE 
      mcm.memberId = ? 
      AND mcm.chapterId = ?
      AND fm.featureType = ?;`,
    [memberId, chapterId, "menu"]
  );
};

const getAllRightsByMemberIdAndChapterId = async (memberId, chapterId) => {
  console.log({ memberId, chapterId });

  return db("member_chapter_mapping as mcm")
    .joinRaw(
      "JOIN roles ro ON FIND_IN_SET(ro.roleId, mcm.roleIds) > 0"
    )
    .joinRaw(
      "JOIN features_master fm ON FIND_IN_SET(fm.featureId, ro.rights) > 0"
    )
    .select(
      "fm.featureId",
      "fm.featureName",
      "fm.featureDescription",
      "fm.featureType",
      "fm.featureParent",
      "fm.featureUrl",
      "fm.featureIcon",
      "fm.featureOrder",
      "fm.featureDisabled",
      "mcm.*"
    )
    .select(
      db.raw("GROUP_CONCAT(DISTINCT ro.roleName ORDER BY ro.roleId ASC) as roleNames")
    )
    .where("mcm.memberId", memberId)
    .andWhere("mcm.chapterId", chapterId)
    .groupBy("mcm.memberId", "mcm.chapterId", "fm.featureId");
};

const isFeeReceiverToday = async (memberId, chapterId) => {
  return db("fee_receivers as fr")
    .join("member_chapter_mapping as mcm", "fr.memberId", "mcm.memberId")
    .where("fr.chapterId", chapterId)
    .andWhere("fr.memberId", memberId)
    .andWhereRaw("CURDATE() BETWEEN DATE(fr.enableDate) AND DATE(fr.disableDate)")
    .select("fr.*")
    .first();
};


module.exports = {
  getRightsByMemberIdAndChapterIdAndMenu,
  getAllRightsByMemberIdAndChapterId,
  isFeeReceiverToday,
};
