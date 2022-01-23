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
	/**
	 * Returns the list of all quizzes only for superadmins
	 */
	getAllQuizzes: async (req, res) => {
		const quizzes = await getAllQuizzes();
		if (quizzes) {
			return successResponseWithData(res, { quizzes });
		}
		return notFoundResponse(res);
	},
	/**
	 * Returns the requested quiz data only for superadmins,
	 * quiz creator, quiz owners and quiz registrants
	 */
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
	/**
	 * A new quiz is added to the db with the requesting user as the creator
	 */
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
	/**
	 * Updates the quiz to the data sent in the body only when superadmin
	 * or quiz owner or quiz creator makes the call
	 */
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
	/**
	 * Deletes the quiz only when superadmin
	 * or quiz owner or quiz creator makes the call
	 */
	deleteQuiz: async (req, res) => {
		const { username, role } = req.user;
		const { quizioID } = req.params;
		const quiz = await getQuizById(quizioID);

		if (quiz) {
			if (role === 'superadmin' || quiz.creator === username || quiz.owners.includes(username)) {
				const deleted = await deleteQuiz(quizioID);
				if (deleted) {
					return successResponseWithMessage(res, 'Quiz deleted successfully!');
				}
			}
			return unauthorizedResponse(res);
		}
		return notFoundResponse(res, 'Quiz not found!');
	},

};

export default controller;
