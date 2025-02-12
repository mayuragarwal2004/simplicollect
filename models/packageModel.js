// models/packageModel.js
const db = require("../config/db");

const getPackageById = async (packageId) => {
  return db("packages")
    .where("packageId", packageId)
    .leftJoin("transactions", "packages.packageId", "transactions.packageId")
    .select("*");
};

const getPackagesByParentType = async (parentType) => {
  return db("packages")
    .where("packageParent", parentType)
    .leftJoin("transactions", "packages.packageId", "transactions.packageId")
    .select("*");
};
const getAllPackages = async () => {
  return db("packages")
    .leftJoin("transactions", "packages.packageId", "transactions.packageId")
    .select("*");
};

module.exports = {
  getPackageById,
  getAllPackages,
  getPackagesByParentType,
};
