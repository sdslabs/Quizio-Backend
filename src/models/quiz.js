import quiz from '../schema/quiz';
import { extractQuizData, extractQuizzesData, generateQuizioID } from '../helpers/utils';

/**
 * Get all the quizzes in the db
 * @returns An array of all the quizzes in the db
 */
export const getAllQuizzes = async () => {
	const result = await quiz.find();
	return result ? extractQuizzesData(result) : null;
};

/**
 * Get the quiz with the given quizId
 * @returns The quiz having the specified quizId
 */
export const getQuizById = async (quizioID) => {
	const result = await quiz.findOne({ quizioID });
	return result ? extractQuizData(result) : null;
};

/**
 * Get all the quizzes owned or created by the given username
 * @returns List of quizzes
 */
export const getQuizzesOwnedByUser = async (username) => {
	const filter = { $or: [{ owners: username }, { creator: username }] };
	const result = await quiz.find(filter);
	return result ? extractQuizzesData(result) : null;
};

/**
 * Get all the quizzes created by the given username
 * @returns List of quizzes
 */
export const getQuizzesCreatedByUser = async (username) => {
	const filter = { creator: username };
	const result = await quiz.find(filter);
	return result ? extractQuizzesData(result) : null;
};

/**
 * Add a new quiz to the db
 * @returns quiz data of the new quiz added to the db
 */
export const addNewQuiz = async (creator) => {
	const quizioID = generateQuizioID();
	const newQuiz = new quiz({ quizioID, creator });
	const result = await newQuiz.save();
	return result ? extractQuizData(result) : null;
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
	return !!deletedQuiz;
};

/**
 * Updates the quiz using the quizId
 * @returns quiz data of the quiz updated in the db
 */
export const updateQuiz = async (quizioID, quizData) => {
	const updatedQuiz = await quiz.findOneAndUpdate(
		{ quizioID },
		quizData,
		{ new: true },
	);
	return extractQuizData(updatedQuiz);
};

/**
 * Deletes the section in a quiz given by it's id and returns the updated quiz
 */
export const deleteSectionInQuiz = async (quizioID, sectionID) => {
	const updatedQuiz = await quiz.findOneAndUpdate(
		{ quizioID },
		{ $pull: { sections: sectionID } },
		{ new: true },
	);
	return extractQuizData(updatedQuiz);
};
