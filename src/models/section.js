import { extractSectionData, generateQuizioID } from '../helpers/utils';
import section from '../schema/section';
import quiz from '../schema/quiz';

/**
 * Add a new section to a quiz
 * @returns quizId and section data of the new section added to the quiz
 */
export const addNewSectionToQuiz = async (quizID, creator) => {
	const quizioID = generateQuizioID();

	const newSection = new section({ quizioID, quizID, creator });
	const result = await newSection.save();
	if (result) {
		const quizz = await quiz.updateOne({ quizioID: quizID },
			{ $push: { sections: quizioID } });
		if (quizz) {
			return extractSectionData(result);
		}
		return null;
	}
	return null;
};

/**
 * Add a new section to a quiz
 * @returns quizId and section data of the new section added to the quiz
 */
export const getSectionByID = async (quizioID) => {
	const result = await section.findOne({ quizioID });
	if (result) {
		const quiz2 = extractSectionData(result);
		return quiz2;
	}
	return null;
};

/**
 * Delete the section using the quizId and sectionId
 * @returns quizID and section data of the section deleted from the quiz
 */
export const deleteSectionInQuiz = async (quizId, sectionId) => {
	// const filter = {
	// 	quizId,
	// };

	// const updatedQuiz = await quiz.findOneAndUpdate(filter,
	// 	{
	// 		$pull: {
	// 			sections: {
	// 				_id: sectionId,
	// 			},
	// 		},
	// 	},
	// 	{ new: true });
	// return updatedQuiz;
};

/**
 * Update the section using the quizId and sectionId
 * @returns quizID and section data of the section updated in the quiz
 */
export const updateSectionInQuiz = async (quizId, sectionId, sectionData) => {
	// const filter = {
	// 	quizId,
	// 	'sections.sectionId': sectionId,
	// };

	// const updateSectionData = {};
	// Object.keys(sectionData).forEach((key) => {
	// 	updateSectionData[`sections.$.${key}`] = sectionData[key];
	// });

	// const updatedQuiz = await quiz.findOneAndUpdate(filter,
	// 	{
	// 		$set: updateSectionData,
	// 	}, { new: true });
	// return updatedQuiz;
};
