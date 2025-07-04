const express = require('express');
const router = express.Router();
const contactController = require('../controller/contactController');
const { authenticateToken, AuthenticateAdmin } = require('../../middlewares/authMiddleware');

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'contact-service',
    timestamp: new Date().toISOString()
  });
});

// Public routes
/**
 * @route POST /api/contact/submit
 * @desc Submit a new contact query (public endpoint - no auth required)
 * @access Public
 */
router.post('/submit', contactController.submitContactQuery);

// Authenticated user routes
/**
 * @route GET /api/contact/my-queries
 * @desc Get user's own contact queries
 * @access Private (Authenticated users)
 */
router.get('/my-queries', authenticateToken, contactController.getMyQueries);

// Admin routes
/**
 * @route GET /api/contact/queries
 * @desc Get all contact queries with filters and pagination
 * @access Private (Admin only)
 */
router.get('/queries', authenticateToken, AuthenticateAdmin, contactController.getContactQueries);

/**
 * @route GET /api/contact/queries/:queryId
 * @desc Get single contact query by ID
 * @access Private (Admin only)
 */
router.get('/queries/:queryId', authenticateToken, AuthenticateAdmin, contactController.getContactQuery);

/**
 * @route PATCH /api/contact/queries/:queryId/status
 * @desc Update contact query status
 * @access Private (Admin only)
 */
router.patch('/queries/:queryId/status', authenticateToken, AuthenticateAdmin, contactController.updateContactQueryStatus);

/**
 * @route PATCH /api/contact/queries/:queryId/assign
 * @desc Assign contact query to a team member
 * @access Private (Admin only)
 */
router.patch('/queries/:queryId/assign', authenticateToken, AuthenticateAdmin, contactController.assignContactQuery);

/**
 * @route PATCH /api/contact/queries/:queryId/notes
 * @desc Add or update admin notes for a contact query
 * @access Private (Admin only)
 */
router.patch('/queries/:queryId/notes', authenticateToken, AuthenticateAdmin, contactController.addAdminNotes);

/**
 * @route POST /api/contact/queries/:queryId/response
 * @desc Add response message to a contact query
 * @access Private (Admin only)
 */
router.post('/queries/:queryId/response', authenticateToken, AuthenticateAdmin, contactController.addResponseMessage);

/**
 * @route GET /api/contact/queries/:queryId/history
 * @desc Get contact query history/audit trail
 * @access Private (Admin only)
 */
router.get('/queries/:queryId/history', authenticateToken, AuthenticateAdmin, contactController.getContactQueryHistory);

/**
 * @route GET /api/contact/stats
 * @desc Get contact query statistics and analytics
 * @access Private (Admin only)
 */
router.get('/stats', authenticateToken, AuthenticateAdmin, contactController.getContactQueryStats);

/**
 * @route DELETE /api/contact/queries/:queryId/spam
 * @desc Mark contact query as spam
 * @access Private (Admin only)
 */
router.delete('/queries/:queryId/spam', authenticateToken, AuthenticateAdmin, contactController.markAsSpam);

module.exports = router;
