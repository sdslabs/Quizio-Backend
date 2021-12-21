import jwt from 'jsonwebtoken';
import { authConfig } from '../config/config';
import { tokenErrorResponse } from './responses';

const JWT_KEY = authConfig.jwtKey;
// const expiresIn = authConfig.jwtExpiry;

export const generateToken = (payload) => jwt.sign(payload, JWT_KEY);

export const verifyToken = (res, token) => {
	try {
		const payload = jwt.verify(token, JWT_KEY);
		return payload;
	} catch (err) {
		tokenErrorResponse(res);
		throw err;
	}
};
