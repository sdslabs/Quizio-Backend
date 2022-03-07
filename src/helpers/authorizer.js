import { getUserWithUserID } from '../models/user';
import logger from './logger';
import { notFoundResponse, unauthenticatedResponse, unauthorizedResponse } from './responses';
import { verifyToken } from './token';
import { extractUser } from './utils';

/**
 * Check if the user is Authenticated
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns callback to the next function if auth else unauthenticated response
 */
export const isAuth = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	const [bearer, token] = authHeader ? authHeader.split(' ') : [null, null];

	if (!token || token === 'null' || token === undefined || token === 'undefined' || bearer !== 'Bearer') {
		return unauthenticatedResponse(res, ['Token is not present or improper format', { token }]);
	}

	const quizioID = verifyToken(res, token);
	logger.info(`check is Auth, extracted quizioID: ${quizioID}`);
	if (quizioID) {
		const user = await getUserWithUserID(quizioID);
		if (user) {
			if (user.role === 'banned') {
				return unauthenticatedResponse(res);
			}
			req.user = extractUser(user);
			return next();
		}
		return notFoundResponse(res, ['Your account does NOT exist!', { quizioID }]);
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
	if (req.user.role === 'superadmin') {
		return next();
	}
	return unauthorizedResponse(res);
};
