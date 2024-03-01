/** @format */

const CryptoJS = require("crypto-js");

const encryptionKey = "YourEncryptionKey";

// Function to encrypt a message
async function encryptMessage(message) {
  return CryptoJS.AES.encrypt(message, encryptionKey).toString();
}
// Function to decrypt a message
function decryptMessage(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = { encryptMessage, decryptMessage };
