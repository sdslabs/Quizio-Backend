import {
	extractSubmitData,
	generateQuizioID,
} from '../helpers/utils';
import submit from '../schema/submit';

/**
 * submit the quiz for a user
 */
export const submitQuiz = async (quizID, username) => {
	const quizioID = generateQuizioID();

	const exists = await submit.findOne({ quizID, username }).exec();
	if (exists) {
		return 'exists';
	}

	const newSubmit = new submit({ quizioID, quizID, username });
	const result = await newSubmit.save();
	return result ? extractSubmitData(result) : null;
};

// Return true if submission already exists else false
export const checkSubmit = async (quizID, username) => {
	const exists = await submit.findOne({ quizID, username });
	return exists;
};

export const a = 'a';
