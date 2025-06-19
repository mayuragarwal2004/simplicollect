// Twilio WhatsApp API implementation
const twilio = require("twilio");

const WhatsAppMessage = async (phoneNumber, data) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const whatsappNumber = process.env.TWILIO_PHONE_NUMBER;
  const fromWhatsAppNumber = `whatsapp:${whatsappNumber}`;
  if (!accountSid || !authToken || !whatsappNumber) throw new Error("Twilio credentials are not set in environment variables.");
  if (!phoneNumber) throw new Error("Phone number is required.");
  if (!data || !data.appName || !data.message) throw new Error("Data object with appName and message is required.");
  const contentSid = process.env.TWILIO_MULTI_VAR_WHATSAPP_TEMPLATE_CONTENT_SID;
  if (!contentSid) throw new Error("Content SID is not set in environment variables.");
  const client = twilio(accountSid, authToken);
  try {
    const contentVariables = JSON.stringify({ 1: data.appName, 2: data.message });
    const message = await client.messages.create({
      from: fromWhatsAppNumber,
      to: `whatsapp:${phoneNumber}`,
      contentSid: contentSid,
      contentVariables: contentVariables,
    });
    console.log("WhatsApp message sent. SID:", message.sid);
    return { ok: true, sid: message.sid };
  } catch (err) {
    console.error("Failed to send WhatsApp message:", err);
    return { ok: false, message: err.message, error: err };
  }
};

const sendWhatsAppOtpByTwilio = async (phoneNumber, otp) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const whatsappNumber = process.env.TWILIO_PHONE_NUMBER;
  const fromWhatsAppNumber = `whatsapp:${whatsappNumber}`;
  if (!accountSid || !authToken || !whatsappNumber) throw new Error("Twilio credentials are not set in environment variables.");
  if (!phoneNumber) throw new Error("Phone number is required.");
  if (!otp) throw new Error("OTP is required.");
  const client = twilio(accountSid, authToken);
  try {
    const sid = "HX773f5efc187ae80a649c2e02ce8f0993";
    const message = await client.messages.create({
      from: fromWhatsAppNumber,
      to: `whatsapp:${phoneNumber}`,
      contentSid: sid,
      contentVariables: JSON.stringify({ 1: otp }),
    });
    console.log("WhatsApp OTP sent. SID:", message.sid);
    return { ok: true, message: "OTP sent successfully", sid: message.sid };
  } catch (err) {
    console.error("Failed to send WhatsApp OTP:", err);
    return { ok: false, message: err.message, error: err };
  }
};

const sendWhatsAppMessageByTwilio = async (type, phoneNumber, data) => {
  if (type === 'otp') {
    return await sendWhatsAppOtpByTwilio(phoneNumber, data.otp);
  }
  if (type === 'custom') {
    return await WhatsAppMessage(phoneNumber, data);
  }
  // Add more types as needed
  // Example: if (type === 'joining') { ... }
  return { ok: false, message: `Unsupported message type: ${type}` };
};

module.exports = { sendWhatsAppMessageByTwilio };
