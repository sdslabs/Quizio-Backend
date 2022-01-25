import quiz from '../schema/quiz';
import { extractQuizData, generateQuizioID } from '../helpers/utils';

/**
 * Get all the quizzes in the db
 * @returns An array of all the quizzes in the db
 */
export const getAllQuizzes = async () => {
	const result = await quiz.find();
	const quizzes = result.map((data) => extractQuizData(data));

	return quizzes;
};

/**
 * Get the quiz with the given quizId
 * @returns The quiz having the specified quizId
 */
export const getQuizById = async (quizioID) => {
	const result = await quiz.findOne({ quizioID });
	if (result) {
		const quiz2 = extractQuizData(result);
		return quiz2;
	}
	return null;
};

/**
 * Add a new quiz to the db
 * @returns quiz data of the new quiz added to the db
 */
export const addNewQuiz = async (creator) => {
	const quizioID = generateQuizioID();
	const newQuiz = new quiz({ quizioID, creator });
	const result = await newQuiz.save();
	if (result) {
		return extractQuizData(result);
	}
	return null;
};

/**
 * Deletes the quiz using the quizId
 * @returns quiz data of the quiz deleted from the db
 */
export const deleteQuiz = async (quizioID) => {
	const found = await quiz.findOne({ quizioID }).exec();
	if (!quizioID || !found) {
		return false;
	}
	const deletedQuiz = await quiz.findOneAndDelete({ quizioID });
	if (deletedQuiz) {
		return true;
	}
	return false;
};

/**
 * Updates the quiz using the quizId
 * @returns quiz data of the quiz updated in the db
 */
export const updateQuiz = async (quizioId, quizData) => {
	const updatedQuiz = await quiz.findOneAndUpdate({ quizioId },
		quizData,
		{ new: true });
	const quizz = extractQuizData(updatedQuiz);
	return quizz;
};

/**
 * Deletes the section in a quiz given by it's id and returns the updated quiz
 */
export const deleteSectionInQuiz = async (quizioID, sectionID) => {
	const updatedQuiz = await quiz.findOneAndUpdate({ quizioID },
		{ $pull: { sections: sectionID } },
		{ new: true });
	const quizz = extractQuizData(updatedQuiz);
	return quizz;
};
