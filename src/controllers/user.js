import logger from '../helpers/logger';
import {
	notFoundResponse,
	successResponseWithData,
	unauthorizedResponse,
} from '../helpers/responses';
import { extractUserDataPrivate, extractUserDataPublic } from '../helpers/utils';
import { getQuizzesCreatedByUser, getQuizzesOwnedByUser } from '../models/quiz';
import { checkIfEmailExists, getAllUsers, getUserWithUserID } from '../models/user';

const controller = {
	/**
	 * @returns List of all users iff requesting user is a superadmin
	 */
	getAllUsers: async (req, res) => {
		const { userID, email, role } = req.user;
		if (role === 'superadmin') {
			logger.info(`Get all users initated by ${email}, role=${role}`);
			const users = await getAllUsers();
			return successResponseWithData(res, {
				you: { userID, email, role }, users,
			});
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
		const { userID } = req.user;
		const user = await getUserWithUserID(userID);

		if (user) {
			return successResponseWithData(res, extractUserDataPrivate(user));
		}
		return notFoundResponse(res, 'User not found!');
	},

	/**
	 * @returns A list of all quizzes owned(or created) by user
	 */
	getAllQuizzesOwnedByUser: async (req, res) => {
		const { userID } = req.user;
		const quizzes = await getQuizzesOwnedByUser(userID);
		return quizzes ? successResponseWithData(res, { quizzes }) : notFoundResponse(res, 'No quizzes found');
	},

	/**
	 * @returns A list of all quizzes created by user
	 */
	getAllQuizzesCreatedByUser: async (req, res) => {
		const { userID } = req.user;
		const quizzes = await getQuizzesCreatedByUser(userID);
		return quizzes ? successResponseWithData(res, { quizzes }) : notFoundResponse(res, 'No quizzes found');
	},

	/**
	 * @returns SuccessResponse if email exists, else 404
	 */
	checkIfEmailExists: async (req, res) => {
		const { emailID } = req.params;
		const exists = await checkIfEmailExists(emailID);
		return exists ? successResponseWithData(res, { msg: 'Email exists!', quizioID: exists }) : notFoundResponse(res, 'Email not found :(');
	},

};

export default controller;
