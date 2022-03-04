import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import app from './src/app';
import logger from './src/helpers/logger';
import timerService from './src/services/timerService';

const { MONGOURI } = process.env;
const port = process.env.PORT || 5050;

const server = http.Server(app);
const io = new Server(server);

// Initate timer server
timerService(io);

// Connect to db
mongoose.connect(MONGOURI).then(() => logger
	.info('MongoDB successfully connected'))
	.catch((err) => logger.error(err));

// Start the server
server.listen(port, () => {
	logger.info(`Server started on port ${server.address().port}`);
});
