// import logger from '../helpers/logger';
import dayjs from 'dayjs';
import logger from '../helpers/logger';
import {
	errorResponse,
	failureResponseWithMessage,
	notFoundResponse,
	successResponseWithData,
} from '../helpers/responses';
import { getQuizById } from '../models/quiz';
import { checkIfUserIsRegisteredForQuiz } from '../models/register';
import { checkIfQuizIsSubmitted, getSubmittedQuizzes, submitQuiz } from '../models/submit';

const controller = {

	getSubmittedQuizzes: async (req, res) => {
		const { userID } = req.user;
		const submittedQuizzes = await getSubmittedQuizzes(userID);
		return submittedQuizzes
			? successResponseWithData(res, submittedQuizzes)
			: notFoundResponse(res, 'no quizzes submitted');
	},

	checkIfQuizIsSubmitted: async (req, res) => {
		const { userID } = req.user;
		const { quizID } = req.params;
		const submittedQuizzes = await checkIfQuizIsSubmitted(userID, quizID);
		return submittedQuizzes
			? successResponseWithData(res, { submitted: true, submittedQuizzes })
			: successResponseWithData(res, { submitted: false });
	},

	submitQuiz: async (req, res) => {
		/*
			- Quiz must exist
			- User must be registered for quiz
			- Server time must be less than the quiz endTime
		*/

		const d = dayjs();
		const now = d.toString();

		const { role, userID } = req.user;
		const { quizID } = req.params;

		const quiz = await getQuizById(quizID);

		// TODO: submit time validation
		// console.log((startTime <= now) && (now <= endTime));
		logger.info(`Quiz started : ${ (startTime <= now) && (now <= endTime) }`);

		if (quiz) {
			const startTime = dayjs(quiz.startTime).toString();
			const endTime = dayjs(quiz.endTime).toString();
			logger.info({
				quiz,
				startTime,
				now,
				endTime,
			});
			const isRegistered = await checkIfUserIsRegisteredForQuiz(userID, quizID);
			if (isRegistered || role === 'superadmin') {
				const submit = await submitQuiz(quizID, userID);

				if (submit === 'exists') {
					return failureResponseWithMessage(res, 'Quiz already Submitted!');
				}

				return submit ? successResponseWithData(res, {
					msg: 'Quiz Submitted successfully',
					submit,
				}) : errorResponse(res, 'Failed to submit quiz!');
			}
			return failureResponseWithMessage(res, 'User not registered for quiz!');
		}
		return notFoundResponse(res, 'Quiz does not exist!');
	},
};

export default controller;
