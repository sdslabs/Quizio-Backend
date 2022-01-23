import {
	successResponseWithData,
	successResponseWithMessage,
	failureResponseWithMessage,
} from '../helpers/responses';
import {
	getAllQuizzes,
	addNewQuiz,
	deleteQuiz,
	updateQuiz,
	getQuizById,
} from '../models/quiz';

const controller = {
	getAllQuizzes: async (req, res) => {
		const quizzes = await getAllQuizzes();
		return successResponseWithData(res, {
			quizzes,
		}, 200);
	},

	getQuizById: async (req, res) => {
		const quiz = await getQuizById(req.params.quizId);
		return successResponseWithData(res, {
			quiz,
		}, 200);
	},

	addNewQuiz: async (req, res) => {
		const quiz = await addNewQuiz(req.user.username);
		return successResponseWithData(res, {
			message: 'Added new Quiz to db!',
			quiz,
		}, 200);
	},

	updateQuiz: async (req, res) => {
		const quiz = await updateQuiz(req.params.quizId, req.body.quiz);
		return successResponseWithData(res, {
			message: 'Quiz updated successfully!',
			quiz,
		}, 200);
	},

	deleteQuiz: async (req, res) => {
		const deleted = await deleteQuiz(req.params.quizioId);
		if (deleted) {
			return successResponseWithMessage(res, 'Quiz deleted successfully!');
		}
		return failureResponseWithMessage(res, 'Failed to delete quiz!');
	},

};

export default controller;
