import {
	extractRanklistData,
	extractScoreData,
	generateQuizioID,
} from '../helpers/utils';
import ranklist from '../schema/ranklist';

/**
 * Save the ranklist of a quiz to the db
 * @param {Object} ranklistData ranklist object
 * @returns ranklist object of the document added/updated in the db
 */
export const updateRanklist = async (ranklistData) => {
	const { quizID } = ranklistData;
	const quizioID = generateQuizioID();
	const exists = await ranklist.findOne({ quizID }).exec();

	if (exists) {
		const updated = await ranklist.findOneAndUpdate(
			{ quizID },
			ranklistData,
			{ new: true },
		);
		return updated ? extractScoreData(updated) : null;
	}
	const created = new ranklist({ ...ranklistData, quizioID });
	const result = await created.save();
	return result ? extractRanklistData(result) : null;
};

/**
 * Get the score of a user in a question
 * @param {String} registrantID quizioID of the registrant
 * @param {String} questionID  quizioID of the question
 * @param {String} getRanklist  fetches the ranklist
 * @returns score object
 */
export const getRanklist = async (ranklistData) => {
	const { quizID } = ranklistData;
	const result = await ranklist.findOne({ quizID }).exec();
	return result ? extractRanklistData(result) : null;
};
