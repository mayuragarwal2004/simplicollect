// models/chapterModel.js
const db = require("../config/db");

// Function to get features by memberId and chapterId
const getRightsByMemberIdAndChapterId = async (memberId, chapterId) => {
  console.log({ memberId, chapterId });
  
  return db.raw(
    `SELECT 
    fm.featureId,
    fm.featureName,
    fm.featureDescription,
    fm.featureType,
    fm.featureParent,
    fm.featureUrl,
    fm.featureIcon,
    fm.featureOrder,
    fm.featureDisabled,
    r.rightId,
    r.rightName,
    r.rightDescription,
    r.rightDisabled,
    ro.roleId,
    ro.roleName,
    ro.roleDescription
FROM 
    memberChapterMapping mcm
JOIN 
    roles ro ON mcm.roleId = ro.roleId
JOIN 
    rights r ON ro.roleId = r.roleId
JOIN 
    featuresMaster fm ON r.featureId = fm.featureId
WHERE 
    mcm.memberId = ? 
    AND mcm.chapterId = ?;`,
    [memberId, chapterId]
  );
};

module.exports = {
  getRightsByMemberIdAndChapterId,
};
