import { randomUUID } from 'crypto';

/**
 * Generates a random version 4 UUID
 */
export function generateUUID(): string {
  return randomUUID();
}
