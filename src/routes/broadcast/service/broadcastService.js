const memberModel = require("../../member/model/memberModel");
const packageModel = require("../../package/model/packageModel");
const meetingModel = require("../../meeting/model/meetingModel");
const {
  packageAmountCalculations,
} = require("../../../utility/packageAmountCalculation");

// Service to get dues broadcast list data
async function getDuesBroadcastData(chapterId, termId, packageParent, { page = 0, rows = 10 } = {}) {
  const { data: members, totalRecords } = await memberModel.getMembers(chapterId, "", page, rows);

  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    // Get all packages for this member
    const packageData = await packageModel.getPackagesByChapterAndTerm(chapterId, termId, member.memberId);
    
    // Get member's meeting data
    const meetingData = await meetingModel.getAllMeetingsUsingMemberIdAndChapterId(member.memberId, chapterId);
    
    // Filter and calculate for each package
    const processedPackages = packageData
      .filter(pkg => !packageParent || pkg.packageParent === packageParent)
      .map(pkg => {
        const calculatedResult = packageAmountCalculations(new Date(), pkg, meetingData, 0);
        return {
          ...pkg,
          calculatedResult
        };
      });

    // Add processed package data to member
    members[i].packageData = processedPackages;
  }

  return {
    data: members.filter(member => member.packageData.length > 0),
    totalRecords
  };
}

module.exports = {
  getDuesBroadcastData,
};