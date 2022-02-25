import * as bcrypt from 'bcrypt';

export const encryptString = async (plainText: string): Promise<string> => {
  const saltRound = parseInt(process.env.APP_SALT);
  const salt = await bcrypt.genSalt(saltRound);
  const hashedText = await bcrypt.hash(plainText, salt);
  return hashedText;
};

export const compareEncryptionText = async (
  plainText: string,
  hashedText: string,
): Promise<boolean> => {
  const result = await bcrypt.compare(plainText, hashedText);
  return result;
};
