import { failureResponseWithMessage, notFoundResponse, successResponseWithData } from '../helpers/responses';
import {
	updateLog,
	getLogsForUser,
	getAllLogs,
	getQuizLogsForUser,
} from '../models/log';
import { getQuizById } from '../models/quiz';

const controller = {

	getAllLogs: async (req, res) => {
		const logs = await getAllLogs();
		return logs ? successResponseWithData(res, { logs }) : failureResponseWithMessage(res, 'logs not found!');
	},

	getLogsForUser: async (req, res) => {
		const { userID } = req.params;
		const log = await getLogsForUser(userID);
		return log ? successResponseWithData(res, { log }) : failureResponseWithMessage(res, 'log not found!');
	},

	getQuizLogsForUser: async (req, res) => {
		const { userID, quizID } = req.params;
		const log = await getQuizLogsForUser(userID, quizID);
		return log ? successResponseWithData(res, { log }) : failureResponseWithMessage(res, 'log not found!');
	},

	updateLog: async (req, res) => {
		const { userID } = req.user;
		const { quizID, logType, logData } = req.body;

		const quiz = await getQuizById(quizID);
		if (!quiz) return notFoundResponse(res, 'Quiz not found!');

		const log = await updateLog({
			userID, quizID, logType, logData,
		});

		return log ? successResponseWithData(res, { message: 'Updated Log!', log }) : failureResponseWithMessage(res, 'failed to update log!');
	},

};

export default controller;
