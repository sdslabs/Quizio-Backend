import { successResponseWithData } from '../helpers/responses';
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
		const quiz = await deleteQuiz(req.params.quizId);
		return successResponseWithData(res, {
			message: 'Quiz deleted successfully!',
			quiz,
		}, 200);
	},

};

export default controller;
