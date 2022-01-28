import { extractRegistrantData, extractRegistrantQuizList, generateQuizioID } from '../helpers/utils';
import register from '../schema/register';

/**
 * Add a user as a registrant to a quiz
 */
export const registerUserForQuiz = async (username, quizID) => {
	const quizioID = generateQuizioID();
	const exists = await register.findOne({ quizID, username }).exec();
	if (exists) {
		return 'exists';
	}
	const newRegistrant = new register({ quizioID, quizID, username });
	const result = await newRegistrant.save();
	return result ? extractRegistrantData(result) : null;
};

/**
 * Get list of quizzes for which user has registered
 */
export const getRegisteredQuizzesForUser = async (username) => {
	const result = await register.find({ username }).exec();
	return result ? extractRegistrantQuizList(result) : null;
};

export const getRegisteredUsers = async (quizId) => {
	const users = await register.find({ quiz: quizId });
	const result = users.map((user) => user.username);
	return result;
};
