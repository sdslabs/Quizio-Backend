import dayjs from 'dayjs';
import logger from '../helpers/logger';
import { getAllQuizzes } from '../models/quiz';

let ongoingQuizzes = [];
let removeFromOngoingQuizzes = [];

export const removeOngoingQuizFromTimer = (quizioID) => {
	const index = ongoingQuizzes.findIndex((quiz) => quiz.quizioID === quizioID);
	if (index !== -1) removeFromOngoingQuizzes.push(quizioID);
};

/**
 * @returns All upcoming quizzes
 */
const getUpcomingQuizzes = async () => {
	const quizzes = await getAllQuizzes();

	return quizzes.filter((quiz) => {
		const endTime = dayjs(quiz.endTime);
		const now = dayjs();
		return endTime.isAfter(now);
	}).map((quiz) => ({
		quizioID: quiz.quizioID,
		time: dayjs(quiz.endTime).diff(dayjs(), 'seconds'),
		startTime: quiz.startTime,
		name: quiz.name,
	}));
};

/**
 * Generates a timer service
 * @param {*} io The socket object
 */
const timerService = async (io) => {
	let clients = 0;
	logger.info('TIMER SERVICE: INITIATE');
	let upcomingQuizzes = [];

	// Update upcoming quizzes every second
	setInterval(async () => {
		upcomingQuizzes = await getUpcomingQuizzes();
	}, 1000);

	// Emit timer for ongoing quizzes every second
	setInterval(() => {
		io.sockets.emit('quizTimer', ongoingQuizzes);

		// Remove all quizzes marked for removal from ongoing quizzes
		if (removeFromOngoingQuizzes.length > 0) {
			ongoingQuizzes = ongoingQuizzes
				.filter((quiz) => !removeFromOngoingQuizzes.includes(quiz.quizioID));
			removeFromOngoingQuizzes = [];
		}

		// Add new upcoming quizzes
		const newAddition = upcomingQuizzes
			.filter((quiz) => !ongoingQuizzes
				.some((ongoingQuiz) => ongoingQuiz.quizioID === quiz.quizioID)
				&& dayjs(quiz.startTime).isBefore(dayjs()))
			.map((quiz) => ({
				quizioID: quiz.quizioID,
				time: quiz.time,
				name: quiz.name,
			}));

		ongoingQuizzes = ongoingQuizzes.concat(newAddition);

		// Update remaining time on ongoing quizzes
		for (let i = 0; i < ongoingQuizzes.length; i += 1) {
			ongoingQuizzes[i].time -= 1;
			if (ongoingQuizzes[i].time <= 0) {
				ongoingQuizzes.splice(i, 1);
			}
		}
		logger.info('TIMER SERVICE: UPDATE');
		logger.info(ongoingQuizzes);
	}, 1000);

	// Manage socket connection and disconnect
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
