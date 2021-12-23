import dotenv from 'dotenv';

dotenv.config();

export const loggerConfig = {
	info_file: process.env.INFO_LOG_PATH || 'logs/info.log',
	error_file: process.env.ERROR_LOG_PATH || 'logs/error.log',
	debug_file: process.env.DEBUG_LOG_PATH || 'logs/debug.log',
	console: process.env.LOG_ENABLE_CONSOLE || true,
};

export const authConfig = {
	jwtExpiry: 86400,
	jwtKey: process.env.JWTKEY,
};

export const falconConfig = {
	clientId: process.env.falconClientID,
	clientSecret: process.env.falconClientSecret,
	tokenHost: 'http://falcon.sdslabs.local',
	accessTokenURL: 'http://falcon.sdslabs.local/access_token',
	authorizePath: 'http://falcon.sdslabs.local/authorize',
	scopes: ['email', 'image_url', 'organizations'],
	urlResourceOwner: 'http://falcon.sdslabs.local/users',
	accountsUrl: 'http://arceus.sdslabs.local',
};
