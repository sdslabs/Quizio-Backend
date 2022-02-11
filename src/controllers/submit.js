import {
	errorResponse,
	failureResponseWithMessage,
	notFoundResponse,
	successResponseWithData,
} from '../helpers/responses';
import { getQuizById } from '../models/quiz';
import { submitQuiz } from '../models/submit';

const controller = {
	submitQuiz: async (req, res) => {
		const { username } = req.user;
		const { quizID } = req.body;

		const quizExists = await getQuizById(quizID);
		if (quizExists) {
			const submit = await submitQuiz(quizID, username);

			if (submit === 'exists') {
				return failureResponseWithMessage(res, 'Quiz already Submitted!');
			}

			return submit ? successResponseWithData(res, {
				msg: 'Quiz Submitted successfully',
				submit,
			}) : errorResponse(res, 'Failed to submit quiz!');
		}
		return notFoundResponse(res, 'Quiz does not exist!');
	},
};

export default controller;
