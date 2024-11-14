const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');

// Route to check if a visitor exists
router.get('/checkVisitor', visitorController.checkVisitor);

// Route to add a new visitor
router.post('/addVisitor', visitorController.addVisitor);

// Route to add feedback for a visitor
router.post('/addFeedback', visitorController.addFeedback);

// Route to verify visitor link
router.get('/verifyVisitorLink/:chapterSlug', visitorController.verifyVisitorLink);

module.exports = router;
