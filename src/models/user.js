import user from '../schema/user';
import logger from '../helpers/logger';

/**
 * Get all the users in the db
 * @returns An array of all the users in the db
 */
export const getAllUsers = async () => {
	const users = await user.find();
	return users;
};

/**
 * Find a user by email
 * @param {*} email Email id of the user.
 * @returns UserData of the user
 */
export const findUserByEmail = async (email) => {
	const users = await user.findOne({ email });
	return users;
};

/**
 * Find a user by username
 * @param {*} username Username of the user.
 * @returns UserData of the user
 */
export const findUserByUsername = async (username) => {
	const userData = await user.findOne({ username });
	return userData;
};

/**
 * Add a new user to the db
 * @param {*} userData Must have userData.email and userData.username and other fields are optional
 * @returns User data of the new user added to the db
 */
export const addNewUser = async (userData) => {
	const newUser = new user(userData);
	const result = await newUser.save();
	logger.info('new user created!');
	logger.info(result);
	return result;
};

/**
 * Updated the user data atomically
 * @param {*} userData: Must have userData.username to filter the user
 * @returns Updated user data
 */
export const updateUserByEmail = async (userData) => {
	const newUser = await user.findOneAndUpdate({ email: userData.email }, userData);
	return newUser;
};

/**
 * adds quiz to a user
 * @returns user data of the user updated in the db
 */
export const addQuizforUser = async (username, quizId) => {
	const updatedUser = await user.updateOne(
		{ username },
		{ $addToSet: { quizzes: quizId } },
	);
	return updatedUser;
};

/**
 * deletes quiz for a user
 * @returns user data of the user updated in the db
 * @deprecated use the function exported from the register model instead
 */
export const removeQuizforUser = async (username, quizId) => {
	const updatedUser = await user.updateOne(
		{ username },
		{ $pull: { quizzes: quizId } },
	);
	return updatedUser;
};

/**
 * updates username of a user in db
 * @param {*} username: Must have username to filter user
 * @param {*} newUsername: Must have newUsername to update username field
 * @returns Updated user data
 */
export const updateUsername = async (username, newUsername) => {
	const newUsernameExists = await user.findOne({ username: newUsername });
	const oldUsernameExists = await user.findOne({ username });

	if (!oldUsernameExists) {
		return {
			success: 0,
			msg: 'Old username not found!',
		};
	}
	if (newUsernameExists) {
		return {
			success: 0,
			msg: 'New username already taken',
		};
	}
	const newUser = await user.findOneAndUpdate({ username }, { username: newUsername });
	if (newUser) {
		return {
			success: 1,
			msg: 'Username succesfully updated!',
		};
	}
};
