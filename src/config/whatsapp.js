const axios = require("axios");
const twilio = require("twilio");
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

const WhatsAppMessage = async (phoneNumber, data) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const whatsappNumber = process.env.TWILIO_PHONE_NUMBER;
  const fromWhatsAppNumber = `whatsapp:${whatsappNumber}`;

  if (!accountSid || !authToken || !whatsappNumber) {
    throw new Error("Twilio credentials are not set in environment variables.");
  }
  if (!phoneNumber) {
    throw new Error("Phone number is required.");
  }
  if (!data || !data.appName || !data.message) {
    throw new Error("Data object with appName and message is required.");
  }

  const contentSid = process.env.TWILIO_MULTI_VAR_WHATSAPP_TEMPLATE_CONTENT_SID;
  if (!contentSid) {
    throw new Error("Content SID is not set in environment variables.");
  }

  const client = twilio(accountSid, authToken);

  try {
    const contentVariables = JSON.stringify({
      1: data.appName,
      2: data.message,
    });

    console.log({
      from: fromWhatsAppNumber,
      to: `whatsapp:${phoneNumber}`,
      contentSid: contentSid,
      contentVariables: contentVariables,
    });

    const message = await client.messages.create({
      from: fromWhatsAppNumber,
      to: `whatsapp:${phoneNumber}`,
      contentSid: contentSid,
      contentVariables: contentVariables,
    });

    console.log("WhatsApp message sent. SID:", message.sid);
    return message.sid;
  } catch (err) {
    console.error("Failed to send WhatsApp message:", err);
    throw err;
  }
};

const sendWhatsAppOtpByTwilio = async (phoneNumber, otp) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const whatsappNumber = process.env.TWILIO_PHONE_NUMBER;
  const fromWhatsAppNumber = `whatsapp:${whatsappNumber}`;

  if (!accountSid || !authToken || !whatsappNumber) {
    throw new Error("Twilio credentials are not set in environment variables.");
  }
  if (!phoneNumber) {
    throw new Error("Phone number is required.");
  }
  if (!otp) {
    throw new Error("OTP is required.");
  }
  const client = twilio(accountSid, authToken);
  try {
    const sid = "HX773f5efc187ae80a649c2e02ce8f0993";
    const message = await client.messages.create({
      from: fromWhatsAppNumber,
      to: `whatsapp:${phoneNumber}`,
      contentSid: sid,
      contentVariables: JSON.stringify({
        1: otp, // Assuming the OTP is the first variable in the template
      }),
    });

    console.log("WhatsApp OTP sent. SID:", message.sid);
    return { ok: true, message: "OTP sent successfully", sid: message.sid };
  } catch (err) {
    console.error("Failed to send WhatsApp OTP:", err);
    return { ok: false, message: err.message, error: err };
  }
};

const sendWhatsAppOtp = async (phoneNumber, otp) => {
  return await sendWhatsAppOtpByTwilio(phoneNumber, otp);
};

module.exports = { WhatsAppMessage, sendWhatsAppOtpByTwilio, sendWhatsAppOtp };
