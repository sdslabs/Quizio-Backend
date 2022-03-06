import dayjs from 'dayjs';
import 'dayjs/locale/en-in';
import logger from '../helpers/logger';
import { getAllQuizzes } from '../models/quiz';

dayjs.locale('en-in');

const getOngoingQuizzes = async () => {
	console.log('dayjs()', dayjs().format().toLocaleString());
	const quizzes = await getAllQuizzes();

	return quizzes.filter((quiz) => {
		const startTime = dayjs(quiz.startTime);
		const endTime = dayjs(quiz.endTime);
		const now = dayjs();

		const startTimeString = startTime.toString();
		const endTimeString = endTime.toString();
		const nowString = now.toString();

		if (startTime.isBefore(now) && endTime.isAfter(now)) {
			console.log({
				quizID: quiz.quizioID,
				startTimeString,
				endTimeString,
				nowString,
				ongoing: (startTime <= now) && (now <= endTime),
				timeLeft: dayjs(quiz.endTime).diff(now, 'seconds'),
				locale: dayjs.locale(),
			});
		}
		return startTime.isBefore(now) && endTime.isAfter(now);
	}).map((quiz) => ({
		quizioID: quiz.quizioID,
		time: dayjs(quiz.endTime).diff(dayjs(), 'seconds'),
	}));
};

const timerService = async (io) => {
	let clients = 0;
	logger.info('TIMER SERVICE: INITIATE');
	const ongoingQuizzes = await getOngoingQuizzes();
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
