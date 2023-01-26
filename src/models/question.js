import { extractQuestionData, generateQuizioID } from '../helpers/utils';
import section from '../schema/section';
import question from '../schema/question';
import { deleteQuestionInSection } from './section';

/**
 * Add a new question to a section in a quiz
 * @param {String} sectionID quizioID of the parent section of the question
 * @param {String} creator quizioID of the creator of the question
 * @returns The updated quiz
 */
export const addNewQuestionToSection = async (sectionID, creator) => {
	const quizioID = generateQuizioID();

	const newQuestion = new question({ quizioID, sectionID, creator });
	const result = await newQuestion.save();
	if (result) {
		const sectionn = await section.updateOne(
			{ quizioID: sectionID },
			{ $push: { questions: quizioID } },
		);

		if (sectionn) {
			return extractQuestionData(result);
		}
		return null;
	}
	return null;
};

/**
 * Get question by id
 * @param {String} questionID quizioID of the question
 * @returns question data of the question if found or null
 */
export const getQuestionByID = async (questionID) => {
	const result = await question.findOne({ quizioID: questionID });
	return result ? extractQuestionData(result) : null;
};

/**
 * Update the question using the quizioID of the question and the new question data
 * @param {String} questionID quizioID of the question
 * @param {Object} questionData object with new values of the question to be updated
 * @returns updated question object
 */
export const updateQuestionByID = async (questionID, questionData) => {
	const updatedQuestion = await question.findOneAndUpdate(
		{ quizioID: questionID },
		questionData,
		{ new: true },
	);
	console.log(questionData);
	return extractQuestionData(updatedQuestion);
};

/**
 * Adds a choice to a question
 * @param {String} questionID quizioID of the question
 * @param {Object} choiceData object with values of the choice to be added
 * @returns updated question object
 */
export const addChoiceToQuestionByID = async (questionID, choiceData) => {
	const updatedQuestion = await question.findOneAndUpdate(
		{ quizioID: questionID },
		{ $push: { choices: choiceData } },
		{ new: true },
	);
	return extractQuestionData(updatedQuestion);
};

/**
 * Update the section using the quizId and sectionId
 * @param {String} questionID quizioID of the question
 * @param {Object} choiceData object with values of the choice to be added
 * @returns updated question object
 */
export const deleteChoiceInQuestionByID = async (questionID, choiceID) => {
	const updatedQuestion = await question.findOneAndUpdate(
		{ quizioID: questionID },
		{ $pull: { choices: { quizioID: choiceID } } },
		{ new: true },
	);
	return extractQuestionData(updatedQuestion);
};

/**
 * Deletes all the choices in a question
 * @param {String} questionID quizioID of the question
 * @returns updated question object
 */
export const deleteAllChoicesInQuestionByID = async (questionID) => {
	const updatedQuestion = await question.findOneAndUpdate(
		{ quizioID: questionID },
		{ choices: [] },
		{ new: true },
	);
	return extractQuestionData(updatedQuestion);
};

/**
 * Delete a quesiton by it's quizioID
 * @param {String} questionID quizioID of the question
 * @returns true if deleted else false
 */
export const deleteQuestion = async (questionID) => {
	const originalQuestion = await question.findOne({ quizioID: questionID });
	if (!questionID || !originalQuestion) return false;
	const deletedQuestion = await question.findOneAndDelete({ quizioID: questionID });
	const deletedInSection = await deleteQuestionInSection(originalQuestion.sectionID, questionID);

	return deletedQuestion && deletedInSection;
};

/**
 * Check if a choice exists in the question
 * @param {String} choiceID quizioID of the choice
 * @param {String} questionID quizioID of the question
 * @returns true if choice exists in question else false
 */
export const isChoiceInQuestion = async (choiceID, questionID) => {
	const questionData = await getQuestionByID(questionID);
	return !!questionData.choices.find((choice) => choice.quizioID === choiceID);
};
