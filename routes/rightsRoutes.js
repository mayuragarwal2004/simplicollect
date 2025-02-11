const express = require("express");
const router = express.Router();
const rightsController = require("../controllers/rightsControllers");

router.get("/", rightsController.getAllRightsController);

module.exports = router;