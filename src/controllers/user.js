import logger from '../helpers/logger';
import {
	notFoundResponse,
	successResponseWithData,
	unauthorizedResponse,
} from '../helpers/responses';
import { extractUserDataPrivate, extractUserDataPublic } from '../helpers/utils';
import { getQuizzesOwnedByUser } from '../models/quiz';
import { getAllUsers, getUserWithUserID } from '../models/user';

const controller = {
	/**
	 * @returns List of all users iff requesting user is a superadmin
	 */
	getAllUsers: async (req, res) => {
		const { username, role } = req.user;
		if (role === 'superadmin') {
			logger.info(`Get all users initated by ${username}, role=${role}`);
			const users = await getAllUsers();
			return successResponseWithData(res, { username, role, users });
		}
		return unauthorizedResponse(res);
	},

	/**
	 * @returns Private UserData of user with the given userID
	 */
	getUserWithUserID: async (req, res) => {
		const { userID } = req.params;
		const user = await getUserWithUserID(userID);
		if (user) {
			return successResponseWithData(res, extractUserDataPublic(user));
		}
		return notFoundResponse(res, 'User not found!');
	},

	/**
	 * @returns Public UserData of user with the given userID
	 */
	getSelfWithUserID: async (req, res) => {
		const { user } = req;
		if (user) {
			return successResponseWithData(res, extractUserDataPrivate(user));
		}
		return notFoundResponse(res, 'User not found!');
	},

	/**
	 * @returns A list of all quizzes owned(or created) by user
	 */
	getAllQuizzesOwnedByUser: async (req, res) => {
		const { username } = req.user;
		const quizzes = await getQuizzesOwnedByUser(username);
		return quizzes ? successResponseWithData(res, { quizzes }) : notFoundResponse(res, 'No quizzes found');
	},
};

export default controller;
