import dayjs from 'dayjs';
import quiz from '../schema/quiz';
import publish from '../schema/publish';
import {
	extractPublishData, extractQuizData, extractQuizzesData, generateQuizioID,
} from '../helpers/utils';

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
 * @param {String} quizID quizioID of the creator of the question
 * @returns quiz data of the quiz if found or null
 */
export const getQuizById = async (quizID) => {
	const result = await quiz.findOne({ quizioID: quizID });
	return result ? extractQuizData(result) : null;
};

/**
 * Get all the quizzes owned OR created by the given userID
 * @param {String} userID TODO
 * @returns array of quizzes
 */
export const getQuizzesOwnedByUser = async (userID) => {
	const filter = { $or: [{ owners: userID }, { creator: userID }] };
	const result = await quiz.find(filter);
	return result ? extractQuizzesData(result) : null;
};

/**
 * Get all the quizzes created by the given userID
 * @returns List of quizzes
 */
export const getQuizzesCreatedByUser = async (userID) => {
	const filter = { creator: userID };
	const result = await quiz.find(filter);
	return result ? extractQuizzesData(result) : null;
};

/**
 * Add a new quiz to the db
 * @returns quiz data of the new quiz added to the db
 */
export const addNewQuiz = async (creator, creatorEmail) => {
	const quizioID = generateQuizioID();
	const newQuiz = new quiz({ quizioID, creator, owners: [creatorEmail] });
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

/**
 * Publishes a quiz
 */
export const publishQuiz = async (quizID, publishedBy) => {
	const quizioID = generateQuizioID();
	const exists = await publish.findOne({ quizID, publishedBy });
	const time = dayjs().toString();
	if (exists) {
		const updatedPublish = await publish.findOneAndUpdate(
			{ quizID },
			{ quizID, publishedBy, time },
			{ new: true },
		);
		return extractPublishData(updatedPublish);
	}
	const newPubish = new publish({ quizioID, quizID, publishedBy });
	const result = await newPubish.save();
	return result ? extractPublishData(result) : null;
};

/**
 * Get publish quiz details
 */
export const getPublishedQuiz = async (quizID) => {
	const exists = await publish.findOne({ quizID });
	return exists ? extractPublishData(exists) : null;
};
