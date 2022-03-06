import {
	extractScoreData,
	generateQuizioID,
} from '../helpers/utils';
import score from '../schema/score';
import { getQuestionByID } from './question';

/**
 * Save the score of a user to the db
 * @param {Object} scoreData score object
 * @returns score object of the document added/updated in the db
 */
export const updateScore = async (scoreData) => {
	const { registrantID, questionID } = scoreData;
	console.log({ scoreData });

	const quizioID = generateQuizioID();
	const exists = await score.findOne({ registrantID, questionID }).exec();

	const question = await getQuestionByID(questionID);
	if (!question) return null;

	if (exists) {
		const updated = await score.findOneAndUpdate(
			{ registrantID, questionID },
			scoreData,
			{ new: true },
		);
		return updated ? extractScoreData(updated) : null;
	}
	const created = new score({ ...scoreData, quizioID });
	const result = await created.save();
	return result ? extractScoreData(result) : null;
};

/**
 * Get the score of a user in a question
 * @param {String} userID quizioID of the registrant
 * @param {String} questionID  quizioID of the question
 * @returns score object
 */
export const getScore = async (userID, questionID) => {
	const scoreData = await score.findOne({ userID, questionID });
	return scoreData ? extractScoreData(scoreData) : null;
};
