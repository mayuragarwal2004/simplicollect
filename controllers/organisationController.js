const organisationModel = require("../models/organisationModel");

const getAllOrganisations = async (req, res) => {
  const {rows,page} = req.query;
  try {
    const organisations = await organisationModel.getAllOrganisationsWithChapterCount(rows,page);
    res.json(organisations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrganisationById = async (req, res) => {
  try {
    const { organisationId } = req.params;
    const organisation = await organisationModel.getOrganisationById(organisationId);
    
    if (!organisation) {
      return res.status(404).json({ message: "Organisation not found" });
    }
    
    res.json(organisation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createOrganisation = async (req, res) => {
  try {
    const organisationData = req.body;
    
    // Validate required fields
    if (!organisationData.organisationName) {
      return res.status(400).json({ error: "Organisation name is required" });
    }
    
    // Create the organisation
    const newOrganisation = await organisationModel.createOrganisation(organisationData);
    
    res.status(201).json(newOrganisation);
  } catch (error) {
    console.error('Error creating organisation:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateOrganisation = async (req, res) => {
  try {
    const { organisationId } = req.params;
    const organisationData = req.body;
    
    // Validate required fields
    if (!organisationData.organisationName) {
      return res.status(400).json({ error: "Organisation name is required" });
    }
    
    const organisation = await organisationModel.getOrganisationById(organisationId);
    if (!organisation) {
      return res.status(404).json({ message: "Organisation not found" });
    }
    
    const updatedOrganisation = await organisationModel.updateOrganisation(organisationId, organisationData);
    res.json(updatedOrganisation);
  } catch (error) {
    console.error('Error updating organisation:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteOrganisation = async (req, res) => {
  try {
    const { organisationId } = req.params;
    
    const organisation = await organisationModel.getOrganisationById(organisationId);
    if (!organisation) {
      return res.status(404).json({ message: "Organisation not found" });
    }
    
    await organisationModel.deleteOrganisation(organisationId);
    res.json({ message: "Organisation deleted successfully" });
  } catch (error) {
    console.error('Error deleting organisation:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllOrganisations,
  getOrganisationById,
  createOrganisation,
  updateOrganisation,
  deleteOrganisation
}; 