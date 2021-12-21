import { successResponseWithData } from '../helpers/responses';
import { AddToQuiz, getRegisteredUsers, removeFromQuiz } from '../models/register';

const controller = {
	AddToQuiz: async (req, res) => {
		const register = await AddToQuiz({ quizId: req.body.quizId, username: req.body.username });
		successResponseWithData(res, {
			register,
		}, 200);
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
