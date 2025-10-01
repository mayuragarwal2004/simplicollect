// models/clusterModel.js
const db = require("../../../config/db");

const getClustersByChapterSlug = async (chapterSlug) => {
  const clusters = await db("clusters as c")
    .join("chapters as ch", "c.chapterId", "ch.chapterId")
    .leftJoin("member_chapter_mapping as mcm", "mcm.clusterId", "c.clusterId")
    .where("ch.chapterSlug", chapterSlug)
    .groupBy("c.clusterId")
    .select([
      "c.*",
      db.raw("COUNT(DISTINCT mcm.memberId) as memberCount")
    ]);
  return clusters;
};

const getClusterById = async (clusterId) => {
  return db("clusters")
    .where("clusterId", clusterId)
    .first();
};

const createCluster = async (clusterData) => {
  const [clusterId] = await db("clusters")
    .insert({
      clusterId: clusterData.clusterId,
      chapterId: clusterData.chapterId,
      clusterName: clusterData.clusterName,
      description: clusterData.description,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  return getClusterById(clusterId);
};

const updateCluster = async (clusterId, clusterData) => {
  await db("clusters")
    .where("clusterId", clusterId)
    .update({
      clusterName: clusterData.clusterName,
      description: clusterData.description,
      updatedAt: new Date()
    });
  return getClusterById(clusterId);
};

const deleteCluster = async (clusterId) => {
  // First get the cluster to know which chapter it belongs to
  const cluster = await db("clusters")
    .where("clusterId", clusterId)
    .first();

  if (!cluster) {
    throw new Error("Cluster not found");
  }

  // First remove cluster assignments from members of this chapter only
  await db("member_chapter_mapping")
    .where({
      "clusterId": clusterId,
      "chapterId": cluster.chapterId
    })
    .update({ clusterId: null });
    
  // Then delete the cluster
  return db("clusters")
    .where("clusterId", clusterId)
    .del();
};

const getClusterMembers = async (clusterId) => {
  return db("member_chapter_mapping as mcm")
    .join("members as m", "m.memberId", "mcm.memberId")
    .where("mcm.clusterId", clusterId)
    .groupBy("m.memberId")
    .select([
      "m.memberId",
      "m.firstName",
      "m.lastName",
      "m.email",
      "m.phoneNumber"
    ]);
};

const searchChapterMembers = async (clusterId, searchQuery) => {
  // First, get the chapterId from the cluster
  const cluster = await db("clusters")
    .where("clusterId", clusterId)
    .first();

  if (!cluster) {
    throw new Error("Cluster not found");
  }

  return db("member_chapter_mapping as mcm")
    .join("members as m", "m.memberId", "mcm.memberId")
    .leftJoin("clusters as c", "mcm.clusterId", "c.clusterId")
    .where("mcm.chapterId", cluster.chapterId)
    .where(function() {
      this.where(db.raw("CONCAT(m.firstName, ' ', COALESCE(m.lastName, ''))"), "like", `%${searchQuery}%`)
          .orWhere("m.email", "like", `%${searchQuery}%`)
          .orWhere("m.phoneNumber", "like", `%${searchQuery}%`);
    })
    .select([
      "m.memberId",
      "m.firstName",
      "m.lastName",
      "m.email",
      "m.phoneNumber",
      "mcm.clusterId",
      "c.clusterName",
      db.raw("CASE WHEN mcm.clusterId = ? THEN true ELSE false END as isInCluster", [clusterId]),
      db.raw("CASE WHEN mcm.clusterId IS NOT NULL AND mcm.clusterId != ? THEN true ELSE false END as isInOtherCluster", [clusterId])
    ]);
};

const addMemberToCluster = async (clusterId, memberId) => {
  // First, get the cluster to know which chapter it belongs to
  const cluster = await db("clusters")
    .where("clusterId", clusterId)
    .first();

  if (!cluster) {
    throw new Error("Cluster not found");
  }

  // Update the mapping only for the specific chapter
  await db("member_chapter_mapping")
    .where({
      "memberId": memberId,
      "chapterId": cluster.chapterId
    })
    .update({ clusterId });
};

const removeMemberFromCluster = async (clusterId, memberId) => {
  // First get the cluster to know which chapter it belongs to
  const cluster = await db("clusters")
    .where("clusterId", clusterId)
    .first();

  if (!cluster) {
    throw new Error("Cluster not found");
  }

  // Remove member from cluster only for this specific chapter
  await db("member_chapter_mapping")
    .where({ 
      memberId,
      clusterId,
      chapterId: cluster.chapterId
    })
    .update({ clusterId: null });
};

const getClusterPackages = async (clusterId) => {
  // First, get the cluster to know which chapter it belongs to
  const cluster = await db("clusters")
    .where("clusterId", clusterId)
    .first();

  if (!cluster) {
    throw new Error("Cluster not found");
  }

  const packages = await db("packages as p")
    .join("term as t", "p.termId", "t.termId")
    .leftJoin("cluster_package_mapping as cpm", function() {
      this.on("cpm.packageId", "p.packageId")
          .andOn("cpm.clusterId", db.raw("?", [clusterId]))
          .andOn("cpm.isActive", db.raw("?", [true]));
    })
    .where("t.chapterId", cluster.chapterId)
    .select([
      "p.*",
      "t.termName",
      db.raw("CASE WHEN cpm.packageId IS NOT NULL THEN true ELSE false END as isIncluded")
    ])
    .orderBy(["t.termName", "p.packagePayableStartDate"]);

  return packages;
};

const addPackageToCluster = async (clusterId, packageId) => {
  // First, get the cluster to know which chapter it belongs to
  const cluster = await db("clusters")
    .where("clusterId", clusterId)
    .first();

  if (!cluster) {
    throw new Error("Cluster not found");
  }

  // Verify the package belongs to this chapter
  const packageBelongsToChapter = await db("packages as p")
    .join("term as t", "p.termId", "t.termId")
    .where({
      "p.packageId": packageId,
      "t.chapterId": cluster.chapterId
    })
    .first();

  if (!packageBelongsToChapter) {
    throw new Error("Package does not belong to this chapter");
  }

  // First check if there's an existing mapping that's inactive
  const existingMapping = await db("cluster_package_mapping")
    .where({ clusterId, packageId })
    .first();

  if (existingMapping) {
    // If there's an existing mapping, delete it first
    await db("cluster_package_mapping")
      .where({ clusterId, packageId })
      .delete();
  }

  // Then insert the new active mapping
  await db("cluster_package_mapping").insert({
    clusterId,
    packageId,
    isActive: true,
  });
};

const removePackageFromCluster = async (clusterId, packageId) => {
  // First, get the cluster to know which chapter it belongs to
  const cluster = await db("clusters")
    .where("clusterId", clusterId)
    .first();

  if (!cluster) {
    throw new Error("Cluster not found");
  }

  // Verify the package belongs to this chapter
  const packageBelongsToChapter = await db("packages as p")
    .join("term as t", "p.termId", "t.termId")
    .where({
      "p.packageId": packageId,
      "t.chapterId": cluster.chapterId
    })
    .first();

  if (!packageBelongsToChapter) {
    throw new Error("Package does not belong to this chapter");
  }

  await db("cluster_package_mapping")
    .where({
      clusterId,
      packageId
    })
    .delete();
};

const bulkUpdateMembers = async (chapterId, updates) => {
  // Process each update in a transaction
  await db.transaction(async (trx) => {
    for (const update of updates) {
      const { memberId, clusterId } = update;
      
      // Update the member's cluster in member_chapter_mapping
      await trx("member_chapter_mapping")
        .where({
          memberId,
          chapterId,
          status: "joined"
        })
        .update({
          clusterId: clusterId || null
        });
    }
  });
};

const bulkUpdatePackages = async (chapterId, updates) => {
  // Process each update in a transaction
  await db.transaction(async (trx) => {
    for (const update of updates) {
      const { packageId, clusterId, isActive } = update;
      
      // First, remove any existing mapping for this package-cluster combination
      await trx("cluster_package_mapping")
        .where({ packageId, clusterId })
        .delete();
      
      // If isActive is true, insert the new mapping
      if (isActive) {
        await trx("cluster_package_mapping").insert({
          packageId,
          clusterId,
          isActive: true
        });
      }
    }
  });
};

const getPackageMappings = async (chapterId, termId) => {
  return db("cluster_package_mapping as cpm")
    .join("packages as p", "cpm.packageId", "p.packageId")
    .join("term as t", "p.termId", "t.termId")
    .where({
      "t.chapterId": chapterId,
      "t.termId": termId,
      "cpm.isActive": true
    })
    .select("cpm.*");
};

module.exports = {
  getClustersByChapterSlug,
  getClusterById,
  createCluster,
  updateCluster,
  deleteCluster,
  getClusterMembers,
  searchChapterMembers,    // Added this export
  addMemberToCluster,
  removeMemberFromCluster,
  getClusterPackages,
  addPackageToCluster,
  removePackageFromCluster,
  bulkUpdateMembers,
  bulkUpdatePackages,
  getPackageMappings
};
