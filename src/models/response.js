import {
	extractResponseData,
	generateQuizioID,
} from '../helpers/utils';
import response from '../schema/response';

/**
 * Add a user as a registrant to a quiz
 */
export const saveResponse = async (responseData) => {
	const quizioID = generateQuizioID();
	const exists = await response.findOne(responseData).exec();
	if (exists) {
		const updated = await response.findOneAndUpdate(responseData, responseData);
		return updated ? extractResponseData(updated) : null;
	}
	const created = new response({ ...responseData, quizioID });
	const result = await created.save();
	return result ? extractResponseData(result) : null;
};

export const a = 'a';
