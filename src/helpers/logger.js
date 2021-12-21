import winston from 'winston';
import { loggerConfig } from '../config/config';

const createTransports = (config) => {
	const customTransports = [];

	// setup the file transport
	if (config.info_file) {
		customTransports.push(
			new winston.transports.File({
				filename: config.info_file,
				level: 'info',
			}),
		);
	}

	if (config.error_file) {
		customTransports.push(
			new winston.transports.File({
				filename: config.error_file,
				level: 'error',
			}),
		);
	}

	if (config.debug_file) {
		customTransports.push(
			new winston.transports.File({
				filename: config.debug_file,
				level: 'debug',
			}),
		);
	}

	// if config.console is set to true, a console logger will be included.
	if (config.console) {
		customTransports.push(
			new winston.transports.Console({
				level: 'debug',
			}),
		);
	}

	return customTransports;
};

const create = (config) => new winston.createLogger({
	transports: createTransports(config),
	format: winston.format.combine(
		winston.format.colorize({ all: true }),
		winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		winston.format.label({ label: 'Quizio Backend' }),
		winston.format.printf(
			(info) => `${info.label} (${info.timestamp}) [${info.level}] : ${info.message}`,
		),
	),
});

const logger = create(loggerConfig);

export default logger;
