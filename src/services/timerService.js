import logger from '../helpers/logger';

const timerService = (io) => {
	let seconds = 10;
	let clients = 0;

	const WinnerCountdown = setInterval(() => {
		io.sockets.emit('quizTimer', seconds);
		seconds -= 1;
		if (seconds === 0) {
			io.sockets.emit('quizTimeEnd', 'Quiz Over!');
			clearInterval(WinnerCountdown);
		}
	}, 1000);

	io.on('connection', (socket) => {
		clients += 1;
		socket.on('disconnect', () => {
			clients -= 1;
			logger.info(`A user disconnected from timer service, total clients: ${clients}`);
		});
		logger.info(`User connected to timer, total clients: ${clients}`);
	});
};
export default timerService;
