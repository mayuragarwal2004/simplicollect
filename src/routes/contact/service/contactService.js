/**
 * Contact Service
 * 
 * Admin Notification Configuration:
 * - ADMIN_NOTIFICATION_TYPE: "all" (notify all admins from database) or "specific" (notify specific admins from env)
 * - SPECIFIC_ADMIN_EMAILS: Comma-separated list of admin emails (used when ADMIN_NOTIFICATION_TYPE=specific)
 * - ADMIN_EMAIL: Primary admin email for direct notifications
 */

const contactModel = require('../model/contactModel');
const { sendEMail } = require('../../../config/smtp');
const notificationService = require('../../notification/service/notificationService');

// Submit a new contact query
const submitContactQuery = async (queryData, requestInfo = {}) => {
  try {
    // Extract request info
    const { ipAddress, userAgent, submittedBy } = requestInfo;
    
    // Check for spam prevention
    const spamCheck = await contactModel.checkSpamPrevention(
      queryData.email, 
      ipAddress
    );
    
    if (spamCheck.isSpam) {
      throw new Error('Too many queries submitted. Please wait before submitting again.');
    }

    // Create the contact query
    const contactQuery = await contactModel.createContactQuery({
      ...queryData,
      submittedBy,
      ipAddress,
      userAgent,
      source: requestInfo.source || 'web'
    });

    // Send emails asynchronously (don't wait for completion)
    // This ensures user gets immediate feedback while emails are sent in background
    setImmediate(async () => {
      try {
        // Send confirmation email to user
        await sendConfirmationEmail(contactQuery);
        console.log(`Confirmation email sent for query ${contactQuery.queryId}`);
      } catch (emailError) {
        console.error(`Error sending confirmation email for query ${contactQuery.queryId}:`, emailError);
      }

      try {
        // Notify admins about new query
        await notifyAdminsNewQuery(contactQuery);
        console.log(`Admin notifications sent for query ${contactQuery.queryId}`);
      } catch (notifyError) {
        console.error(`Error sending admin notifications for query ${contactQuery.queryId}:`, notifyError);
      }
    });

    return contactQuery;
  } catch (error) {
    console.error('Error submitting contact query:', error);
    throw error;
  }
};

// Send confirmation email to user
const sendConfirmationEmail = async (contactQuery) => {
  try {
    const emailContent = {
      to: contactQuery.email,
      subject: `Query Received - ${contactQuery.subject} (Ref: ${contactQuery.queryId.substring(0, 8)})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">SimpliCollect</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0;">Query Confirmation</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Thank you for contacting us!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Dear ${contactQuery.name},
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              We have received your query and our team will review it shortly. Here are the details:
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <p style="margin: 0 0 10px 0;"><strong>Reference ID:</strong> ${contactQuery.queryId.substring(0, 8)}</p>
              <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${contactQuery.subject}</p>
              <p style="margin: 0 0 10px 0;"><strong>Category:</strong> ${contactQuery.category}</p>
              <p style="margin: 0 0 10px 0;"><strong>Priority:</strong> ${contactQuery.priority}</p>
              <p style="margin: 0;"><strong>Submitted:</strong> ${new Date(contactQuery.createdAt).toLocaleString()}</p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Our support team typically responds within 24-48 hours during business days. 
              You can reference your query using the ID: <strong>${contactQuery.queryId.substring(0, 8)}</strong>
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'https://your-domain.com'}" 
                 style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Visit SimpliCollect
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; line-height: 1.4;">
              If you have any urgent concerns, please call us at ${process.env.SUPPORT_PHONE || '+91-XXXXXXXXXX'} 
              or email us at ${process.env.SUPPORT_EMAIL || 'support@simplicollect.in'}.
            </p>
          </div>
          
          <div style="background: #333; color: #ccc; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2024 SimpliCollect. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">This is an automated confirmation email.</p>
          </div>
        </div>
      `
    };

    await sendEMail(emailContent);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    // Don't throw error as this shouldn't fail the query submission
  }
};

// Notify admins about new query
const notifyAdminsNewQuery = async (contactQuery) => {
  try {
    const notificationType = process.env.ADMIN_NOTIFICATION_TYPE || 'all';
    
    if (notificationType === 'specific') {
      // Notify specific admins from environment variable
      await notifySpecificAdmins(contactQuery);
    } else {
      // Notify all admins (default behavior)
      await notifyAllAdmins(contactQuery);
    }

    // Send email to primary admin email if configured
    if (process.env.ADMIN_EMAIL) {
      await sendAdminNotificationEmail(contactQuery);
    }
  } catch (error) {
    console.error('Error notifying admins about new query:', error);
    // Don't throw error as this shouldn't fail the query submission
  }
};

// Notify all admins from database
const notifyAllAdmins = async (contactQuery) => {
  try {
    // Get admin users from database
    const db = require('../../../config/db');
    const admins = await db('members')
      .where('superAdmin', 1)   // Or any other admin identification
      .select('memberId', 'email', 'firstName', 'lastName');

    if (admins.length === 0) {
      console.log('No admins found in database to notify about new contact query');
      return;
    }

    console.log(`Notifying ${admins.length} admins from database about new contact query`);

    // Send notification to each admin
    for (const admin of admins) {
      try {
        await notificationService.sendNotification({
          title: 'New Contact Query Received',
          message: `${contactQuery.name} submitted a new query: "${contactQuery.subject}"`,
          type: 'info',
          priority: contactQuery.priority === 'urgent' ? 'high' : 'medium',
          recipientId: admin.memberId,
          relatedEntityType: 'contact_query',
          relatedEntityId: contactQuery.queryId
        });
      } catch (notifError) {
        console.error(`Error sending notification to admin ${admin.memberId}:`, notifError);
      }
    }
  } catch (error) {
    console.error('Error notifying all admins:', error);
  }
};

// Notify specific admins from environment variable
const notifySpecificAdmins = async (contactQuery) => {
  try {
    const specificAdminEmails = process.env.SPECIFIC_ADMIN_EMAILS;
    console.log({specificAdminEmails});
    
    
    if (!specificAdminEmails) {
      console.log('SPECIFIC_ADMIN_EMAILS not configured, falling back to notify all admins');
      await notifyAllAdmins(contactQuery);
      return;
    }

    // Parse comma-separated emails
    const adminEmails = specificAdminEmails
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);

    if (adminEmails.length === 0) {
      console.log('No valid admin emails found in SPECIFIC_ADMIN_EMAILS, falling back to notify all admins');
      await notifyAllAdmins(contactQuery);
      return;
    }

    console.log(`Notifying ${adminEmails.length} specific admins from environment config about new contact query`);

    // Get admin details from database based on emails
    const db = require('../../../config/db');
    const admins = await db('members')
      .whereIn('email', adminEmails)
      .select('memberId', 'email', 'firstName', 'lastName');

    // Send notifications to found admins
    for (const admin of admins) {
      try {
        await notificationService.sendNotification({
          title: 'New Contact Query Received',
          message: `${contactQuery.name} submitted a new query: "${contactQuery.subject}"`,
          type: 'info',
          priority: contactQuery.priority === 'urgent' ? 'high' : 'medium',
          recipientId: admin.memberId,
          relatedEntityType: 'contact_query',
          relatedEntityId: contactQuery.queryId
        });
      } catch (notifError) {
        console.error(`Error sending notification to admin ${admin.memberId}:`, notifError);
      }
    }

    // Log if some emails weren't found in the database
    const foundEmails = admins.map(admin => admin.email);
    const notFoundEmails = adminEmails.filter(email => !foundEmails.includes(email));
    
    if (notFoundEmails.length > 0) {
      console.warn(`Warning: The following admin emails from SPECIFIC_ADMIN_EMAILS were not found in the database: ${notFoundEmails.join(', ')}`);
    }

    // Send email notifications to all specified emails (even if not in database)
    for (const email of adminEmails) {
      try {
        await sendSpecificAdminNotificationEmail(contactQuery, email);
      } catch (emailError) {
        console.error(`Error sending email notification to ${email}:`, emailError);
      }
    }

  } catch (error) {
    console.error('Error notifying specific admins:', error);
    // Fallback to notify all admins if specific notification fails
    console.log('Falling back to notify all admins due to error');
    await notifyAllAdmins(contactQuery);
  }
};

// Send email notification to specific admin
const sendSpecificAdminNotificationEmail = async (contactQuery, adminEmail) => {
  try {
    const emailContent = {
      to: adminEmail,
      subject: `New Contact Query: ${contactQuery.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc3545; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Contact Query Alert</h1>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <h3>Query Details:</h3>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Reference ID:</strong> ${contactQuery.queryId}</p>
              <p><strong>Name:</strong> ${contactQuery.name}</p>
              <p><strong>Email:</strong> ${contactQuery.email}</p>
              <p><strong>Phone:</strong> ${contactQuery.phoneNumber || 'Not provided'}</p>
              <p><strong>Subject:</strong> ${contactQuery.subject}</p>
              <p><strong>Category:</strong> ${contactQuery.category}</p>
              <p><strong>Priority:</strong> ${contactQuery.priority}</p>
              <p><strong>Submitted:</strong> ${new Date(contactQuery.createdAt).toLocaleString()}</p>
            </div>
            
            <h4>Message:</h4>
            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #dc3545;">
              ${contactQuery.message.replace(/\n/g, '<br>')}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.ADMIN_PANEL_URL || process.env.FRONTEND_URL}/admin/contact-queries/${contactQuery.queryId}" 
                 style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View in Admin Panel
              </a>
            </div>
            
            <p style="font-size: 12px; color: #666; margin-top: 20px;">
              This notification was sent because your email is configured in the admin notification list.
            </p>
          </div>
        </div>
      `
    };

    await sendEMail(emailContent);
  } catch (error) {
    console.error('Error sending specific admin notification email:', error);
  }
};

// Send email notification to admin
const sendAdminNotificationEmail = async (contactQuery) => {
  try {
    const emailContent = {
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Query: ${contactQuery.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc3545; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Contact Query Alert</h1>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <h3>Query Details:</h3>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Reference ID:</strong> ${contactQuery.queryId}</p>
              <p><strong>Name:</strong> ${contactQuery.name}</p>
              <p><strong>Email:</strong> ${contactQuery.email}</p>
              <p><strong>Phone:</strong> ${contactQuery.phoneNumber || 'Not provided'}</p>
              <p><strong>Subject:</strong> ${contactQuery.subject}</p>
              <p><strong>Category:</strong> ${contactQuery.category}</p>
              <p><strong>Priority:</strong> ${contactQuery.priority}</p>
              <p><strong>Submitted:</strong> ${new Date(contactQuery.createdAt).toLocaleString()}</p>
            </div>
            
            <h4>Message:</h4>
            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #dc3545;">
              ${contactQuery.message.replace(/\n/g, '<br>')}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.ADMIN_PANEL_URL || process.env.FRONTEND_URL}/admin/contact-queries/${contactQuery.queryId}" 
                 style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View in Admin Panel
              </a>
            </div>
          </div>
        </div>
      `
    };

    await sendEMail(emailContent);
  } catch (error) {
    console.error('Error sending admin notification email:', error);
  }
};

// Get contact queries with filters (admin function)
const getContactQueries = async (filters = {}) => {
  try {
    return await contactModel.getContactQueries(filters);
  } catch (error) {
    console.error('Error fetching contact queries:', error);
    throw error;
  }
};

// Get single contact query
const getContactQuery = async (queryId) => {
  try {
    const query = await contactModel.getContactQueryById(queryId);
    if (!query) {
      throw new Error('Contact query not found');
    }
    return query;
  } catch (error) {
    console.error('Error fetching contact query:', error);
    throw error;
  }
};

// Update contact query status
const updateContactQueryStatus = async (queryId, status, performedBy, notes = null) => {
  try {
    const updatedQuery = await contactModel.updateContactQueryStatus(
      queryId, 
      status, 
      performedBy, 
      notes
    );

    // Send status update notification to user if they're a member
    if (updatedQuery.submittedBy) {
      await notificationService.sendNotification({
        title: 'Query Status Updated',
        message: `Your query "${updatedQuery.subject}" status has been updated to: ${status}`,
        type: 'info',
        priority: 'medium',
        recipientId: updatedQuery.submittedBy,
        relatedEntityType: 'contact_query',
        relatedEntityId: queryId
      });
    }

    return updatedQuery;
  } catch (error) {
    console.error('Error updating contact query status:', error);
    throw error;
  }
};

// Assign contact query to admin
const assignContactQuery = async (queryId, assignedTo, performedBy, notes = null) => {
  try {
    const updatedQuery = await contactModel.assignContactQuery(
      queryId, 
      assignedTo, 
      performedBy, 
      notes
    );

    // Notify assigned admin
    if (assignedTo) {
      await notificationService.sendNotification({
        title: 'Contact Query Assigned',
        message: `You have been assigned a contact query: "${updatedQuery.subject}"`,
        type: 'info',
        priority: updatedQuery.priority === 'urgent' ? 'high' : 'medium',
        recipientId: assignedTo,
        relatedEntityType: 'contact_query',
        relatedEntityId: queryId
      });
    }

    return updatedQuery;
  } catch (error) {
    console.error('Error assigning contact query:', error);
    throw error;
  }
};

// Add admin notes
const addAdminNotes = async (queryId, adminNotes, performedBy) => {
  try {
    return await contactModel.addAdminNotes(queryId, adminNotes, performedBy);
  } catch (error) {
    console.error('Error adding admin notes:', error);
    throw error;
  }
};

// Add response message
const addResponseMessage = async (queryId, responseMessage, performedBy) => {
  try {
    const updatedQuery = await contactModel.addResponseMessage(
      queryId, 
      responseMessage, 
      performedBy
    );

    // Send response email to user
    await sendResponseEmail(updatedQuery, responseMessage);

    // Send notification to user if they're a member
    if (updatedQuery.submittedBy) {
      await notificationService.sendNotification({
        title: 'Response to Your Query',
        message: `We have responded to your query: "${updatedQuery.subject}"`,
        type: 'info',
        priority: 'medium',
        recipientId: updatedQuery.submittedBy,
        relatedEntityType: 'contact_query',
        relatedEntityId: queryId
      });
    }

    return updatedQuery;
  } catch (error) {
    console.error('Error adding response message:', error);
    throw error;
  }
};

// Send response email to user
const sendResponseEmail = async (contactQuery, responseMessage) => {
  try {
    const emailContent = {
      to: contactQuery.email,
      subject: `Response to: ${contactQuery.subject} (Ref: ${contactQuery.queryId.substring(0, 8)})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">SimpliCollect</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0;">Response to Your Query</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">We have a response for you!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Dear ${contactQuery.name},
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <p style="margin: 0 0 10px 0;"><strong>Reference ID:</strong> ${contactQuery.queryId.substring(0, 8)}</p>
              <p style="margin: 0 0 10px 0;"><strong>Your Query:</strong> ${contactQuery.subject}</p>
              <p style="margin: 0;"><strong>Status:</strong> ${contactQuery.status}</p>
            </div>
            
            <h3 style="color: #333; margin: 30px 0 15px 0;">Our Response:</h3>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
              ${responseMessage.replace(/\n/g, '<br>')}
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-top: 30px;">
              If you need further assistance, please feel free to contact us again or reply to this email.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'https://your-domain.com'}/contact" 
                 style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Contact Us Again
              </a>
            </div>
          </div>
          
          <div style="background: #333; color: #ccc; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2024 SimpliCollect. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await sendEMail(emailContent);
  } catch (error) {
    console.error('Error sending response email:', error);
  }
};

// Get contact query history
const getContactQueryHistory = async (queryId) => {
  try {
    return await contactModel.getContactQueryHistory(queryId);
  } catch (error) {
    console.error('Error fetching contact query history:', error);
    throw error;
  }
};

// Get contact query statistics
const getContactQueryStats = async () => {
  try {
    return await contactModel.getContactQueryStats();
  } catch (error) {
    console.error('Error fetching contact query stats:', error);
    throw error;
  }
};

// Mark query as spam
const markAsSpam = async (queryId, performedBy) => {
  try {
    return await contactModel.markAsSpam(queryId, performedBy);
  } catch (error) {
    console.error('Error marking query as spam:', error);
    throw error;
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
  markAsSpam
};
