const contactService = require('../service/contactService');

// Submit a new contact query (public endpoint)
const submitContactQuery = async (req, res) => {
  try {
    const { name, email, phoneNumber, subject, message, category } = req.body;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Extract request info
    const requestInfo = {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      submittedBy: req.user ? req.user.memberId : null,
      source: req.body.source || 'web'
    };

    const queryData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phoneNumber: phoneNumber ? phoneNumber.trim() : null,
      subject: subject.trim(),
      message: message.trim(),
      category: category || 'general',
      priority: req.body.priority || 'medium'
    };

    const contactQuery = await contactService.submitContactQuery(queryData, requestInfo);

    res.status(201).json({
      success: true,
      message: 'Your query has been submitted successfully. We will get back to you soon.',
      data: {
        queryId: contactQuery.queryId,
        referenceId: contactQuery.queryId.substring(0, 8),
        status: contactQuery.status,
        submittedAt: contactQuery.createdAt
      }
    });
  } catch (error) {
    console.error('Error submitting contact query:', error);
    
    if (error.message.includes('Too many queries')) {
      return res.status(429).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to submit your query. Please try again later.'
    });
  }
};

// Get contact queries (admin endpoint)
const getContactQueries = async (req, res) => {
  try {
    const {
      page = 0,
      limit = 20,
      status,
      category,
      priority,
      assignedTo,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const options = {
      limit: parseInt(limit),
      offset: parseInt(page) * parseInt(limit),
      status: status ? (Array.isArray(status) ? status : [status]) : null,
      category,
      priority,
      assignedTo,
      search,
      sortBy,
      sortOrder
    };

    const queries = await contactService.getContactQueries(options);

    res.json({
      success: true,
      data: queries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: queries.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching contact queries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact queries'
    });
  }
};

// Get single contact query (admin endpoint)
const getContactQuery = async (req, res) => {
  try {
    const { queryId } = req.params;
    
    const query = await contactService.getContactQuery(queryId);
    
    res.json({
      success: true,
      data: query
    });
  } catch (error) {
    console.error('Error fetching contact query:', error);
    
    if (error.message === 'Contact query not found') {
      return res.status(404).json({
        success: false,
        message: 'Contact query not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact query'
    });
  }
};

// Update contact query status (admin endpoint)
const updateContactQueryStatus = async (req, res) => {
  try {
    const { queryId } = req.params;
    const { status, notes } = req.body;
    const { memberId } = req.user;
    
    // Validate status
    const validStatuses = ['pending', 'under_review', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const updatedQuery = await contactService.updateContactQueryStatus(
      queryId,
      status,
      memberId,
      notes
    );

    res.json({
      success: true,
      message: 'Contact query status updated successfully',
      data: updatedQuery
    });
  } catch (error) {
    console.error('Error updating contact query status:', error);
    
    if (error.message === 'Contact query not found') {
      return res.status(404).json({
        success: false,
        message: 'Contact query not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update contact query status'
    });
  }
};

// Assign contact query (admin endpoint)
const assignContactQuery = async (req, res) => {
  try {
    const { queryId } = req.params;
    const { assignedTo, notes } = req.body;
    const { memberId } = req.user;

    const updatedQuery = await contactService.assignContactQuery(
      queryId,
      assignedTo,
      memberId,
      notes
    );

    res.json({
      success: true,
      message: 'Contact query assigned successfully',
      data: updatedQuery
    });
  } catch (error) {
    console.error('Error assigning contact query:', error);
    
    if (error.message === 'Contact query not found') {
      return res.status(404).json({
        success: false,
        message: 'Contact query not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to assign contact query'
    });
  }
};

// Add admin notes (admin endpoint)
const addAdminNotes = async (req, res) => {
  try {
    const { queryId } = req.params;
    const { adminNotes } = req.body;
    const { memberId } = req.user;

    if (!adminNotes || adminNotes.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Admin notes cannot be empty'
      });
    }

    const updatedQuery = await contactService.addAdminNotes(
      queryId,
      adminNotes.trim(),
      memberId
    );

    res.json({
      success: true,
      message: 'Admin notes added successfully',
      data: updatedQuery
    });
  } catch (error) {
    console.error('Error adding admin notes:', error);
    
    if (error.message === 'Contact query not found') {
      return res.status(404).json({
        success: false,
        message: 'Contact query not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to add admin notes'
    });
  }
};

// Add response message (admin endpoint)
const addResponseMessage = async (req, res) => {
  try {
    const { queryId } = req.params;
    const { responseMessage } = req.body;
    const { memberId } = req.user;

    if (!responseMessage || responseMessage.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Response message cannot be empty'
      });
    }

    const updatedQuery = await contactService.addResponseMessage(
      queryId,
      responseMessage.trim(),
      memberId
    );

    res.json({
      success: true,
      message: 'Response sent successfully',
      data: updatedQuery
    });
  } catch (error) {
    console.error('Error adding response message:', error);
    
    if (error.message === 'Contact query not found') {
      return res.status(404).json({
        success: false,
        message: 'Contact query not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to send response'
    });
  }
};

// Get contact query history (admin endpoint)
const getContactQueryHistory = async (req, res) => {
  try {
    const { queryId } = req.params;
    
    const history = await contactService.getContactQueryHistory(queryId);
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error fetching contact query history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact query history'
    });
  }
};

// Get contact query statistics (admin endpoint)
const getContactQueryStats = async (req, res) => {
  try {
    const stats = await contactService.getContactQueryStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching contact query stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact query statistics'
    });
  }
};

// Mark query as spam (admin endpoint)
const markAsSpam = async (req, res) => {
  try {
    const { queryId } = req.params;
    const { memberId } = req.user;

    const result = await contactService.markAsSpam(queryId, memberId);

    res.json({
      success: true,
      message: 'Contact query marked as spam successfully'
    });
  } catch (error) {
    console.error('Error marking query as spam:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark query as spam'
    });
  }
};

// Get user's own queries (authenticated user endpoint)
const getMyQueries = async (req, res) => {
  try {
    const { memberId } = req.user;
    const { page = 0, limit = 10, status } = req.query;

    const options = {
      limit: parseInt(limit),
      offset: parseInt(page) * parseInt(limit),
      submittedBy: memberId,
      status: status || null,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };

    // Use a different query for user's own queries
    const db = require('../../../config/db');
    const queries = await db('contact_queries')
      .where('submittedBy', memberId)
      .modify(function(queryBuilder) {
        if (status) {
          queryBuilder.where('status', status);
        }
      })
      .select('queryId', 'subject', 'category', 'priority', 'status', 'responseMessage', 'createdAt', 'updatedAt', 'resolvedAt')
      .orderBy('createdAt', 'desc')
      .limit(options.limit)
      .offset(options.offset);

    res.json({
      success: true,
      data: queries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: queries.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user queries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your queries'
    });
  }
};

module.exports = {
  submitContactQuery,
  getContactQueries,
  getContactQuery,
  updateContactQueryStatus,
  assignContactQuery,
  addAdminNotes,
  addResponseMessage,
  getContactQueryHistory,
  getContactQueryStats,
  markAsSpam,
  getMyQueries
};
