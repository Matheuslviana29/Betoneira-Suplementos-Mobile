import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);

  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password, storedHash) {
  const [algorithm, salt, keyInHex] = storedHash.split(':');

  if (algorithm !== 'scrypt' || !salt || !keyInHex) {
    return false;
  }

  const storedKey = Buffer.from(keyInHex, 'hex');
  const derivedKey = await scrypt(password, salt, storedKey.length);

  return storedKey.length === derivedKey.length && timingSafeEqual(storedKey, derivedKey);
}
