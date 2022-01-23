import {
	badRequestResponseWithMessage, notFoundResponse, successResponseWithData,
} from '../helpers/responses';
import {
	getAllUsers,
	findUserByUsername,
	addQuizforUser,
	removeQuizforUser,
	updateUsername,
	findUserByEmail,
} from '../models/user';

const controller = {
	getAllUsers: async (req, res) => {
		const users = await getAllUsers();
		return successResponseWithData(res, {
			users,
		}, 200);
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

	updateUser: async (req, res) => {
		switch (req.params.type) {
		case 'updateUsername': {
			const { success, msg } = await updateUsername(req.body.username, req.body.newUsername);

			if (success) {
				return successResponseWithData(res, {
					msg,
				});
			}
			return badRequestResponseWithMessage(res, {
				msg,
			});
		}
		default:
			return notFoundResponse();
		}
	},
};

export default controller;
