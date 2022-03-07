// import logger from '../helpers/logger';
import {
	errorResponse,
	failureResponseWithMessage,
	notFoundResponse,
	successResponseWithData,
} from '../helpers/responses';
import { getQuizById } from '../models/quiz';
import { checkIfUserIsRegisteredForQuiz } from '../models/register';
import { getSubmittedQuizzes, submitQuiz } from '../models/submit';

const controller = {

	getSubmittedQuizzes: async (req, res) => {
		const { userID } = req.user;
		const submittedQuizzes = await getSubmittedQuizzes(userID);
		return submittedQuizzes
			? successResponseWithData(res, submittedQuizzes)
			: notFoundResponse(res, 'no quizzes submitted');
	},

	submitQuiz: async (req, res) => {
		/*
			- Quiz must exist
			- User must be registered for quiz
			- Server time must be less than the quiz endTime
		*/

		const d = new Date();
		const now = d.toString();

		const { username, role, userID } = req.user;
		const { quizID } = req.params;

		const quiz = await getQuizById(quizID);

		// TODO: submit time validation
		// console.log((startTime <= now) && (now <= endTime));

		if (quiz) {
			const startTime = new Date(quiz.startTime).toString();
			const endTime = new Date(quiz.endTime).toString();
			console.log({
				quiz,
				startTime,
				now,
				endTime,
			});
			const isRegistered = await checkIfUserIsRegisteredForQuiz(username, quizID);
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
