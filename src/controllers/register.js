import {
	errorResponse,
	failureResponseWithMessage,
	notFoundResponse,
	successResponseWithData,
	unauthorizedResponse,
} from '../helpers/responses';
import { getQuizById } from '../models/quiz';
import {
	getRegisteredQuizzesForUser,
	getRegisteredUsersForQuiz,
	registerUserForQuiz,
} from '../models/register';

const controller = {
	registerUserForQuiz: async (req, res) => {
		const { userID } = req.user;
		const data = req.body;
		const { quizID } = data;
		const { accessCode } = data;

		const quizExists = await getQuizById(quizID);
		if (!quizExists) return notFoundResponse(res, 'quiz not found!');

		if (accessCode === quizExists.accessCode) {
			const register = await registerUserForQuiz(userID, data);

			if (register === 'exists') {
				return failureResponseWithMessage(res, 'Already Registered for quiz!');
			}
			return register ? successResponseWithData(res, {
				message: 'Registered for quiz!',
				register,
			}) : errorResponse(res, 'Failed to register for quiz!');
		}
		return failureResponseWithMessage(res, 'Invalid access code');
	},

	getRegisteredQuizzesForUser: async (req, res) => {
		const { userID } = req.user;
		const quizzes = await getRegisteredQuizzesForUser(userID);
		if (quizzes) {
			return successResponseWithData(res, { quizzes });
		}
		return notFoundResponse(res, 'No quizzes found');
	},

	getRegisteredUsersForQuiz: async (req, res) => {
		const { userID, role } = req.user;
		const { quizID } = req.params;
		const quiz = await getQuizById(quizID);
		if (quiz) {
			const users = await getRegisteredUsersForQuiz(quizID);
			if (users) {
				if (role === 'superadmin'
					|| quiz.creator === userID
					|| quiz.owners.includes(userID)) {
					return successResponseWithData(res, { users });
				}
				return unauthorizedResponse(res);
			}
			return notFoundResponse(res, 'No registrants found');
		}
		return notFoundResponse(res, 'Quiz not found!');
	},

};

export default controller;
