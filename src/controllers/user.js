import {
	notFoundResponse,
	successResponseWithData,
} from '../helpers/responses';
import { getQuizzesOwnedByUser } from '../models/quiz';
import {
	getAllUsers,
	findUserByUsername,
	addQuizforUser,
	removeQuizforUser,
	findUserByEmail,
} from '../models/user';

const controller = {
	getAllUsers: async (req, res) => {
		const users = await getAllUsers();
		return successResponseWithData(res, {
			users,
		});
	},

	getAllQuizzesOwnedByUser: async (req, res) => {
		const { username } = req.user;
		const quizzes = await getQuizzesOwnedByUser(username);
		return quizzes ? successResponseWithData(res, { quizzes }) : notFoundResponse(res);
	},

	getUserWithUsername: async (req, res) => {
		const user = await findUserByUsername(req.params.username);
		return successResponseWithData(res, {
			user,
		}, 200);
	},

	getUserWithEmail: async (req, res) => {
		const user = await findUserByEmail(req.params.email);
		console.log({ user }, req.params.email);
		if (user) {
			// TODO: must not send entire data to other user
			return successResponseWithData(res, {
				user,
			}, 200);
		}
		return notFoundResponse(res);
	},

	addQuizforUser: async (req, res) => {
		const user = await addQuizforUser(req.params.username, req.params.quizId);
		return successResponseWithData(res, {
			user,
		}, 200);
	},

	removeQuizforUser: async (req, res) => {
		const user = await removeQuizforUser(req.params.username, req.params.quizId);
		return successResponseWithData(res, {
			user,
		}, 200);
	},

	getAllQuizzesForUser: async (req, res) => notFoundResponse(),		/*
		// const quizzes = await getAllQuizzesForUser(req.params.username);
		// return successResponseWithData(res, {
		// 	quizzes,
		// }, 200);
		*/

};

export default controller;
