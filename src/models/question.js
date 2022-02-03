import { extractQuestionData, generateQuizioID } from '../helpers/utils';
import section from '../schema/section';
import question from '../schema/question';
import { deleteQuestionInSection } from './section';

/**
 * Add a new question to a section in a quiz
 * @returns The updated quiz
 */
export const addNewQuestionToSection = async (sectionID, creator) => {
	const quizioID = generateQuizioID();

	const newQuestion = new question({ quizioID, sectionID, creator });
	const result = await newQuestion.save();
	if (result) {
		const sectionn = await section.updateOne({ quizioID: sectionID },
			{ $push: { questions: quizioID } });

		if (sectionn) {
			return extractQuestionData(result);
		}
		return null;
	}
	return null;
};

export const getQuestionByID = async (quizioID) => {
	const result = await question.findOne({ quizioID });
	return result ? extractQuestionData(result) : null;
};

/**
 * Update the section using the quizId and sectionId
 * @returns quizID and section data of the section updated in the quiz
 */
export const updateQuestionByID = async (quizioID, questionData) => {
	const updatedQuestion = await question.findOneAndUpdate({ quizioID },
		questionData,
		{ new: true });
	return extractQuestionData(updatedQuestion);
};
/**
 * Update the section using the quizId and sectionId
 * @returns quizID and section data of the section updated in the quiz
 */
export const addChoiceToQuestionByID = async (quizioID, choiceData) => {
	const updatedQuestion = await question.findOneAndUpdate({ quizioID },
		{ $push: { choices: choiceData } },
		{ new: true });
	return extractQuestionData(updatedQuestion);
};

/**
 * Update the section using the quizId and sectionId
 * @returns quizID and section data of the section updated in the quiz
 */
export const deleteChoiceInQuestionByID = async (quizioID, choiceID) => {
	const updatedQuestion = await question.findOneAndUpdate({ quizioID },
		{ $pull: { choices: { choiceID } } },
		{ new: true });
	return extractQuestionData(updatedQuestion);
};

/**
 * Delete a question by Id
 */
export const deleteQuestion = async (quizioID) => {
	const originalQuestion = await question.findOne({ quizioID });
	if (!quizioID || !originalQuestion) {
		return false;
	}
	const deletedQuestion = await question.findOneAndDelete({ quizioID });
	const deletedInSection = await deleteQuestionInSection(originalQuestion.sectionID, quizioID);

	if (deletedQuestion && deletedInSection) {
		return true;
	}
	return false;
};
