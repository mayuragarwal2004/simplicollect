const notifyModel = require('../model/notifyModel');
const transporter = require('../../config/smtp.js');

const sendPendingRequestEmails = async () => {
  const data = await notifyModel.getPendingRequestsGrouped();

  const grouped = {};

  for (const row of data) {
    const key = `${row.paymentReceivedById}_${row.chapterId}`;
    if (!grouped[key]) {
      grouped[key] = {
        receiverEmail: row.receiverEmail,
        chapterName: row.chapterName,
        memberNames: [],
      };
    }
    grouped[key].memberNames.push(`${row.memberFirstName} ${row.memberLastName}`);
  }

  for (const key in grouped) {
    const { receiverEmail, chapterName, memberNames } = grouped[key];

    const subject = `Pending Fee Requests – Chapter ${chapterName}`;
    const html = `
      <p>You have ${memberNames.length} pending fee request(s) in Chapter <strong>${chapterName}</strong>. Kindly take a look into it.</p>
      <p><strong>List of pending members:</strong></p>
      <ul>
        ${memberNames.map(name => `<li>${name}</li>`).join('')}
      </ul>
    `;

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: receiverEmail,
      subject,
      html,
    });

    console.log(`Email sent to ${receiverEmail} for chapter ${chapterName}`);
  }
};

module.exports = {
  sendPendingRequestEmails,
};
