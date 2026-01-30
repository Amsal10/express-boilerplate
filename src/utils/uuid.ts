import { v7 as uuidv7 } from 'uuid';

/**
 * Generate a UUID v7
 * UUID v7 is time-ordered and provides better database performance
 */
export const generateUUID = (): string => {
  return uuidv7();
};
