/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import passport from 'passport';
import dotenv from 'dotenv';
import logger from '../helpers/logger';
import {
	redirectToURL,
	successResponseWithCookieClear,
	successResponseWithData,
	tokenErrorResponse,
	unauthenticatedResponse,
} from '../helpers/responses';
import { generateToken, verifyToken } from '../helpers/token';
import {
	addNewUser, updateUserByEmail, getUserByEmail,
} from '../models/user';
import { generateQuizioID, generateUserName } from '../helpers/utils';

dotenv.config();

export const googleOauth = {
	signUp: () => passport.authenticate('google', { scope: ['profile', 'email'] }),

	signUpCallback: async (req, res) => {
		const quizioID = generateQuizioID();
		const {
			email,
			given_name,
			family_name,
			picture,
		} = req.user.profile._json;

		const userData = {
			username: generateUserName(given_name, family_name),
			email,
			firstName: given_name,
			lastName: family_name,
			googleAvatar: picture,
		};
		const jwtToken = generateToken({ quizioID });

		const users = await getUserByEmail(email);

		if (!users || (users && users.length === 0)) {
			// User not found, so it's a new user
			const newUser = await addNewUser({ ...userData, quizioID });
			return redirectToURL(res, `${process.env.CLIENT_HOME_PAGE_URL}/?username=${newUser.username}&&jwtToken=${jwtToken}&new=true`);
		}
		// User found, so it's an old user
		const user = await updateUserByEmail(userData);
		return redirectToURL(res, `${process.env.CLIENT_HOME_PAGE_URL}/?username=${user.username}&jwtToken=${jwtToken}&new=false`);
	},
};

export const githubOauth = {
	signUp: () => passport.authenticate('github', { scope: ['user:email'] }),

	signUpCallback: async (req, res) => {
		const quizioID = generateQuizioID();
		const {
			email,
			name,
			login,
			avatar_url,
		} = req.user._json;

		const userData = {
			username: generateUserName(name.split(' ')[0] || '', name.split(' ')[1] || ''),
			email,
			firstName: name.split(' ')[0] || '',
			lastName: name.split(' ')[1] || '',
			githubUserName: login,
			githubAvatar: avatar_url,
		};

		const jwtToken = generateToken({ quizioID });

		const users = await getUserByEmail(email);
		if (!users || (users && users.length === 0)) {
			// User not found, so it's a new user
			const newUser = await addNewUser({ ...userData, quizioID });
			logger.info('added new user: ', { newUser });
			return redirectToURL(res, `${process.env.CLIENT_HOME_PAGE_URL}/?username=${newUser.username}&&jwtToken=${jwtToken}&new=true`);
		}
		// User found, so it's an old user
		const user = await updateUserByEmail(userData);
		return redirectToURL(res, `${process.env.CLIENT_HOME_PAGE_URL}/?username=${user.username}&&jwtToken=${jwtToken}&new=false`);
	},
};

const oauthController = {
	/**
	 * @returns the user data and the jwt token */
	check: async (req, res) => successResponseWithData(
		res,
		{
			user: req.user,
		},
	),
	/**
	 * @returns the user data and the jwt token */
	login: async (req, res) => {
		const { jwtToken } = req.query;

		if (jwtToken) {
			logger.info('Login with Token');
			const payload = verifyToken(res, jwtToken);
			if (payload) {
				return successResponseWithData(
					res,
					{
						msg: 'Token verified!',
						jwtToken,
					},
				);
				// return successResponseWithCookie(res,
				// 	'User logged in successfully!', {
				// 		name: 'jwtToken',
				// 		value: jwtToken,
				// 	});
			}
			return tokenErrorResponse(res);
		}
		return unauthenticatedResponse(res, 'jwtToken not found');
		// successResponseWithData(res, {
		// 	user: req.user,
		// 	token: req.token,
		// }, 200);
	},

	/**
	 * Clears the jwtToken Cookie
	 * @returns A success message string
	 */
	logout: (req, res) => successResponseWithCookieClear(res, {
		message: 'Successfully logged out!',
	}, {
		name: 'jwtToken',
	}),
};

export default oauthController;
