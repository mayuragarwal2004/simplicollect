// WhatsApp API provider selector
const meta = require('./provider-meta');
const wasm = require('./provider-wasm');
const twilio = require('./provider-twilio');
const dovesoft = require('./provider-dovesoft');

const provider = process.env.WHATSAPP_PROVIDER || 'twilio';

let sendWhatsAppMessage;

switch (provider.toLowerCase()) {
  case 'meta':
    sendWhatsAppMessage = meta.sendWhatsAppMessageByMeta;
    break;
  case 'wasm':
    sendWhatsAppMessage = wasm.sendWhatsAppMessageByWasm;
    break;
  case 'dovesoft':
    sendWhatsAppMessage = dovesoft.sendWhatsAppMessageByDovesoft;
    break;
  case 'twilio':
  default:
    sendWhatsAppMessage = twilio.sendWhatsAppMessageByTwilio;
    break;
}

module.exports = { sendWhatsAppMessage };
