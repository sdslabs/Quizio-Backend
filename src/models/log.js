import log from '../schema/log';
import logger from '../helpers/logger';

export const getAllLogs = async () => {
	const logs = await log.find();
	return logs;
};

export const getLogsForUser = async (userID) => {
	const logs = await log.find({ userID });
	return logs;
};

export const getQuizLogsForUser = async (userID, quizID) => {
	const logs = await log.find({ userID, quizID });
	return logs;
};

export const updateLog = async ({ userID, quizID, logType }) => {
	const filter = { quizID, userID, logType };

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
