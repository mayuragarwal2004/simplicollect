const express = require("express");
const router = express.Router();
const rightsController = require("../controllers/rightsControllers");

router.get("/sidebar", rightsController.getSidebarRightsController);

module.exports = router;