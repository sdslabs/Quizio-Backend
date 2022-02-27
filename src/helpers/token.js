import jwt from 'jsonwebtoken';
import { authConfig } from '../config/config';
import logger from './logger';

const JWT_KEY = authConfig.jwtKey;
const expiresIn = authConfig.jwtExpiry;

export const generateToken = (payload) => jwt.sign(
	payload,
	JWT_KEY,
	{ expiresIn },
);

export const verifyToken = (res, token) => {
	if (token) {
		try {
			const { quizioID } = jwt.verify(token, JWT_KEY);
			return quizioID;
		} catch (err) {
			logger.error('jwtVerifyError: ', err);
			return false;
		}
	}
	return false;
};
