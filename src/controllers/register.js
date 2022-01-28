import { errorResponse, failureResponseWithMessage, successResponseWithData } from '../helpers/responses';
import {
	getRegisteredUsers,
	registerUserForQuiz,
	removeFromQuiz,
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

	removeFromQuiz: async (req, res) => {
		const register = await removeFromQuiz({ quizId: req.body.quizId, username: req.body.username });
		successResponseWithData(res, {
			message: 'Remove User from a quiz',
			register,
		}, 200);
	},

	getRegisteredUsers: async (req, res) => {
		const users = await getRegisteredUsers(req.params.quizId);
		successResponseWithData(res, {
			message: 'Get all users registered for quiz with quizId',
			users,
		}, 200);
	},

};

export default controller;
