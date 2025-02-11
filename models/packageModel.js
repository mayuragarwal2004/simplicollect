// models/packageModel.js
const db = require("../config/db");

const getPackageById = async (packageId) => {
    return db("packages")
        .where("packageId", packageId)
        .select("*");
}

const getPackagesByParentType = async (parentType) => {
    return db("packages")
        .where("packageParent", parentType) // Ensure the column name matches your database schema
        .select("*");
};
const getAllPackages = async () => {
    return db("packages")
        .select("*");
}

module.exports = {
    getPackageById,
    getAllPackages,
    getPackagesByParentType,
};
