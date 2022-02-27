import {
	extractSubmitData,
	extractSubmitsData,
	generateQuizioID,
} from '../helpers/utils';
import submit from '../schema/submit';

/**
 * Get a list of submitted quizzes for user
 */
export const getSubmittedQuizzes = async (userID) => {
	const submits = await submit.find({ userID });
	return submits ? extractSubmitsData(submits) : null;
};

/**
 * submit the quiz for a user
 */
export const submitQuiz = async (quizID, userID) => {
	const quizioID = generateQuizioID();

	const exists = await submit.findOne({ quizID, userID }).exec();
	if (exists) {
		return 'exists';
	}

	const newSubmit = new submit({ quizioID, quizID, userID });
	const result = await newSubmit.save();
	return result ? extractSubmitData(result) : null;
};

// Return true if submission already exists else false
export const checkSubmit = async (quizID, userID) => {
	const exists = await submit.findOne({ quizID, userID });
	return exists;
};

export const a = 'a';
