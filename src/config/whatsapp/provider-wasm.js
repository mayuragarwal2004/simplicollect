// WASM WhatsApp API implementation
const sendWhatsAppOtpByWasm = async (phoneNumber, otp) => {
  const otp_text = `Your OTP for www.simplicollect.in is ${otp}.`;
  let exe_url = `https://wasmsapi.com/api/sendText?token=${process.env.WASM_API_KEY}&phone=${phoneNumber}&message=${encodeURIComponent(otp_text)}`;
  try {
    const response = await fetch(exe_url, { method: "POST" });
    const data = await response.text();
    console.log("Response:", data);
    return { ok: true, message: "OTP sent successfully", data };
  } catch (err) {
    console.error("Fetch error:", err);
    return { ok: false, message: err.message, error: err };
  }
};

const sendWhatsAppMessageByWasm = async (type, phoneNumber, data) => {
  if (type === 'otp') {
    return await sendWhatsAppOtpByWasm(phoneNumber, data.otp);
  }
  // Add more types as needed
  // Example: if (type === 'joining') { ... }
  return { ok: false, message: `Unsupported message type: ${type}` };
};

module.exports = { sendWhatsAppMessageByWasm };
