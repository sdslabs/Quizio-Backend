import { extractSectionData, generateQuizioID } from '../helpers/utils';
import section from '../schema/section';
import quiz from '../schema/quiz';
import { deleteSectionInQuiz } from './quiz';

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
	return result ? extractSectionData(result) : null;
};

/**
 * Update the section using the quizId and sectionId
 * @returns quizID and section data of the section updated in the quiz
 */
export const updateSectionByID = async (quizioID, sectionData) => {
	const updatedSection = await section.findOneAndUpdate({ quizioID },
		sectionData,
		{ new: true });
	const quizz = extractSectionData(updatedSection);
	return quizz;
};

/**
 * Delete the section using the quizId and sectionId
 * @returns quizID and section data of the section deleted from the quiz
 */
export const deleteSection = async (quizioID) => {
	const originalSection = await section.findOne({ quizioID }).exec();
	if (!quizioID || !originalSection) {
		return false;
	}
	const deletedSection = await section.findOneAndDelete({ quizioID });
	const deletedInQuiz = await deleteSectionInQuiz(originalSection.quizID, quizioID);

	if (deletedSection && deletedInQuiz) {
		return true;
	}
	return false;
};

/**
 * Deletes the question in a section given by it's id and returns the updated quiz
 */
export const deleteQuestionInSection = async (quizioID, questionID) => {
	const updatedSection = await section.findOneAndUpdate({ quizioID },
		{ $pull: { questions: questionID } },
		{ new: true });
	return extractSectionData(updatedSection);
};
