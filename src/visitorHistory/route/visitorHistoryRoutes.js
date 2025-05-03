const express=require("express");
const router=express.Router();
const visitorHistoryController=require("../controller/visitorHistoryController");
const { authenticateToken } = require("../../middlewares/authMiddleware");

// Route to add history for a visitor
router.post("/addHistory/:visitorId",  visitorHistoryController.addHistory);
router.get("/getHistory/:visitorId",  visitorHistoryController.getHistoryByVisitorId);
router.put("/updateHistory/:visitorId/:historyId",  visitorHistoryController.updateHistory);
router.delete("/deleteHistory/:visitorId/:historyId", visitorHistoryController.deleteHistory);
router.get("/getHistoryById/:historyId", visitorHistoryController.getHistoryById);

module.exports=router;