// models/packageModel.js
const db = require("../../config/db");

const getPackageById = async (packageId) => {
  return db("packages as p")
    .where("p.packageId", packageId)
    .leftJoin("transactions as t", "p.packageId", "t.packageId")
    .select("t.*", "p.*");
};

const getPackagesByParentType = async (parentType) => {
  return db("packages as p")
    .where("p.packageParent", parentType)
    .leftJoin("transactions as t", "p.packageId", "t.packageId")
    .select("t.*", "p.*");
};

const getAllPackages = async () => {
  return db("packages as p")
    .leftJoin("transactions as t", "p.packageId", "t.packageId")
    .orderBy("p.packagePayableStartDate", "asc")
    .select("t.*", "p.*");
};

// -- Create meetings table
// CREATE TABLE kbgtrntx_simplicollect.meetings (
//   meetingId VARCHAR(255) PRIMARY KEY,
//   chapterId VARCHAR(255) NOT NULL,
//   meetingName VARCHAR(255) NOT NULL,
//   meetingDate DATE NOT NULL,
//   meetingTime VARCHAR(255) NOT NULL,
//   meetingFeeMembers BIGINT,
//   meetingFeeVisitors BIGINT,
//   disabled BOOLEAN DEFAULT FALSE,
//   FOREIGN KEY (chapterId) REFERENCES chapters(chapterId) ON DELETE CASCADE
// ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

// -- Create packages table
// CREATE TABLE kbgtrntx_simplicollect.packages (
//   packageId VARCHAR(255) PRIMARY KEY,
//   packageName VARCHAR(255) NOT NULL,
//   packageParent VARCHAR(255),
//   packageFeeType VARCHAR(255),
//   packageFeeAmount BIGINT,
//   packagePayableStartDate DATE,
//   packagePayableEndDate DATE,
//   allowAfterEndDate BOOLEAN,
//   allowPenaltyPayableAfterEndDate BOOLEAN,
//   penaltyType VARCHAR(255),
//   penaltyAmount BIGINT,
//   penaltyFrequency VARCHAR(255),
//   discountType VARCHAR(255),
//   discountAmount BIGINT,
//   discountFrequency VARCHAR(255),
//   discountEndDate DATE,
//   allowPackagePurchaseIfFeesPaid BOOLEAN,
//   meetingIds JSON
// ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

const getPackagesByChapterId = async (chapterId, memberId) => {
  return db("packages as p")
    .leftJoin("transactions as t", function () {
      this.on("p.packageId", "t.packageId").andOn("t.memberId", db.raw("?", [memberId]));
    })
    .join("meetings as m", function () {
      this.on(
        "p.meetingIds",
        "like",
        db.raw("concat('%', m.meetingId, '%')")
      );
    })
    .distinct("p.packageId")
    .where({ "m.chapterId": chapterId })
    .orderBy("p.packagePayableStartDate", "asc")
    .select("t.*", "p.*");
}

// Fetch packages by chapterId, termId, and optionally memberId
const getPackagesByChapterAndTerm = async (chapterId, termId, memberId) => {  
  let query = db("packages as p")
    .leftJoin("transactions as t", function () {
      this.on("p.packageId", "t.packageId");
      if (memberId) this.andOn("t.memberId", db.raw("?", [memberId]));
    })
    .join("term as tm", "p.termId", "tm.termId")
    .where({ "p.chapterId": chapterId, "p.termId": termId })
    .orderBy("p.packagePayableStartDate", "asc")
    .select("t.*", "p.*", "tm.termName", { termStatus: "tm.status" });
  return query;
};

// Get all unique package parents for a chapter and optional term
const getPackageParentsByChapter = async (chapterId, termId) => {
  let query = db("packages")
    .where({ chapterId })
    .whereNotNull("packageParent");
  if (termId) {
    query = query.andWhere({ termId });
  }
  const result = await query.distinct("packageParent");
  return result.map((row) => row.packageParent);
};

// Get all unique package parents for a chapter and term (both required)
const getPackageParentsByChapterAndTerm = async (chapterId, termId) => {
  if (!chapterId || !termId) throw new Error('chapterId and termId are required');
  const result = await db("packages")
    .where("chapterId", chapterId)
    .andWhere("termId", termId)
    .whereNotNull("packageParent")
    .distinct("packageParent");
  return result.map((row) => row.packageParent);
};

module.exports = {
  getPackageById,
  getAllPackages,
  getPackagesByParentType,
  getPackagesByChapterId,
  getPackagesByChapterAndTerm,
  getPackageParentsByChapter,
  getPackageParentsByChapterAndTerm,
};
