import {
	successResponseWithData,
	successResponseWithMessage,
	notFoundResponse,
	unauthorizedResponse,
	errorResponse,
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
		if (quizzes) {
			return successResponseWithData(res, { quizzes });
		}
		return notFoundResponse(res);
	},

	getQuizById: async (req, res) => {
		const { username, role } = req.user;
		const { quizioID } = req.params;
		const quiz = await getQuizById(quizioID);
		if (quiz) {
			if (role === 'superadmin'
				|| quiz.creator === username
				|| quiz.owners.includes(username)
				|| quiz.registrants.includes(username)) {
				return successResponseWithData(res, { quiz });
			}
			return unauthorizedResponse(res);
		}

		return notFoundResponse(res, 'Quiz not found!');
	},

	addNewQuiz: async (req, res) => {
		const { username } = req.user;
		const quiz = await addNewQuiz(username);
		if (quiz) {
			return successResponseWithData(res, {
				message: 'Added new Quiz to db!',
				quiz,
			});
		}
		return errorResponse(res, 'Failed to add new quiz!');
	},

	updateQuiz: async (req, res) => {
		const { username, role } = req.user;
		const { quizioID } = req.params;
		const quiz = await getQuizById(quizioID);
		if (quiz) {
			if (role === 'superadmin' || quiz.creator === username || quiz.owners.includes(username)) {
				const quiz2 = await updateQuiz(req.params.quizioId, req.body);
				if (quiz2) {
					return successResponseWithData(res, {
						message: 'Quiz updated successfully!',
						quiz2,
					});
				}
				return errorResponse(res, 'Unable to update Quiz');
			}
			return unauthorizedResponse(res);
		}
		return notFoundResponse(res, 'Quiz not found!');
	},

	deleteQuiz: async (req, res) => {
		const { quizioID } = req.params;
		const deleted = await deleteQuiz(quizioID);
		if (deleted) {
			return successResponseWithMessage(res, 'Quiz deleted successfully!');
		}
		return errorResponse(res, 'Failed to delete quiz!');
	},

};

export default controller;
