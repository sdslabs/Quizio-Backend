import {
	extractResponseData,
	generateQuizioID,
} from '../helpers/utils';
import response from '../schema/response';
import { getQuestionByID } from './question';

/**
 * Save the reponse of a user to a question
 */
export const saveResponse = async (responseData) => {
	const { username, questionID } = responseData;

	const quizioID = generateQuizioID();
	const exists = await response.findOne({ username, questionID }).exec();

	const mcqRes = 'answerChoice' in responseData;
	const subjectiveRes = 'answer' in responseData;

	const question = await getQuestionByID(questionID);
	if (!question) {
		return null;
	}

	if (subjectiveRes && mcqRes) {
		return null;
	}

	if (exists) {
		const updated = await response.findOneAndUpdate({ username, questionID },
			responseData,
			{ new: true });
		return updated ? extractResponseData(updated) : null;
	}
	const created = new response({ ...responseData, quizioID });
	const result = await created.save();
	return result ? extractResponseData(result) : null;
};

export const getResponse = async (username, questionID) => {
	console.log('get response', { username, questionID });
	const responseData = await response.findOne({ username, questionID });
	return responseData ? extractResponseData(responseData) : null;
};
