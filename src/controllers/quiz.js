/* eslint-disable no-nested-ternary */
import { quizio } from '../config/config';
import generateRanklist from '../helpers/generateRanklist';
import logger from '../helpers/logger';
import {
	successResponseWithData,
	successResponseWithMessage,
	notFoundResponse,
	unauthorizedResponse,
	failureResponseWithMessage,
} from '../helpers/responses';
import { generateQuizioID, getRole } from '../helpers/utils';
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
import { updateRanklist } from '../models/ranklist';
import { checkIfUserIsRegisteredForQuiz, getRegisteredUsersForQuiz } from '../models/register';
import { getResponse } from '../models/response';
import { updateScore } from '../models/score';
import { getSectionByID } from '../models/section';
import { removeOngoingQuizFromTimer } from '../services/timerService';

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
		const { userID, email } = req.user;
		const quiz = await addNewQuiz(userID, email);
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

		removeOngoingQuizFromTimer(quizID);

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

		removeOngoingQuizFromTimer(quizID);

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
		const { userID, role } = req.user;
		const { quizID } = req.params;
		const checkingID = generateQuizioID();
		let actualUpdated = 0;

		const quiz = await getQuizById(quizID);
		if (!quiz) return notFoundResponse(res, 'Quiz not found');

		const getImportantStats = (questions, registrants, mcqQuestions) => `Important stats:\n\tTotal Questions: ${questions.length}\n\tTotal Registrants: ${registrants.length}\n\tTotal MCQs: ${mcqQuestions.length}\n\tIdeal Document count to be updated(mcq * registrants: ${mcqQuestions.length * registrants.length}`;
		const getImportantStatsJSON = (questions, registrants, mcqQuestions) => ({
			TotalQuestions: questions.length,
			TotalRegistrants: registrants.length,
			TotalMCQs: mcqQuestions.length,
			IdealDocumentCount: mcqQuestions.length * registrants.length,
			ActualUpdatedCount: actualUpdated,
		});

		/** START QUIZ CHECKING */
		logger.info(`**Quiz Checking, checkingID=${checkingID}**\nQuiz checking initiated by ${userID}, role="${getRole(role, quiz, userID)}"\nquizID: ${quizID}`);

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

			const mcqQuestions = questions.filter((question) => question.type === 'mcq');
			// const subjectiveQuestions = questions.filter((question) => question.type === 'subjective');
			// console.log({ mcqQuestions, subjectiveQuestions });

			// Get a list of all registrants
			const registrants = await getRegisteredUsersForQuiz(quizID);
			logger.info(`**Quiz Checking, checkingID=${checkingID}**\nGot list of all registrants in the quiz...`);

			logger.info(`**Quiz Checking, checkingID=${checkingID}**\n${getImportantStats(questions, registrants, mcqQuestions)}`);

			// Calculate and save scores
			await Promise.all(registrants.map(async (registrantID) => {
				logger.info(`**Quiz Checking, checkingID=${checkingID}**\nCalculating scores`);
				const questionScores = await Promise.all(
					mcqQuestions.map(async (question) => {
						const response = await getResponse(registrantID, question.quizioID);
						const answerChoices = response?.answerChoices;
						if (answerChoices) {
							const choiceScores = answerChoices.map((answerChoice) => question.choices.find(
								(choice) => choice.quizioID === answerChoice,
							).marks);
							// console.log({ registrant, response, choiceScores });
							const questionScore = choiceScores.reduce((prev, curr) => prev + curr, 0);
							return {
								questionID: question.quizioID,
								registrantID,
								checkBy: quizio.quizioID,
								autochecked: true,
								marks: questionScore,
							};
						}
						return {
							questionID: question.quizioID,
							registrantID,
							checkBy: quizio.quizioID,
							autochecked: true,
							marks: 0,
						};
					}),
				);
				// console.log({ questionScores });
				logger.info(`**Quiz Checking, checkingID=${checkingID}**\nCalculated scores, saving to db`);
				const saved = await Promise.all(questionScores.map(async (questionScore) => {
					const created = await updateScore(questionScore);
					return !!created;
				}));
				actualUpdated = saved.length;
				logger.info(`**Quiz Checking, checkingID=${checkingID}**\nSaved ${saved.length} score documents to db`);
				// console.log({ saved });
			}));

			return successResponseWithData(res, {
				quizID,
				checkedBy: userID,
				role: getRole(role, quiz, userID),
				importantStats: getImportantStatsJSON(questions, registrants, mcqQuestions),
				// rankList: rankList.sort((a, b) => b.marks - a.marks),
			});
		}
		return unauthorizedResponse(res);
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
		if (!quiz) return notFoundResponse(res, 'Quiz not found!');

		if (role === 'superadmin' || quiz.creator === userID || quiz.owners.includes(userID)) {
			const published = await getPublishedQuiz(quizID);
			return published
				? successResponseWithData(res, { ...published })
				: failureResponseWithMessage(res, 'Quiz not yet published!');
		}
		return unauthorizedResponse(res);
	},

	generateRanklist: async (req, res) => {
		const { userID, role } = req.user;
		const { quizID } = req.params;

		const quiz = await getQuizById(quizID);
		if (!quiz) return notFoundResponse(res, 'Quiz not found!');

		if (role === 'superadmin' || quiz.creator === userID || quiz.owners.includes(userID)) {
			const published = await getPublishedQuiz(quizID);
			if (!published) return failureResponseWithMessage(res, 'Quiz not yet published!');

			const rankList = await generateRanklist(quiz);
			if (!rankList) {
				return failureResponseWithMessage(res, 'failed to generate ranklist!');
			}
			const updated = await updateRanklist({ ...rankList, quizID, generatedBy: userID });
			if (!updated) {
				return failureResponseWithMessage(res, 'failed to save ranklist!');
			}

			return successResponseWithData(res, {
				quizID: quiz.quizioID,
				generatedBy: userID,
				role: getRole(role, quiz, userID),
				rankList,
			});
		}
		return unauthorizedResponse(res);
	},

};

export default controller;
