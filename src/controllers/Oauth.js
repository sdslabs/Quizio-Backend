/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import passport from 'passport';
import dotenv from 'dotenv';
import {
	redirectToURL, successResponseWithCookieClear, successResponseWithData,
} from '../helpers/responses';
import { generateToken } from '../helpers/token';
import {
	addNewUser, updateUserByEmail, findUserByEmail,
} from '../models/user';
import getLoggedInUser from '../services/sdslabsOauth';
import { falconConfig } from '../config/config';

dotenv.config();

export const googleOauth = {
	signUp: () => passport.authenticate('google', { scope: ['profile', 'email'] }),

	signUpCallback: async (req, res) => {
		const {
			email,
			given_name,
			family_name,
			picture,
		} = req.user.profile._json;

		const userData = {
			username: email,
			email,
			firstName: given_name,
			lastName: family_name,
			googleAvatar: picture,
		};
		const token = generateToken(userData.username);

		const users = await findUserByEmail(email);
		if (!users || (users && users.length === 0)) {
			const newUser = await addNewUser(userData);
			return redirectToURL(res, `${process.env.CLIENT_HOME_PAGE_URL}/#/login?username=${newUser.username}&token=${token}`);
		}

		const user = await updateUserByEmail(userData);
		return redirectToURL(res, `${process.env.CLIENT_HOME_PAGE_URL}/#/login?username=${user.username}&token=${token}`);
	},
};

export const githubOauth = {
	signUp: () => passport.authenticate('github', { scope: ['user:email'] }),

	signUpCallback: async (req, res) => {
		const {
			email,
			name,
			login,
			avatar_url,
		} = req.user._json;

		const userData = {
			username: email,
			email,
			firstName: name.split(' ')[0] || '',
			lastName: name.split(' ')[1] || '',
			githubUserName: login,
			githubAvatar: avatar_url,
		};
		const token = generateToken(userData.username);

		const users = await findUserByEmail(email);
		if (!users || (users && users.length === 0)) {
			const newUser = await addNewUser(userData);
			return redirectToURL(res, `${process.env.CLIENT_HOME_PAGE_URL}/#/login?username=${newUser.username}&token=${token}`);
		}

		const user = await updateUserByEmail(userData);

		return redirectToURL(res, `${process.env.CLIENT_HOME_PAGE_URL}/#/login?username=${user.username}&token=${token}`);
	},
};

export const sdslabsOauth = {
	signUp: async (req, res) => {
		const user = await getLoggedInUser();
		if (!user) return redirectToURL(res, `${falconConfig.accountsUrl}/login?redirect=http://quizioapi.sdslabs.local/api/v2/auth/`);
		return successResponseWithData(res, user);
	}
	,

	// signUpCallback = () => {

	// }
};

const oauthController = {
	/**
	 * [Must reach here only after doing isAuth first]
	 * @returns the user data and the jwt token */
	login: async (req, res) => successResponseWithData(res, {
		user: req.user,
		token: req.token,
	}, 200),

	/**
	 * Clears the cookies
	 * @returns A success message string
	 */
	logout: (req, res) => successResponseWithCookieClear(res, {
		message: 'Successfully logged out!',
	}, {
		name: 'token',
	}),
};

export default oauthController;
