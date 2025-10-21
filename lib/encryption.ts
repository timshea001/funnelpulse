import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const SALT_LENGTH = 16
const IV_LENGTH = 16
const TAG_LENGTH = 16
const KEY_LENGTH = 32

// Derive a key from the encryption key environment variable
function getKey(): Buffer {
  const encryptionKey = process.env.ENCRYPTION_KEY
  if (!encryptionKey) {
    throw new Error('ENCRYPTION_KEY environment variable is not set')
  }

  // Use scrypt to derive a proper 256-bit key
  const salt = 'funneliq-static-salt' // In production, use a random salt per encryption
  return scryptSync(encryptionKey, salt, KEY_LENGTH)
}

export async function encrypt(text: string): Promise<string> {
  try {
    const key = getKey()
    const iv = randomBytes(IV_LENGTH)
    const cipher = createCipheriv(ALGORITHM, key, iv)

    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    const tag = cipher.getAuthTag()

    // Return format: iv:encrypted:tag (all in hex)
    return `${iv.toString('hex')}:${encrypted}:${tag.toString('hex')}`
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

export async function decrypt(encryptedData: string): Promise<string> {
  try {
    const key = getKey()
    const parts = encryptedData.split(':')

    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format')
    }

    const iv = Buffer.from(parts[0], 'hex')
    const encrypted = parts[1]
    const tag = Buffer.from(parts[2], 'hex')

    const decipher = createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(tag)

    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data')
  }
}

// Generate a random encryption key (for initial setup)
export function generateEncryptionKey(): string {
  return randomBytes(KEY_LENGTH).toString('hex')
}
