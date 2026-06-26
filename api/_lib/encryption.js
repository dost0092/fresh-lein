'use strict';
/**
 * AES-256-GCM encryption using Node's built-in crypto — no extra dependencies.
 * ENCRYPTION_KEY must be a 32-byte base64-encoded string set in Vercel env.
 *
 * Generate key:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
 */
const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_BYTES  = 12; // 96-bit IV for GCM
const TAG_BYTES = 16;

function getKey() {
  const raw = process.env.ENCRYPTION_KEY;
  if (!raw) throw new Error('ENCRYPTION_KEY env var is not set');
  const key = Buffer.from(raw, 'base64');
  if (key.length !== 32) throw new Error('ENCRYPTION_KEY must be 32 bytes (256 bits) base64-encoded');
  return key;
}

/**
 * Encrypt a plain-text string.
 * Returns a hex string: iv(24 hex) + authTag(32 hex) + ciphertext(hex)
 */
function encrypt(plainText) {
  const key = getKey();
  const iv  = crypto.randomBytes(IV_BYTES);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return iv.toString('hex') + tag.toString('hex') + encrypted.toString('hex');
}

/**
 * Decrypt a hex string produced by encrypt().
 */
function decrypt(cipherText) {
  const key = getKey();
  const iv  = Buffer.from(cipherText.slice(0, IV_BYTES * 2), 'hex');
  const tag = Buffer.from(cipherText.slice(IV_BYTES * 2, IV_BYTES * 2 + TAG_BYTES * 2), 'hex');
  const data = Buffer.from(cipherText.slice(IV_BYTES * 2 + TAG_BYTES * 2), 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
}

module.exports = { encrypt, decrypt };
