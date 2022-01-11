import { findUserByUsername } from '../models/user';
import { unauthenticatedResponse, unauthorizedResponse } from './responses';
import { verifyToken } from './token';
import ROLE from './enums';

/**
 * Check if the user is Authenticated
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns callback to the next function if auth else unauthenticated response
 */
export const isAuth = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	let token;
	if (authHeader) {
		// eslint-disable-next-line prefer-destructuring
		token = authHeader.split(' ')[1];
	}
	if (!token || token === 'null' || token === undefined) {
		return unauthenticatedResponse(res);
	}
	req.token = token;
	const username = verifyToken(res, token);
	if (username) {
		req.user = await findUserByUsername(username);
		return next();
	}
	return unauthenticatedResponse(res);
};

/**
 * Check if user is superAdmin
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns callback to the next function if superAdmin else unauthenticated response
 */
export const isSuperAdmin = (req, res, next) => {
	if (req.user.role === ROLE.SUPERADMIN) {
		return next();
	}
	return unauthorizedResponse(res);
};

/**
 * Check if user making the request is the logged in user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns callback to the next function if true else unauthenticated response
 */
export const isSelf = (req, res, next) => {
	if (req.user.username === req.params.username) {
		return next();
	}
	return unauthorizedResponse(res);
};

/**
 * Check if user making the request is the logged in user or super admin
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns callback to the next function if true else unauthenticated response
 */
export const isSelfOrSuperAdmin = (req, res, next) => {
	if (req.user.username === req.params.username || req.user.role === ROLE.SUPERADMIN) {
		return next();
	}
	return unauthorizedResponse(res);
};
