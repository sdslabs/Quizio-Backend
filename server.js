import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import app from './src/app';
import logger from './src/helpers/logger';
import timerService from './src/services/timerService';

// const {
// 	MONGO_CONNECTION_TYPE,
// 	MONGO_REMOTE_URI,
// 	MONGO_USERNAME,
// 	MONGO_PASSWORD,
// 	MONGO_HOSTNAME,
// 	MONGO_INITDB_DATABASE,
// } = process.env;

const { CLIENT_HOME_PAGE_URL } = process.env;
const port = process.env.API_PORT || 5050;
// const MONGO_LOCAL_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:27017/${MONGO_INITDB_DATABASE}`;

const server = http.Server(app);
const io = new Server(server, {
	cors: {
		// origin: 'http://localhost:3006',
		origin: CLIENT_HOME_PAGE_URL,
	},
});

// Initate timer server
timerService(io);

const MONGO_URI = process.env.MONGOURI;
// const getMongoURI = () => {
// 	switch (MONGO_CONNECTION_TYPE) {
// 	case 'remote':
// 		return MONGO_REMOTE_URI;
// 	case 'local':
// 		return MONGO_LOCAL_URI;
// 	default:
// 		return MONGO_LOCAL_URI;
// 	}
// };

// Connect to db
mongoose.connect(MONGO_URI).then(() => logger
	.info('MongoDB successfully connected'))
	.catch((err) => logger.error(`MongoDB connection failed: ${err}`));

// Start the server
server.listen(port, () => {
	logger.info(`Server started on port ${server.address().port}`);
});
