// Dovesoft WhatsApp API implementation
const axios = require("axios");

const sendWhatsAppOtpByDovesoft = async (phoneNumber, otp) => {
  try {
    const response = await axios.post(
      "https://api.dovesoft.io//REST/directApi/message",
      {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "template",
        template: {
          name: "otp_verify",
          language: {
            code: "en",
            policy: "deterministic",
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
          "content-type": "application/json",
          wabaNumber: process.env.DOVESOFT_WABA_PHONE_NUMBER,
          Key: process.env.DOVESOFT_API_KEY,
        },
      }
    );
    return { ok: true, message: "OTP sent successfully", data: response.data };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.error?.message || error.message,
      error,
    };
  }
};

const sendWhatsAppMessageByDovesoft = async (type, phoneNumber, data) => {
  if (type === "otp") {
    return await sendWhatsAppOtpByDovesoft(phoneNumber, data.otp);
  }
  if (type === "utility") {
    return await sendUtilityTemplateByDovesoft(phoneNumber, data);
  }
  // Add more types as needed
  return { ok: false, message: `Unsupported message type: ${type}` };
};

const sendUtilityTemplateByDovesoft = async (phoneNumber, templateData) => {
  console.log({ phoneNumber, templateData: JSON.stringify(templateData) });

  try {
    const response = await axios.post(
      "https://api.dovesoft.io//REST/directApi/message",
      {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "template",
        template: {
          name: templateData.templateName,
          language: {
            code: templateData.languageCode || "en",
            policy: "deterministic",
          },
          components: templateData.components,
        },
      },
      {
        headers: {
          "content-type": "application/json",
          wabaNumber: process.env.DOVESOFT_WABA_PHONE_NUMBER,
          Key: process.env.DOVESOFT_API_KEY,
        },
      }
    );
    return {
      ok: true,
      message: "Template message sent successfully",
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.error?.message || error.message,
      error,
    };
  }
};

module.exports = { sendWhatsAppMessageByDovesoft };
