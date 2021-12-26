import log from '../schema/log';
import logger from '../helpers/logger';

export const getAllLogs = async () => {
	const logs = await log.find();
	return logs;
};

export const getLogsForUser = async (username) => {
	const logs = await log.find({ username });
	return logs;
};

export const getQuizLogsForUser = async (username, quizId) => {
	const logs = await log.find({ username, quizId });
	return logs;
};

export const updateLog = async ({ username, quizId, logType }) => {
	const filter = { quizId, username, logType };

	const update = {
		...filter,
		$inc: {
			frequency: 1,
		},
	};

	const updatedLog = await log.updateOne(filter, update, {
		new: true,
		upsert: true,
	});

	logger.info('log updated!');
	logger.info(updatedLog);

	return updatedLog;
};
