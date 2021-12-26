import { successResponseWithData } from '../helpers/responses';
import {
	updateLog,
	addLog,
	fetchLogsForUser,
	fetchLogForUpdate,
	fetchAllLogs,
} from '../models/log';

const controller = {

	createOrUpdateLogs: async (req, res) => {
		const {
			logtype, sno, qno, id, userId,
		} = req.body;
		const output = await fetchLogForUpdate({
			id, userId, logtype, sno, qno,
		});
		if (output.length === 0) {
			const log = await addLog(req.body);
			return successResponseWithData(res, {
				message: 'Added new Log to db!',
				log,
			}, 200);
		}

		const log = await updateLog({
			id, userId, logtype, sno, qno,
		});

		return successResponseWithData(res, {
			message: 'Updated Log in db!',
			log,
		}, 200);
	},

	fetchLogsForUser: async (req, res) => {
		const log = await fetchLogsForUser(req.params.quizId, req.params.username);
		return successResponseWithData(res, {
			log,
		}, 200);
	},

	getAllLogs: async (req, res) => {
		const logs = await fetchAllLogs();
		return successResponseWithData(res, {
			logs,
		}, 200);
	},
};

export default controller;
