import { extractRegistrantData, generateQuizioID } from '../helpers/utils';
import register from '../schema/register';

/**
 * Add a user as a registrant to a quiz
 */
export const registerUserForQuiz = async (username, quizID) => {
	const quizioID = generateQuizioID();

	const exists = register.find({ quizID, username });
	if (exists) {
		return 'exists';
	}
	const newRegistrant = new register({ quizioID, quizID, username });
	const result = await newRegistrant.save();
	return result ? extractRegistrantData(result) : null;
};

export const removeFromQuiz = async (registerData) => {
	const result = await register.findOneAndDelete(registerData);
	return result;
};

export const getRegisteredUsers = async (quizId) => {
	const users = await register.find({ quiz: quizId });
	const result = users.map((user) => user.username);
	return result;
};
