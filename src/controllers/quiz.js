/* eslint-disable no-nested-ternary */
import logger from '../helpers/logger';
import {
	successResponseWithData,
	successResponseWithMessage,
	notFoundResponse,
	unauthorizedResponse,
	failureResponseWithMessage,
} from '../helpers/responses';
import { generateQuizioID } from '../helpers/utils';
import { getQuestionByID } from '../models/question';
import {
	getAllQuizzes,

	addNewQuiz,
	deleteQuiz,
	updateQuiz,
	getQuizById,
	publishQuiz,
	getPublishedQuiz,
} from '../models/quiz';
import { checkIfUserIsRegisteredForQuiz, getRegisteredUsersForQuiz } from '../models/register';
import { getResponse } from '../models/response';
import { getSectionByID } from '../models/section';

const controller = {
	getAllQuizzes: async (req, res) => {
		const { userID, role } = req.user;
		const quizzes = await getAllQuizzes();
		if (role === 'superadmin') {
			return quizzes ? successResponseWithData(res, { quizzes }) : notFoundResponse(res);
		}

		const registerr = quizzes.map((quiz) => checkIfUserIsRegisteredForQuiz(
			userID,
			quiz.quizioID,
		));
		const registered = await Promise.all(registerr);
		const results = quizzes.map((quiz, i) => ({ ...quiz, registered: registered[i] }));
		return quizzes ? successResponseWithData(res, { quizzes: results }) : notFoundResponse(res);
	},

	getQuizByID: async (req, res) => {
		const { userID, role } = req.user;
		const { quizID } = req.params;
		const quiz = await getQuizById(quizID);

		if (!quiz) {
			return notFoundResponse(res, 'Quiz not found!');
		}
		if (role === 'superadmin') {
			return successResponseWithData(res, { role: 'superadmin', quiz });
		}
		if (quiz.creator === userID) {
			return successResponseWithData(res, { role: 'creator', quiz });
		}
		if (quiz.owners.includes(userID)) {
			return successResponseWithData(res, { role: 'owner', quiz });
		}
		if (checkIfUserIsRegisteredForQuiz(userID, quiz.quizioID)) {
			return successResponseWithData(res, { role: 'registrant', quiz });
		}
		return successResponseWithData(res, { role: 'public', quiz });
	},

	addNewQuiz: async (req, res) => {
		const { userID } = req.user;
		const quiz = await addNewQuiz(userID);
		if (quiz) {
			return successResponseWithData(res, {
				message: 'Added new Quiz to db!',
				quiz,
			});
		}
		return failureResponseWithMessage(res, 'Failed to add new quiz!');
	},

	updateQuiz: async (req, res) => {
		const { userID, role } = req.user;
		const { quizID } = req.params;
		const quiz = await getQuizById(quizID);

		if (!quiz) return notFoundResponse(res, 'Quiz not found!');

		if (role === 'superadmin' || quiz.creator === userID || quiz.owners.includes(userID)) {
			const updatedQuiz = await updateQuiz(quizID, req.body);
			if (updatedQuiz) {
				return successResponseWithData(res, {
					message: 'Quiz updated successfully!',
					updatedQuiz,
				});
			}
			return failureResponseWithMessage(res, 'Unable to update Quiz');
		}
		return unauthorizedResponse(res);
	},

	deleteQuiz: async (req, res) => {
		const { userID, role } = req.user;
		const { quizID } = req.params;
		const quiz = await getQuizById(quizID);

		if (!quiz) return notFoundResponse(res, 'Quiz not found!');

		if (role === 'superadmin' || quiz.creator === userID || quiz.owners.includes(userID)) {
			const deleted = await deleteQuiz(quizID);
			if (deleted) {
				return successResponseWithMessage(res, 'Quiz deleted successfully!');
			}
			return failureResponseWithMessage(res, 'Failed to delete quiz!');
		}
		return unauthorizedResponse(res);
	},

	checkQuiz: async (req, res) => {
		// TODO: Save checked data to db
		const { userID, role } = req.user;
		const { quizID } = req.params;
		const checkingID = generateQuizioID();
		const quiz = await getQuizById(quizID);

		const getRole = () => (role === 'superadmin'
			? 'superadmin'
			: quiz.creator === userID
				? 'quiz creator'
				: quiz.owners.includes(userID)
					? 'quiz owner'
					: 'unauthorized');

		/** START QUIZ CHECKING */
		logger.info(`**Quiz Checking, checkingID=${checkingID}**\nQuiz checking initiated by ${userID}, role="${getRole()}"\nquizID: ${quizID}`);

		if (quiz) {
			if (role === 'superadmin' || quiz.creator === userID || quiz.owners.includes(userID)) {
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
						// return questions2.filter((question) => question.type === 'mcq');
						return questions2;
					}),
				)).flat();
				logger.info(`**Quiz Checking, checkingID=${checkingID}**\nGot list of all questions in the quiz...`);
				// console.log({ questions });

				// Get a list of all registrants
				const registrants = await getRegisteredUsersForQuiz(quizID);
				logger.info(`**Quiz Checking, checkingID=${checkingID}**\nGot list of all registrants in the quiz...`);

				// Calculate result
				const rankList = await Promise.all(registrants.map(async (registrant) => {
					const scores = await Promise.all(
						questions.map(async (question) => {
							const response = await getResponse(registrant, question.quizioID);
							console.log({ question, registrant, response });
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
					console.log('Scores', { scores });

					const marks = scores.reduce((prev, curr) => prev + curr, 0);

					return { registrant, marks };
				}));

				return successResponseWithData(res, {
					quizID,
					checkedBy: userID,
					role: getRole(),
					rankList: rankList.sort((a, b) => b.marks - a.marks),
				});
			}
			return unauthorizedResponse(res);
		}
		return notFoundResponse(res, 'Quiz not found');
	},

	publishQuiz: async (req, res) => {
		const { role, userID } = req.user;
		const { quizID } = req.params;
		const quiz = await getQuizById(quizID);

		if (quiz) {
			if (role === 'superadmin' || quiz.creator === userID || quiz.owners.includes(userID)) {
				const published = await publishQuiz(quizID, userID);
				return published
					? successResponseWithData(res, { ...published })
					: failureResponseWithMessage(res, 'failed to publish quiz');
			}
		}

		return notFoundResponse(res, 'Quiz not found!');
	},

	getPublishedQuiz: async (req, res) => {
		const { userID, role } = req.user;
		const { quizID } = req.params;
		const quiz = await getQuizById(quizID);

		if (quiz) {
			if (role === 'superadmin' || quiz.creator === userID || quiz.owners.includes(userID)) {
				const published = await getPublishedQuiz(quizID);
				return published
					? successResponseWithData(res, { ...published })
					: failureResponseWithMessage(res, 'Quiz not yet published!');
			}
		}

		return notFoundResponse(res, 'Quiz not found!');
	},

};

export default controller;
