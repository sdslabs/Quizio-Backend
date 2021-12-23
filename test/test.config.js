import dotenv from 'dotenv';

dotenv.config();

export const superAdminToken = process.env.TEST_superAdminToken;
export const MONGOURI = process.env.TEST_mongoURI;
