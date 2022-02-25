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
export const getUserByEmail = async (email) => {
	const users = await user.findOne({ email });
	return users;
};

/**
 * Find a user by quizioID
 * @param {*} userID quizioID of the user.
 * @returns UserData of the user
 */
export const getUserWithUserID = async (userID) => {
	const userData = await user.findOne({ quizioID: userID });
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
