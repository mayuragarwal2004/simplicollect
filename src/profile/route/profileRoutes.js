const express = require('express');
const router = express.Router();
const memberController = require('../controller/profileControllers');

router.put('/:memberId/name', memberController.updateName);

router.put('/:memberId/email', memberController.updateEmail);

router.put('/:memberId/phone', memberController.updatePhone);

router.put('/:memberId/password', memberController.updatePassword);
module.exports = router;