/* eslint-disable no-nested-ternary */
import logger from '../helpers/logger';
import {
	successResponseWithData,
	successResponseWithMessage,
	notFoundResponse,
	unauthorizedResponse,
	errorResponse,
} from '../helpers/responses';
import { generateQuizioID } from '../helpers/utils';
import { getQuestionByID } from '../models/question';
import {
	getAllQuizzes,

	addNewQuiz,
	deleteQuiz,
	updateQuiz,
	getQuizById,
} from '../models/quiz';
import { checkIfUserIsRegisteredForQuiz, getRegisteredUsersForQuiz } from '../models/register';
import { getResponse } from '../models/response';
import { getSectionByID } from '../models/section';

const controller = {
	/**
	 * Returns the list of all quizzes only for superadmins
	 */
	getAllQuizzes: async (req, res) => {
		const { username, role } = req.user;
		const quizzes = await getAllQuizzes();
		if (role === 'superadmin') {
			return quizzes ? successResponseWithData(res, { quizzes }) : notFoundResponse(res);
		}

		const registerr = quizzes.map((quiz) => checkIfUserIsRegisteredForQuiz(
			username,
			quiz.quizioID,
		));
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
		if (quiz) {
			if (role === 'superadmin') {
				return successResponseWithData(res, { role: 'superadmin', quiz });
			}
			if (quiz.creator === username) {
				return successResponseWithData(res, { role: 'creator', quiz });
			}
			if (quiz.owners.includes(username)) {
				return successResponseWithData(res, { role: 'owner', quiz });
			}
			if (quiz.registrants && quiz.registrants.includes(username)) {
				return successResponseWithData(res, { role: 'registrant', quiz });
			}
			return successResponseWithData(res, { role: 'public', quiz });
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
				const quiz2 = await updateQuiz(quizID, req.body);
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

	/**
	 * Check a quiz by ID (only autocheck questions supported)
	 */
	checkQuiz: async (req, res) => {
		const { username, role } = req.user;
		const { quizID } = req.params;
		const checkingID = generateQuizioID();
		const quiz = await getQuizById(quizID);

		const getRole = () => (role === 'superadmin'
			? 'superadmin'
			: quiz.creator === username
				? 'quiz creator'
				: quiz.owners.includes(username)
					? 'quiz owner'
					: 'unauthorized');

		/** START QUIZ CHECKING */
		logger.info(`**Quiz Checking, checkingID=${checkingID}**\nQuiz checking initiated by ${username}, role="${getRole()}"\nquizID: ${quizID}`);

		if (quiz) {
			if (role === 'superadmin' || quiz.creator === username || quiz.owners.includes(username)) {
				// Get a list of all the questions in the quiz
				const questions = (await Promise.all(
					quiz.sections.map(async (sectionID) => {
						const section = await getSectionByID(sectionID);
						// console.log('section: ', { sectionID, section });
						const questions2 = await Promise.all(
							section.questions.map(async (questionID) => {
								// console.log({ sectionID, questionID });
								const question = await getQuestionByID(questionID);
								return { ...question, sectionID };
							}),
						);
						// console.log({ sectionID, questions2 });
						return questions2.filter((question) => question.type === 'mcq');
					}),
				)).flat();
				logger.info(`**Quiz Checking, checkingID=${checkingID}**\nGot list of all questions in the quiz...`);

				// Get a list of all registrants
				const registrants = await getRegisteredUsersForQuiz(quizID);
				logger.info(`**Quiz Checking, checkingID=${checkingID}**\nGot list of all registrants in the quiz...`);

				// return successResponseWithData(res, { questions, registrants });
				// Calculate result
				const rankList = await Promise.all(registrants.map(async (registrant) => {
					const scores = await Promise.all(
						questions.map(async (question) => {
							const response = await getResponse(registrant, question.quizioID);
							const answerChoice = response?.answerChoice[0];
							if (answerChoice) {
								const score = question.choices.find(
									(choice) => choice.quizioID === answerChoice,
								).marks;
								return score;
							}
							return 0;
						}),
					);

					const marks = scores.reduce((prev, curr) => prev + curr, 0);

					return { registrant, marks };
				}));

				return successResponseWithData(res, {
					quizID,
					checkedBy: username,
					role: getRole(),
					rankList: rankList.sort((a, b) => b.marks - a.marks),
				});
			}
			return unauthorizedResponse(res);
		}
		return notFoundResponse(res, 'Quiz not found');
	},

};

export default controller;
