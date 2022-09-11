import {
	errorResponse,
	failureResponseWithMessage,
	notFoundResponse,
	successResponseWithData,
	unauthorizedResponse,
} from '../helpers/responses';
import { getQuizById } from '../models/quiz';
import {
	checkIfUserIsRegisteredForQuiz,
	getRegisteredQuizzesForUser,
	getRegisteredUsersForQuiz,
	registerUserForQuiz,
} from '../models/register';

const controller = {
	registerUserForQuiz: async (req, res) => {
		const { userID } = req.user;
		const data = req.body;
		const { quizID } = data;

		const quizExists = await getQuizById(quizID);
		if (!quizExists) return notFoundResponse(res, 'quiz not found!');

		const register = await registerUserForQuiz(userID, data);
		if (register === 'exists') return failureResponseWithMessage(res, 'Already Registered for quiz!');

		return register ? successResponseWithData(res, {
			message: 'Registered for quiz!',
			register,
		}) : errorResponse(res, 'Failed to register for quiz!');
	},

	getRegisteredQuizzesForUser: async (req, res) => {
		const { userID } = req.user;
		const quizzes = await getRegisteredQuizzesForUser(userID);
		if (quizzes) {
			return successResponseWithData(res, { quizzes });
		}
		return notFoundResponse(res, 'No quizzes found');
	},

	getIfUserIsRegisteredForQuiz: async (req, res) => {
		const { userID } = req.user;
		const { quizID } = req.params;
		const quizExists = await getQuizById(quizID);
		if (!quizExists) return notFoundResponse(res, 'quiz not found!');

		const isRegistrant = await checkIfUserIsRegisteredForQuiz(userID, quizID);

		if (isRegistrant) {
			return successResponseWithData(res, { registered: true, msg: 'User is registered for quiz' });
		}
		return successResponseWithData(res, { registered: false, msg: 'User is NOT registered for quiz' });
	},

	getRegisteredUsersForQuiz: async (req, res) => {
		const { userID, role } = req.user;
		const { quizID } = req.params;
		const quiz = await getQuizById(quizID);
		if (quiz) {
			const users = await getRegisteredUsersForQuiz(quizID);
			if (users) {
				if (role === 'superadmin'
					|| quiz.creator === userID
					|| quiz.owners.includes(userID)) {
					return successResponseWithData(res, { users });
				}
				return unauthorizedResponse(res);
			}
			return notFoundResponse(res, 'No registrants found');
		}
		return notFoundResponse(res, 'Quiz not found!');
	},

	checkAccessCodeForQuiz: async (req, res) => {
		const { quizID, accessCode } = req.params;
		const quiz = await getQuizById(quizID);
		if (quiz) {
			console.log(quiz);
			if (quiz.accessCode) {
				if (quiz.accessCode === accessCode) {
					console.log('correct');
					return successResponseWithData(res, { correct: true, msg: 'Correct Access Code' });
				}
				console.log('incorrect');
				return successResponseWithData(res, { correct: false, msg: 'Incorrect Access Code' });
			}
			return notFoundResponse(res, 'Access Code not found!');
		}
		return notFoundResponse(res, 'Quiz not found!');
	},
};

export default controller;
