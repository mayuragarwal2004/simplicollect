// models/packageModel.js
const db = require("../../../config/db");

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
  const query = db("packages as p")
    // Join with member_chapter_mapping to get member's cluster
    .join("member_chapter_mapping as mcm", function() {
      this.on("mcm.chapterId", "=", db.raw("?", [chapterId]))
          .andOn("mcm.memberId", "=", db.raw("?", [memberId]))
          .andOn("mcm.status", "=", db.raw("?", ["joined"]));
    })
    // Left join with cluster_package_mapping to get cluster-specific packages
    .leftJoin("cluster_package_mapping as cpm", function() {
      this.on("cpm.packageId", "=", "p.packageId")
          .andOn("cpm.clusterId", "=", "mcm.clusterId")
          .andOn("cpm.isActive", "=", db.raw("?", [true]));
    })
    // Left join with transactions for member's transaction history
    .leftJoin("transactions as t", function () {
      this.on("p.packageId", "t.packageId").andOn("t.memberId", db.raw("?", [memberId]));
    })
    // Join with meetings for chapter's meetings
    .join("meetings as m", function () {
      this.on(
        "p.meetingIds",
        "like",
        db.raw("concat('%', m.meetingId, '%')")
      );
    })
    .distinct("p.packageId")
    .where(function() {
      this.where({ "m.chapterId": chapterId })
          .andWhere(function() {
            // Include packages if:
            // 1. They are assigned to member's cluster (cluster_package_mapping exists)
            // 2. OR They are not assigned to any cluster (no cluster restrictions)
            this.whereNotNull("cpm.packageId")
                .orWhereNotExists(function() {
                  this.select("*")
                      .from("cluster_package_mapping")
                      .whereRaw("packageId = p.packageId")
                      .andWhere("isActive", true);
                });
          });
    })
    .orderBy("p.packagePayableStartDate", "asc")
    .select("t.*", "p.*");

  return query;
}

// Fetch packages by chapterId, termId, and optionally memberId
const getPackagesByChapterAndTerm = async (chapterId, termId, memberId) => {  
  let query = db("packages as p")
    // Join with term table
    .join("term as tm", "p.termId", "tm.termId");

  if (memberId) {
    // Join with member_chapter_mapping to get member's cluster if memberId is provided
    query = query
      .join("member_chapter_mapping as mcm", function() {
        this.on("mcm.chapterId", "=", db.raw("?", [chapterId]))
            .andOn("mcm.memberId", "=", db.raw("?", [memberId]))
            .andOn("mcm.status", "=", db.raw("?", ["joined"]));
      })
      // Left join with cluster_package_mapping to get cluster-specific packages
      .leftJoin("cluster_package_mapping as cpm", function() {
        this.on("cpm.packageId", "=", "p.packageId")
            .andOn("cpm.clusterId", "=", "mcm.clusterId")
            .andOn("cpm.isActive", "=", db.raw("?", [true]));
      })
      // Left join with transactions for member's history
      .leftJoin("transactions as t", function () {
        this.on("p.packageId", "t.packageId")
            .andOn("t.memberId", db.raw("?", [memberId]));
      })
      .where(function() {
        this.where({ 
          "p.chapterId": chapterId, 
          "p.termId": termId 
        })
        .andWhere(function() {
          // Include packages if:
          // 1. They are assigned to member's cluster
          // 2. OR They are not assigned to any cluster
          this.whereNotNull("cpm.packageId")
              .orWhereNotExists(function() {
                this.select("*")
                    .from("cluster_package_mapping")
                    .whereRaw("packageId = p.packageId")
                    .andWhere("isActive", true);
              });
        });
      });
  } else {
    // If no memberId, just get all packages for the chapter and term
    query = query
      .leftJoin("transactions as t", "p.packageId", "t.packageId")
      .where({ 
        "p.chapterId": chapterId, 
        "p.termId": termId 
      });
  }

  return query
    .distinct("p.packageId")
    .orderBy("p.packagePayableStartDate", "asc")
    .select("t.*", "p.*", "tm.termName", { termStatus: "tm.status" });
};

// Admin version: Get ALL packages by chapter and term without cluster filtering
const getAllPackagesByChapterAndTermAdmin = async (chapterId, termId) => {  
  return db("packages as p")
    // Join with term table to ensure packages belong to the chapter's term
    .join("term as tm", function() {
      this.on("p.termId", "tm.termId")
          .andOn("tm.chapterId", db.raw("?", [chapterId]));
    })
    .where({ "p.termId": termId })
    .distinct("p.packageId")
    .orderBy("p.packagePayableStartDate", "asc")
    .select("p.*", "tm.termName", { termStatus: "tm.status" });
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
  getAllPackagesByChapterAndTermAdmin,
  getPackageParentsByChapterAndTerm,
};
