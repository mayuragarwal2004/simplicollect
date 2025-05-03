const db = require("../../config/db");
const { v4: uuidv4 } = require("uuid");


const getAllOrganisationsWithChapterCount = async (rows, page) => {
  console.log("rows", rows);
  console.log("page", page);
    const organisations = await db("organisations")
    .leftJoin("chapters", "organisations.organisationId", "chapters.organisationId")
    .select(
      "organisations.organisationId",
      "organisations.organisationName"
    )
    .count("chapters.chapterId as numberOfChapters")
    .groupBy("organisations.organisationId", "organisations.organisationName")
    .limit(rows)
    .offset((page) * rows);

  const totalRecords = await db("organisations").count("* as totalRecords").first();
  
  return {
    data: organisations,
    ...totalRecords,
  };
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

const getAllOrganisations = async () => {
  return db("organisations").select("*");
};

module.exports = {
  getAllOrganisationsWithChapterCount,
  getOrganisationById,
  createOrganisation,
  updateOrganisation,
  deleteOrganisation,
  getAllOrganisations,
}; 