const db = require('../../../config/db');
const { v4: uuidv4 } = require('uuid');

// Create a new contact query
const createContactQuery = async (queryData) => {
  const {
    name,
    email,
    phoneNumber = null,
    subject,
    message,
    category = 'general',
    priority = 'medium',
    submittedBy = null,
    ipAddress = null,
    userAgent = null,
    source = 'web'
  } = queryData;

  const queryId = uuidv4();
  
  const contactRecord = {
    queryId,
    name,
    email,
    phoneNumber,
    subject,
    message,
    category,
    priority,
    submittedBy,
    ipAddress,
    userAgent,
    source,
    status: 'pending'
  };

  await db('contact_queries').insert(contactRecord);
  return { queryId, ...contactRecord };
};

// Get contact queries with filters and pagination
const getContactQueries = async (options = {}) => {
  const { 
    limit = 50, 
    offset = 0, 
    status = null, 
    category = null,
    priority = null,
    assignedTo = null,
    search = null,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;
  
  let query = db('contact_queries as cq')
    .leftJoin('members as sb', 'cq.submittedBy', 'sb.memberId')
    .leftJoin('members as at', 'cq.assignedTo', 'at.memberId')
    .select(
      'cq.*',
      db.raw('CONCAT(sb.firstName, " ", sb.lastName) as submittedByName'),
      'sb.email as submittedByEmail',
      db.raw('CONCAT(at.firstName, " ", at.lastName) as assignedToName'),
      'at.email as assignedToEmail'
    );

  // Apply filters
  if (status) {
    if (Array.isArray(status)) {
      query = query.whereIn('cq.status', status);
    } else {
      query = query.where('cq.status', status);
    }
  }
  
  if (category) {
    query = query.where('cq.category', category);
  }
  
  if (priority) {
    query = query.where('cq.priority', priority);
  }
  
  if (assignedTo) {
    query = query.where('cq.assignedTo', assignedTo);
  }
  
  if (search) {
    query = query.where(function() {
      this.where('cq.subject', 'like', `%${search}%`)
        .orWhere('cq.message', 'like', `%${search}%`)
        .orWhere('cq.name', 'like', `%${search}%`)
        .orWhere('cq.email', 'like', `%${search}%`);
    });
  }

  // Apply sorting
  const validSortColumns = ['createdAt', 'updatedAt', 'priority', 'status', 'name', 'subject'];
  const validSortOrders = ['asc', 'desc'];
  
  if (validSortColumns.includes(sortBy) && validSortOrders.includes(sortOrder)) {
    query = query.orderBy(`cq.${sortBy}`, sortOrder);
  } else {
    query = query.orderBy('cq.createdAt', 'desc');
  }

  // Apply pagination
  query = query.limit(limit).offset(offset);

  return await query;
};

// Get a single contact query by ID
const getContactQueryById = async (queryId) => {
  return await db('contact_queries as cq')
    .leftJoin('members as sb', 'cq.submittedBy', 'sb.memberId')
    .leftJoin('members as at', 'cq.assignedTo', 'at.memberId')
    .select(
      'cq.*',
      db.raw('CONCAT(sb.firstName, " ", sb.lastName) as submittedByName'),
      'sb.email as submittedByEmail',
      db.raw('CONCAT(at.firstName, " ", at.lastName) as assignedToName'),
      'at.email as assignedToEmail'
    )
    .where('cq.queryId', queryId)
    .first();
};

// Update contact query status
const updateContactQueryStatus = async (queryId, status, performedBy = null, notes = null) => {
  const query = await getContactQueryById(queryId);
  if (!query) {
    throw new Error('Contact query not found');
  }

  const oldStatus = query.status;
  const updateData = { 
    status,
    updatedAt: new Date()
  };

  // Set resolvedAt timestamp if marking as resolved
  if (status === 'resolved' && oldStatus !== 'resolved') {
    updateData.resolvedAt = new Date();
  }

  await db('contact_queries').where('queryId', queryId).update(updateData);

  // Record history
  await addContactQueryHistory({
    queryId,
    action: 'status_change',
    oldValue: oldStatus,
    newValue: status,
    performedBy,
    notes
  });

  return await getContactQueryById(queryId);
};

// Assign contact query to a member
const assignContactQuery = async (queryId, assignedTo, performedBy = null, notes = null) => {
  const query = await getContactQueryById(queryId);
  if (!query) {
    throw new Error('Contact query not found');
  }

  const oldAssignedTo = query.assignedTo;
  
  await db('contact_queries')
    .where('queryId', queryId)
    .update({ 
      assignedTo,
      updatedAt: new Date()
    });

  // Record history
  await addContactQueryHistory({
    queryId,
    action: 'assigned',
    oldValue: oldAssignedTo,
    newValue: assignedTo,
    performedBy,
    notes
  });

  return await getContactQueryById(queryId);
};

// Add admin notes to contact query
const addAdminNotes = async (queryId, adminNotes, performedBy = null) => {
  const query = await getContactQueryById(queryId);
  if (!query) {
    throw new Error('Contact query not found');
  }

  const oldNotes = query.adminNotes;
  
  await db('contact_queries')
    .where('queryId', queryId)
    .update({ 
      adminNotes,
      updatedAt: new Date()
    });

  // Record history
  await addContactQueryHistory({
    queryId,
    action: 'note_added',
    oldValue: oldNotes,
    newValue: adminNotes,
    performedBy,
    notes: 'Admin notes updated'
  });

  return await getContactQueryById(queryId);
};

// Add response message
const addResponseMessage = async (queryId, responseMessage, performedBy = null) => {
  const query = await getContactQueryById(queryId);
  if (!query) {
    throw new Error('Contact query not found');
  }

  await db('contact_queries')
    .where('queryId', queryId)
    .update({ 
      responseMessage,
      updatedAt: new Date()
    });

  // Record history
  await addContactQueryHistory({
    queryId,
    action: 'response_sent',
    oldValue: null,
    newValue: responseMessage,
    performedBy,
    notes: 'Response message added'
  });

  return await getContactQueryById(queryId);
};

// Add contact query history entry
const addContactQueryHistory = async (historyData) => {
  const {
    queryId,
    action,
    oldValue = null,
    newValue = null,
    performedBy = null,
    notes = null
  } = historyData;

  const historyId = uuidv4();
  
  const historyRecord = {
    historyId,
    queryId,
    action,
    oldValue,
    newValue,
    performedBy,
    notes
  };

  await db('contact_query_history').insert(historyRecord);
  return historyRecord;
};

// Get contact query history
const getContactQueryHistory = async (queryId) => {
  return await db('contact_query_history as ch')
    .leftJoin('members as m', 'ch.performedBy', 'm.memberId')
    .select(
      'ch.*',
      db.raw('CONCAT(m.firstName, " ", m.lastName) as performedByName'),
      'm.email as performedByEmail'
    )
    .where('ch.queryId', queryId)
    .orderBy('ch.createdAt', 'desc');
};

// Get contact queries statistics
const getContactQueryStats = async () => {
  const stats = await db('contact_queries')
    .select(
      db.raw('COUNT(*) as total'),
      db.raw('COUNT(CASE WHEN status = "pending" THEN 1 END) as pending'),
      db.raw('COUNT(CASE WHEN status = "under_review" THEN 1 END) as underReview'),
      db.raw('COUNT(CASE WHEN status = "resolved" THEN 1 END) as resolved'),
      db.raw('COUNT(CASE WHEN status = "closed" THEN 1 END) as closed'),
      db.raw('COUNT(CASE WHEN priority = "high" OR priority = "urgent" THEN 1 END) as highPriority'),
      db.raw('COUNT(CASE WHEN createdAt >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END) as todayCount'),
      db.raw('COUNT(CASE WHEN createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as weekCount')
    )
    .first();

  // Get category breakdown
  const categoryStats = await db('contact_queries')
    .select('category', db.raw('COUNT(*) as count'))
    .groupBy('category')
    .orderBy('count', 'desc');

  return {
    ...stats,
    categoryBreakdown: categoryStats
  };
};

// Check for potential spam (rate limiting)
const checkSpamPrevention = async (email, ipAddress, timeWindow = 60) => {
  const cutoff = new Date(Date.now() - timeWindow * 60 * 1000);
  
  const recentQueries = await db('contact_queries')
    .where(function() {
      this.where('email', email).orWhere('ipAddress', ipAddress);
    })
    .where('createdAt', '>=', cutoff)
    .count('* as count')
    .first();

  return {
    count: recentQueries.count,
    isSpam: recentQueries.count > 3 // Allow max 3 queries per hour from same email/IP
  };
};

// Mark as spam
const markAsSpam = async (queryId, performedBy = null) => {
  await db('contact_queries')
    .where('queryId', queryId)
    .update({ 
      isSpam: 1,
      status: 'closed',
      updatedAt: new Date()
    });

  // Record history
  await addContactQueryHistory({
    queryId,
    action: 'marked_spam',
    oldValue: '0',
    newValue: '1',
    performedBy,
    notes: 'Marked as spam'
  });

  return true;
};

// Delete contact query (soft delete by marking as spam)
const deleteContactQuery = async (queryId, performedBy = null) => {
  return await markAsSpam(queryId, performedBy);
};

module.exports = {
  createContactQuery,
  getContactQueries,
  getContactQueryById,
  updateContactQueryStatus,
  assignContactQuery,
  addAdminNotes,
  addResponseMessage,
  addContactQueryHistory,
  getContactQueryHistory,
  getContactQueryStats,
  checkSpamPrevention,
  markAsSpam,
  deleteContactQuery
};
