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
		const { username } = req.user;
		const data = req.body;
		const register = await registerUserForQuiz(username, data);

		if (register === 'exists') {
			return failureResponseWithMessage(res, 'Already Registered for quiz!');
		}

		return register ? successResponseWithData(res, {
			message: 'Registered for quiz!',
			register,
		}) : errorResponse(res, 'Failed to register for quiz!');
	},

	getRegisteredQuizzesForUser: async (req, res) => {
		const { username } = req.user;
		const quizzes = await getRegisteredQuizzesForUser(username);
		if (quizzes) {
			return successResponseWithData(res, { quizzes });
		}
		return notFoundResponse(res, 'No quizzes found');
	},

	getRegisteredUsersForQuiz: async (req, res) => {
		const { username, role } = req.user;
		const { quizID } = req.params;
		const quiz = await getQuizById(quizID);
		if (quiz) {
			const users = await getRegisteredUsersForQuiz(quizID);
			if (users) {
				if (role === 'superadmin'
					|| quiz.creator === username
					|| quiz.owners.includes(username)) {
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
