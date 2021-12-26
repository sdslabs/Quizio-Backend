import log from '../schema/log';
import logger from '../helpers/logger';

export const addLog = async (logData) => {
	const newLog = new log(logData);
	const result = await newLog.save();
	logger.info('new log created!');
	logger.info(result);
	return result;
};

export const updateLog = async (quizId, userId, logtype) => {
	const filter = {
		quizId,
		userId,
		logtype,
	};

	const updatedLog = await log.findOneAndUpdate(filter,
		{
			$inc: {
				frequency: 1,
			},
		}, { new: true });
	logger.info('log updated!');
	logger.info(updatedLog);

	return updatedLog;
};

export const fetchLogForUpdate = async ({ id, userId, logtype }) => {
	const filter = {
		quizId: id,
		userId,
		logtype,
	};

	const fetchedLog = await log.find(filter);
	return fetchedLog;
};

export const fetchLogsForUser = async (quizId, userId) => {
	const logs = await log.find({ quizId, userId });
	return logs;
};

export const fetchAllLogs = async () => {
	const logs = await log.find();
	return logs;
};
