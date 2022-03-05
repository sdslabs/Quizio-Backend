import logger from '../helpers/logger';
import { getAllQuizzes } from '../models/quiz';

const timerService = async (io) => {
	let clients = 0;

	// const quizzes = [{
	// 	quizioID: 'quizioID.DA2vvLi_en83TY0z3HVAi',
	// 	time: 10,
	// }];

	logger.info('TIMER SERVICE: INITIATE');
	const quizzes = await getAllQuizzes();
	const ongoingQuizzes = quizzes.filter((quiz) => {
		const startTime = new Date(quiz.startTime).toString();
		const endTime = new Date(quiz.endTime).toString();
		const now = new Date().toString();

		// const startTimeString = new Date(quiz.startTime).toString();
		// const endTimeString = new Date(quiz.endTime).toString();
		// const nowString = new Date().toString();
		// console.log({
		// 	quizID: quiz.quizioID,
		// 	startTimeString,
		// 	endTimeString,
		// 	nowString,
		// 	ongoing: (startTime <= now) && (now <= endTime),
		// });
		return (startTime <= now) && (now <= endTime);
	}).map((quiz) => ({
		quizioID: quiz.quizioID,
		time: 1500,
	}));
	logger.info('TIMER SERVICE: GET ALL QUIZZES: ');
	logger.info({ ongoingQuizzes });

	setInterval(() => {
		io.sockets.emit('quizTimer', ongoingQuizzes);
		for (let i = 0; i < ongoingQuizzes.length; i += 1) {
			ongoingQuizzes[i].time -= 1;
			if (ongoingQuizzes[i].time <= 0) {
				ongoingQuizzes[i].time = 0;
			}
		}
		logger.info('TIMER SERVICE: UPDATE');
		logger.info(ongoingQuizzes);
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
