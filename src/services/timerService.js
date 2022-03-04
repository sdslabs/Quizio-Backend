import logger from '../helpers/logger';

const timerService = (io) => {
	// let seconds = 1000;
	let clients = 0;

	const quizzes = [{
		quizioID: 'quizioID.DA2vvLi_en83TY0z3HVAi',
		time: 10,
		msg: 'quiz is running',
	}];

	const WinnerCountdown = setInterval(() => {
		io.sockets.emit('quizTimer', quizzes);
		quizzes[0].time -= 1;
		if (quizzes[0].time === 0) {
			quizzes[0].msg = 'Quiz Over!';
			io.sockets.emit('quizTimeEnd', quizzes);
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
