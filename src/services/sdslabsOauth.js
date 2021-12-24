import axios from 'axios';
import { falconConfig } from '../config/config';

// Constants
const COOKIE_NAME = 'sdslabs';

/**
 * Make a get request at the specified url along with the bearer token
 * @param {*} url
 * @param {*} token
 * @returns Response of the request 🚀
 */
const makeRequest = async (url, token) => {
	const headers = {
		Authorization: `Bearer ${token}`,
		'Content-Type': 'application/json',
	};

	const response = await axios.get(url, headers);
	return response;
};

/**
 * Get Access Token for the client
 * @param {*} config
 * @returns The Access Token 🚀
 */
const getToken = async (clientId, clientSecret, accessTokenURL) => {
	const data = {
		client_id: clientId,
		client_secret: clientSecret,
		grant_type: 'client_credentials',
		scope: 'email image_url organizations',
	};
	const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
	const response = await axios.post(accessTokenURL, data, headers);
	return response.access_token;
};

/**
 * Get user data of the logged in user
 * @param {*} config
 * @param {*} cookies
 * @returns The user data 🚀
 */
const getLoggedInUser = async (cookies) => {
	if (!cookies) {
		// console.log('no cookie');
		return null;
	}
	const sdsLabsCookie = cookies[COOKIE_NAME];
	// console.log('sdslabs sdsLabsCookie: ', sdsLabsCookie);
	if (sdsLabsCookie === '') return null;
	const token = await getToken(
		falconConfig.clientId,
		falconConfig.clientSecret,
		falconConfig.accessTokenURL,
	);
	// console.log('token in get logged in user: ', token);
	const userData = await makeRequest(`${falconConfig.urlResourceOwner}/logged_in_user/${sdsLabsCookie}`, token);
	return userData;
};

export default getLoggedInUser;

/* <<<unused functions>>>
const get_user_by_id = async (id, config) => {
	const token = await getToken(config)
	const response = await makeRequest(`${config.uRLResourceOwner}id/${id}`, token)
	return response
}

const get_user_by_username = async (username, config) => {
	const token = await getToken(config)
	const response = await makeRequest(`${config.uRLResourceOwner}username/${username}`, token)
	return response
}

const get_user_by_email = async (email, config) => {
	const token = await getToken(config)
	const response = await makeRequest(`${config.uRLResourceOwner}email/${email}`, token)
	return response
}

const login = async (config, cookies) => {
	const user_data = await getLoggedInUser(config, cookies)
	return new Promise((resolve, reject) => {
		if (user_data == null) {
			header('location: ' + config.AccountsURL + 'login?redirect=//' + config.RedirectURL)
			reject(null)
		}
		resolve(user_data)
	})
}
*/
