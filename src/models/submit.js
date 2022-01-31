import submit from '../schema/submit';
import { generateQuizioID } from '../helpers/utils';

/**
 * Submits quiz for user
 * @returns a boolean stating if quiz is successfully submitted or not
 */
const submitUser = async (username, quizID) => {
	const quizioID = generateQuizioID();
	const newSubmission = new submit({
		quizioID, quizID, username, isSubmitted: true,
	});
	const result = await newSubmission.save();
	return !!result;
};

export default submitUser;
