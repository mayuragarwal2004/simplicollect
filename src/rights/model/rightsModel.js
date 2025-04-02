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
    .join("roles as ro", "mcm.roleId", "ro.roleId")
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
    .where("mcm.memberId", memberId)
    .andWhere("mcm.chapterId", chapterId);
};

module.exports = {
  getRightsByMemberIdAndChapterIdAndMenu,
  getAllRightsByMemberIdAndChapterId,
};
