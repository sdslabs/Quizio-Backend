import { failureResponseWithMessage, successResponseWithData } from '../helpers/responses';
import {
	updateLog,
	getLogsForUser,
	getAllLogs,
	getQuizLogsForUser,
} from '../models/log';

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
		const { quizID, logType } = req.body;
		const { userID } = req.user;

		const log = await updateLog({ userID, quizID, logType });

		return log ? successResponseWithData(res, { message: 'Updated Log!', log }) : failureResponseWithMessage(res, 'failed to update log!');
	},

};

export default controller;
