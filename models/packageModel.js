// models/packageModel.js
const db = require("../config/db");

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
    .select("t.*", "p.*");
};

module.exports = {
  getPackageById,
  getAllPackages,
  getPackagesByParentType,
};
