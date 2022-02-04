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
import { checkIfUserIsRegisteredForQuiz } from '../models/register';
import { isUserSubmitted } from '../models/submit';

const controller = {
	/**
	 * Returns the list of all quizzes only for superadmins
	 */
	getAllQuizzes: async (req, res) => {
		const { username, role } = req.user;
		const quizzes = await getAllQuizzes();
		const quizzesQuizioID = [];
		quizzes.map((quiz) => quizzesQuizioID.push(quiz.quizioID));
		if (role === 'superadmin') {
			return quizzes ? successResponseWithData(res, { quizzesQuizioID }) : notFoundResponse(res);
		}

		const registerr = quizzes.map((quiz) => checkIfUserIsRegisteredForQuiz(username,
			quiz.quizioID));
		const registered = await Promise.all(registerr);
		const results = quizzes.map((quiz, i) => ({ ...quiz, registered: registered[i] }));
		return quizzes ? successResponseWithData(res, { quizzes: results }) : notFoundResponse(res);
	},
	/**
 * Returns the requested quiz data only for superadmins,
 * quiz creator, quiz owners and quiz registrants
 */
	getQuizByID: async (req, res) => {
		const { username, role } = req.user;
		const { quizID } = req.params;
		const quiz = await getQuizById(quizID);
		const isSubmitted = await isUserSubmitted(username);
		if (quiz) {
			if ((role === 'superadmin'
				|| quiz.creator === username
				|| quiz.owners.includes(username)
				|| quiz.registrants.includes(username))
				&& !isSubmitted) {
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
		const { quizID } = req.params;
		const quiz = await getQuizById(quizID);
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
		const { quizID } = req.params;
		const quiz = await getQuizById(quizID);

		if (quiz) {
			if (role === 'superadmin' || quiz.creator === username || quiz.owners.includes(username)) {
				const deleted = await deleteQuiz(quizID);
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
