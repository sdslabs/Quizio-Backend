import isValidObjectId from '../helpers/mongoose';
import { badRequestResponseWithMessage, notFoundResponse, successResponseWithData } from '../helpers/responses';
import {
	updateLog,
	getLogsForUser,
	getAllLogs,
	getQuizLogsForUser,
} from '../models/log';

const controller = {

	getAllLogs: async (req, res) => {
		const logs = await getAllLogs();
		return successResponseWithData(res, {
			logs,
		}, 200);
	},

	getLogsForUser: async (req, res) => {
		const { username } = req.params;
		const log = await getLogsForUser(username);
		return successResponseWithData(res, {
			log,
		}, 200);
	},

	getQuizLogsForUser: async (req, res) => {
		const { username, quizId } = req.params;

		if (isValidObjectId(quizId)) {
			const log = await getQuizLogsForUser(username, quizId);

			return successResponseWithData(res, {
				log,
			}, 200);
		}
		return notFoundResponse(res, {
			msg: 'QuizId is invalid',
		});
	},

	updateLog: async (req, res) => {
		const { quizId, logType } = req.body;
		const { username } = req.user;

		if (!quizId || !logType) {
			return badRequestResponseWithMessage(res, {
				msg: 'quizId or logType is missing!',
			});
		}

		const log = await updateLog({ username, quizId, logType });

		return successResponseWithData(res, {
			message: 'Updated Log in db!',
			log,
		}, 200);
	},

};

export default controller;
