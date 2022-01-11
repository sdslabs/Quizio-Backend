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

export const logConfig = {
	maxCappedSize: 1024,
	maxCappedValue: 5,
};
