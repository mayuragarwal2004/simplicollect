const cron = require('node-cron');
const { sendPendingRequestEmails } = require('../controller/notifyController');

cron.schedule('*/5 * * * * *', async () => {
  try {
    await sendPendingRequestEmails();
    console.log('All emails sent successfully.');
  } catch (err) {
    console.error('Error sending pending request emails:', err);
  }
});
