// import logger from '../helpers/logger';
import {
	errorResponse,
	failureResponseWithMessage,
	notFoundResponse,
	successResponseWithData,
} from '../helpers/responses';
import { getQuizById } from '../models/quiz';
import { checkIfUserIsRegisteredForQuiz } from '../models/register';
import { submitQuiz } from '../models/submit';

const controller = {
	submitQuiz: async (req, res) => {
		/*
			- Quiz must exist
			- User must be registered for quiz
			- Server time must be less than the quiz endTime
		*/

		const d = new Date();
		const now = d.toString();

		const { username, role } = req.user;
		const { quizID } = req.params;

		const quiz = await getQuizById(quizID);
		const startTime = new Date(quiz.startTime).toString();
		const endTime = new Date(quiz.endTime).toString();
		console.log({
			quiz,
			startTime,
			now,
			endTime,
		});

		// console.log((startTime <= now) && (now <= endTime));

		if (quiz) {
			const isRegistered = await checkIfUserIsRegisteredForQuiz(username, quizID);
			if (isRegistered || role === 'superadmin') {
				const submit = await submitQuiz(quizID, username);

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
