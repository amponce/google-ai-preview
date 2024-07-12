import CryptoJS from 'crypto-js';

export const generateKey = () => {
  return CryptoJS.lib.WordArray.random(256/8).toString();
};

export const encryptMessage = (message, key) => {
  return CryptoJS.AES.encrypt(message, key).toString();
};

export const decryptMessage = (ciphertext, key) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};