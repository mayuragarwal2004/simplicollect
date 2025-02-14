// models/chapterModel.js
const db = require("../config/db");

// Function to get features by memberId and chapterId
const getRightsByMemberIdAndChapterIdAndMenu = async (memberId, chapterId) => {
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
    fm.featureDisabled
FROM 
    memberChapterMapping mcm
JOIN 
    roles ro ON mcm.roleId = ro.roleId
JOIN 
    featuresMaster fm ON FIND_IN_SET(fm.featureId, ro.rights) > 0
WHERE 
    mcm.memberId = ? 
    AND mcm.chapterId = ?
    AND fm.featureType = ? ;`,
    [memberId, chapterId, "menu"]
  );
};

module.exports = {
  getRightsByMemberIdAndChapterIdAndMenu,
};
