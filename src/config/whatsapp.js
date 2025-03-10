const axios = require("axios");

const sendWhatsAppOtp = async (phoneNumber, otp) => {
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
          language: {
            code: "en_US",
          },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: otp,
                },
              ],
            },
            {
              type: "button",
              sub_type: "url",
              index: 0,
              parameters: [
                {
                  type: "text",
                  text: otp,
                },
              ],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`, // WhatsApp access token
        },
      }
    );
    return {ok: true, message: "OTP sent successfully"};
  } catch (error) {
    console.error("Error sending WhatsApp OTP:", error.response.data);
    return {ok: false, message: error.response.data.error.message, error};
  }
};

module.exports = { sendWhatsAppOtp };