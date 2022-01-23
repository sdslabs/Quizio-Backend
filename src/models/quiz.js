import { nanoid } from 'nanoid';
import quiz from '../schema/quiz';
import user from '../schema/user';
import logger from '../helpers/logger';

/**
 * Get all the quizzes in the db
 * @returns An array of all the quizzes in the db
 */
export const getAllQuizzes = async () => {
	const quizzes = await quiz.find();
	return quizzes;
};

/**
 * Add a new quiz to the db
 * @returns quiz data of the new quiz added to the db
 */
export const addNewQuiz = async (creator) => {
	const quizioID = nanoid();
	const newQuiz = new quiz({ quizioID, creator });
	const result = await newQuiz.save();
	if (result) {
		return { quizioID, creator };
	}
	return null;
};

/**
 * Deletes the quiz using the quizId
 * @returns quiz data of the quiz deleted from the db
 */
export const deleteQuiz = async (quizId) => {
	const deletedQuiz = await quiz.findByIdAndDelete(quizId);
	logger.info('quiz deleted!');
	logger.info(deletedQuiz);
	return deletedQuiz;
};

/**
 * Updates the quiz using the quizId
 * @returns quiz data of the quiz updated in the db
 */
export const updateQuiz = async (quizId, quizData) => {
	const updatedQuiz = await quiz.findByIdAndUpdate(quizId,
		quizData,
		{ new: true });
	logger.info('quiz updated!');
	logger.info(updatedQuiz);
	return updatedQuiz;
};

/**
 * Get the quiz with the given quizId
 * @returns The quiz having the specified quizId
 */
export const getQuizById = async (quizId) => {
	const quizData = await quiz.find({ quizId });
	return quizData;
};

/**
 * Get the quiz with the given quizId
 * @returns The quiz having the specified quizId
 */
export const getAllPublicQuizzes = async () => {
	const quizzes = await quiz.find({ isPublic: true });
	return quizzes;
};

/**
 * Get the quiz with the given quizId
 * @returns The quiz having the specified quizId
 * @deprecated Use the function exported from the register model instead
 */
export const getAllQuizzesForUser = async (username) => {
	const userData = await user.findOne({ username });
	const quizzes = await quiz.find({ _id: { $in: userData.quizzes } });
	return quizzes;
};
