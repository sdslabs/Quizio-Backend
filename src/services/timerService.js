import dayjs from 'dayjs';
import logger from '../helpers/logger';
import { getAllQuizzes } from '../models/quiz';

let ongoingQuizzes = [];
let removeFromOngoingQuizzes = [];

export const removeOngoingQuizFromTimer = (quizioID) => {
	const index = ongoingQuizzes.findIndex((quiz) => quiz.quizioID === quizioID);
	if (index !== -1) {
		removeFromOngoingQuizzes.push(quizioID);
	}
};

const getUpcomingQuizzes = async () => {
	// console.log('dayjs()', dayjs().format().toLocaleString());
	const quizzes = await getAllQuizzes();

	return quizzes.filter((quiz) => {
		// const startTime = dayjs(quiz.startTime);
		const endTime = dayjs(quiz.endTime);
		const now = dayjs();

		// const startTimeString = startTime.toString();
		// const endTimeString = endTime.toString();
		// const nowString = now.toString();

		// if (endTime.isAfter(now)) {
		// 	console.log({
		// 		quizID: quiz.quizioID,
		// 		startTimeString,
		// 		endTimeString,
		// 		nowString,
		// 		ongoing: (startTime <= now) && (now <= endTime),
		// 		timeLeft: dayjs(quiz.endTime).diff(now, 'seconds'),
		// 		locale: dayjs.locale(),
		// 	});
		// }
		return endTime.isAfter(now);
	}).map((quiz) => ({
		quizioID: quiz.quizioID,
		time: dayjs(quiz.endTime).diff(dayjs(), 'seconds'),
		startTime: quiz.startTime,
	}));
};

const timerService = async (io) => {
	let clients = 0;
	logger.info('TIMER SERVICE: INITIATE');
	let upcomingQuizzes = [];

	setInterval(async () => {
		upcomingQuizzes = await getUpcomingQuizzes();
	}, 1000);

	setInterval(() => {
		io.sockets.emit('quizTimer', ongoingQuizzes);

		if (removeFromOngoingQuizzes.length > 0) {
			ongoingQuizzes = ongoingQuizzes
				.filter((quiz) => !removeFromOngoingQuizzes.includes(quiz.quizioID));
			removeFromOngoingQuizzes = [];
		}

		const newAddition = upcomingQuizzes
			.filter((quiz) => !ongoingQuizzes
				.some((ongoingQuiz) => ongoingQuiz.quizioID === quiz.quizioID)
				&& dayjs(quiz.startTime).isBefore(dayjs()))
			.map((quiz) => ({
				quizioID: quiz.quizioID,
				time: quiz.time,
			}));

		ongoingQuizzes = ongoingQuizzes.concat(newAddition);

		for (let i = 0; i < ongoingQuizzes.length; i += 1) {
			ongoingQuizzes[i].time -= 1;
			if (ongoingQuizzes[i].time <= 0) {
				ongoingQuizzes.splice(i, 1);
			}
		}
		// logger.info('TIMER SERVICE: UPDATE');
		// logger.info(ongoingQuizzes);
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
