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
    return { ok: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Error sending WhatsApp OTP:", error.response.data);
    return { ok: false, message: error.response.data.error.message, error };
  }
};

const sendWhatsAppOtpByWasm = async (phoneNumber, otp) => {
  const otp_text = `Your OTP for www.simplicollect.in is ${otp}.`;

  let exe_url = "";

  exe_url = `https://wasmsapi.com/api/sendText?token=${
    process.env.WASM_API_KEY
  }&phone=${phoneNumber}&message=${encodeURIComponent(otp_text)}`;

  try {
    const response = await fetch(exe_url, {
      method: "POST",
    });

    const data = await response.text(); // or `.json()` if it returns JSON
    console.log("Response:", data);
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

const sendWhatsAppOtp = async (...data) => {
  return sendWhatsAppOtpByWasm(...data);
};

module.exports = { sendWhatsAppOtp };
