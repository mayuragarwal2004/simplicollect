const express = require("express");
const router = express.Router();
const broadcastController = require("../controller/broadcastController");

// Get member dues for broadcast
router.get("/:chapterId/dues-broadcast", broadcastController.getDuesBroadcastList);

// Send payment due notifications
router.post("/:chapterId/send-dues-notification", broadcastController.sendDuesNotification);

module.exports = router;