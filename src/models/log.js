import { extractLogsData } from '../helpers/utils';
import log from '../schema/log';

export const getAllLogs = async () => {
	const logs = await log.find();
	return extractLogsData(logs);
};

export const getLogsForUser = async (userID) => {
	const logs = await log.find({ userID });
	return extractLogsData(logs);
};

export const getQuizLogsForUser = async (userID, quizID) => {
	const logs = await log.find({ userID, quizID });
	return extractLogsData(logs);
};

export const updateLog = async ({
	userID, quizID, logType, logData,
}) => {
	const filter = {
		quizID, userID, logType, logData,
	};
	const update = {
		quizID,
		userID,
		logData,
		logType,
		$inc: {
			frequency: 1,
		},
	};

	try {
		const updatedLog = await log.updateOne(filter, update, {
			new: true,
			upsert: true,
		});
		return !!updatedLog;
	} catch (e) {
		return false;
	}
};
