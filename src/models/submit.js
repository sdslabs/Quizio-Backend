import submit from '../schema/submit';
import { generateQuizioID, extractSubmitData } from '../helpers/utils';

/**
 * Submits quiz for user
 @returns the entry in the db  if quiz is successfully submitted or null
 */
export const submitUser = async (username, quizID) => {
	const quizioID = generateQuizioID();
	const newSubmission = new submit({
		quizioID, quizID, username,
	});
	const result = await newSubmission.save();
	return result ? extractSubmitData(result) : null;
};

/**
 * Find if user's quiz is submitted
 * @returns true if user's quiz is submitted, else false
 */
export const isUserSubmitted = async (username) => {
	const result = await submit.findOne({ username });
	return !!result;
};