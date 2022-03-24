import dotenv from 'dotenv';

dotenv.config();

export const loggerConfig = {
	info_file: process.env.INFO_LOG_PATH || 'logs/info.log',
	error_file: process.env.ERROR_LOG_PATH || 'logs/error.log',
	debug_file: process.env.DEBUG_LOG_PATH || 'logs/debug.log',
	console: process.env.LOG_ENABLE_CONSOLE || true,
};

export const authConfig = {
	jwtExpiry: 9999 * 24 * 60 * 60, // 9999 days (TODO: realistic expiry)
	jwtKey: process.env.JWTKEY,
};

export const logConfig = {
	maxCappedSize: 99999,
	maxCappedValue: 999999,
};

export const { IMGBB_API_KEY } = process.env;
export const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

export const quizio = {
	quizioID: 'quizioID.000000000000000000000',
};
