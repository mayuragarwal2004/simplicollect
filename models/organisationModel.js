const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");


const getAllOrganisationsWithChapterCount = async () => {
  return db("organisations")
    .leftJoin("chapters", "organisations.organisationId", "chapters.organisationId")
    .select(
      "organisations.organisationId",
      "organisations.organisationName"
    )
    .count("chapters.chapterId as numberOfChapters")
    .groupBy("organisations.organisationId", "organisations.organisationName");
};




const getOrganisationById = async (organisationId) => {
  return db("organisations")
    .where({ organisationId })
    .first();
};

const createOrganisation = async (organisationData) => {
  const organisationId = uuidv4();
  const newOrg = {
    organisationId,
    organisationName: organisationData.organisationName,
  };
  
  await db("organisations").insert(newOrg);
  return newOrg;
};

const updateOrganisation = async (organisationId, organisationData) => {
  const updateData = {
    organisationName: organisationData.organisationName,
  };
  
  await db("organisations")
    .where({ organisationId })
    .update(updateData);
    
  return { organisationId, ...updateData };
};

const deleteOrganisation = async (organisationId) => {
  return db("organisations")
    .where({ organisationId })
    .del();
};

module.exports = {
  getAllOrganisationsWithChapterCount,
  getOrganisationById,
  createOrganisation,
  updateOrganisation,
  deleteOrganisation
}; 