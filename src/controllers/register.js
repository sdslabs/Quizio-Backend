import {
	errorResponse, failureResponseWithMessage, notFoundResponse, successResponseWithData,
} from '../helpers/responses';
import {
	getRegisteredQuizzesForUser,
	registerUserForQuiz,
} from '../models/register';

const controller = {
	registerUserForQuiz: async (req, res) => {
		const { username } = req.user;
		const { quizID } = req.params;
		const register = await registerUserForQuiz(username, quizID);

		if (register === 'exists') {
			return failureResponseWithMessage(res, 'Already Registered for quiz!');
		}
		if (register) {
			return successResponseWithData(res, {
				message: 'Registered for quiz!',
				register,
			});
		}
		return errorResponse(res, 'Failed to register for quiz!');
	},

	getRegisteredQuizzesForUser: async (req, res) => {
		const { username } = req.user;
		const quizzes = await getRegisteredQuizzesForUser(username);
		if (quizzes) {
			return successResponseWithData(res, { quizzes });
		}
		return notFoundResponse(res, 'No quizzes found');
	},

};

export default controller;
