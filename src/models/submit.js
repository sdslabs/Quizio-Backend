import submit from '../schema/submit';
import { generateQuizioID } from '../helpers/utils';

/**
 * Submits quiz for user
 * @returns a boolean stating if quiz is successfully submitted or not
 */
export const SubmitUser = async (username, quizID) => {

    const quizioID = generateQuizioID();
	const newSubmission = new submit({ quizioID, quizID, username, isSubmitted: true });
    const result = await newSubmission.save();
    console.log(result);
    return !!result;
};
