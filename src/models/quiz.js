import quiz from '../schema/quiz';
import user from '../schema/user';
import logger from '../helpers/logger';
import { generateQuizioID } from '../helpers/utils';

/**
 * Get all the quizzes in the db
 * @returns An array of all the quizzes in the db
 */
export const getAllQuizzes = async () => {
	const result = await quiz.find();
	const quizzes = result.map(({
		quizioID,
		name,
		description,
		instructions,
		createdOn,
		creator,
		owners,
		startTime,
		endTime,
		startWindow,
		accessCode,
		sections,
		registrants,
		detail1,
		detail2,
		detail3,
	}) => ({
		quizioID,
		name,
		description,
		instructions,
		createdOn,
		creator,
		owners,
		startTime,
		endTime,
		startWindow,
		accessCode,
		sections,
		registrants,
		detail1,
		detail2,
		detail3,
	}));

	return quizzes;
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
		return { quizioID, creator };
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
