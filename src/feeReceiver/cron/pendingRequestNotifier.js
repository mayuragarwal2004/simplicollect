const cron = require("node-cron");
const { sendPendingRequestEmails } = require("../controller/notifyController");

cron.schedule("*/5 * * * * *", async () => {
  if (process.env.NODE_ENV === "production") {
    try {
      await sendPendingRequestEmails();
      console.log("All emails sent successfully.");
    } catch (err) {
      console.error("Error sending pending request emails:", err);
    }
  }
});
