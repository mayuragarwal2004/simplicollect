// Meta (Facebook) WhatsApp API implementation
const axios = require("axios");

const sendWhatsAppOtpByMeta = async (phoneNumber, otp) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phoneNumber,
        type: "template",
        template: {
          name: "otp_verification",
          language: { code: "en_US" },
          components: [
            { type: "body", parameters: [{ type: "text", text: otp }] },
            { type: "button", sub_type: "url", index: 0, parameters: [{ type: "text", text: otp }] },
          ],
        },
      },
      { headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}` } }
    );
    return { ok: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Error sending WhatsApp OTP:", error.response?.data || error);
    return { ok: false, message: error.response?.data?.error?.message || error.message, error };
  }
};

const sendWhatsAppMessageByMeta = async (type, phoneNumber, data) => {
  if (type === 'otp') {
    return await sendWhatsAppOtpByMeta(phoneNumber, data.otp);
  }
  // Add more types as needed
  // Example: if (type === 'joining') { ... }
  return { ok: false, message: `Unsupported message type: ${type}` };
};

module.exports = { sendWhatsAppMessageByMeta };
