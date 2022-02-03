import submit from '../schema/submit';
import { generateQuizioID, extractSubmitData } from '../helpers/utils';

/**
 * Submits quiz for user
 @returns the entry in the db  if quiz is successfully submitted or null
 */
const submitUser = async (username, quizID) => {
	const quizioID = generateQuizioID();
	const newSubmission = new submit({
		quizioID, quizID, username,
	});
	const result = await newSubmission.save();
	return result ? extractSubmitData(result) : null;
};

export default submitUser;
