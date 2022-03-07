import {
	extractRegistrantData,
	extractRegistrantQuizList,
	extractRegistrantUserNameList,
	generateQuizioID,
} from '../helpers/utils';
import register from '../schema/register';

/**
 * Add a user as a registrant to a quiz
 */
export const registerUserForQuiz = async (userID, data) => {
	const quizioID = generateQuizioID();
	const { quizID } = data;
	const exists = await register.findOne({ quizID, userID }).exec();
	if (exists) {
		return 'exists';
	}
	const newRegistrant = new register({ quizioID, userID, ...data });
	const result = await newRegistrant.save();
	return result ? extractRegistrantData(result) : null;
};

/**
 * Get list of quizzes for which user has registered
 */
export const getRegisteredQuizzesForUser = async (userID) => {
	const result = await register.find({ userID }).exec();
	return result ? extractRegistrantQuizList(result) : null;
};

/**
 * Get list of users registered for a quiz
 */
export const getRegisteredUsersForQuiz = async (quizID) => {
	const result = await register.find({ quizID }).exec();
	console.log({ result });
	return result ? extractRegistrantUserNameList(result) : null;
};

/**
 * Check if user is registered for a quiz
 */
export const checkIfUserIsRegisteredForQuiz = async (userID, quizID) => {
	const exists = await register.findOne({ quizID, userID }).exec();
	return !!exists;
};
