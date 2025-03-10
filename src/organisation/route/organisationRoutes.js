const express = require("express");
const router = express.Router();
const organisationController = require("../controller/organisationController");

// Get all organisations
router.get("/", organisationController.getAllOrganisations);

// Get organisation by ID
router.get("/:organisationId", organisationController.getOrganisationById);

// Create new organisation
router.post("/", organisationController.createOrganisation);

// Update organisation
router.put("/:organisationId", organisationController.updateOrganisation);

// Delete organisation
router.delete("/:organisationId", organisationController.deleteOrganisation);

module.exports = router; 