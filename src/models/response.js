import {
	extractResponseData,
	generateQuizioID,
} from '../helpers/utils';
import response from '../schema/response';

/**
 * Save the reponse of a user to a question
 */
export const saveResponse = async (responseData) => {
	const quizioID = generateQuizioID();
	const { userID, questionID } = responseData;

	const exists = await response.findOne({ userID, questionID }).exec();
	if (exists) {
		const updated = await response.findOneAndUpdate(
			{ userID, questionID },
			responseData,
			{ new: true },
		);
		return updated ? extractResponseData(updated) : null;
	}
	const created = new response({ ...responseData, quizioID });
	const result = await created.save();
	return result ? extractResponseData(result) : null;
};

export const getResponse = async (userID, questionID) => {
	const responseData = await response.findOne({ userID, questionID });
	return responseData ? extractResponseData(responseData) : null;
};
