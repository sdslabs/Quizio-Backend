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
	getAllPublishedQuizzes,
	addNewQuiz,
	deleteQuiz,
	updateQuiz,
	getQuizById,
	publishQuiz,
	getPublishedQuiz,
} from '../models/quiz';
import { updateRanklist, getRanklist } from '../models/ranklist';
import { checkIfUserIsRegisteredForQuiz, getRegisteredUsersForQuiz } from '../models/register';
import { getResponse } from '../models/response';
import { updateScore, getScore } from '../models/score';
import { getSectionByID } from '../models/section';
import { checkIfQuizIsSubmitted } from '../models/submit';
import { removeOngoingQuizFromTimer } from '../services/timerService';

const controller = {
	getAllQuizzes: async (req, res) => {
		const { userID } = req.user;
		const quizzes0 = await getAllQuizzes();

		const quizzes = await Promise.all(
			quizzes0.map(async (eachQuiz) => {
				const registered = await checkIfUserIsRegisteredForQuiz(
					userID,
					eachQuiz.quizioID,
				);

				const submitted = await checkIfQuizIsSubmitted(
					userID,
					eachQuiz.quizioID,
				);
				return { ...eachQuiz, registered: !!registered, submitted: !!submitted };
			}),
		);

		return quizzes ? successResponseWithData(res, { quizzes }) : notFoundResponse(res);
	},

	getAllPublishedQuizzes: async (req, res) => {
		const { userID } = req.user;
		const puublishedQuizzes = await getAllPublishedQuizzes();

		const quizzesPublishedByUser = await Promise.all(
			puublishedQuizzes.map(async (eachQuiz) => {
				const registered = await checkIfUserIsRegisteredForQuiz(
					userID,
					eachQuiz.quizioID,
				);

				const submitted = await checkIfQuizIsSubmitted(
					userID,
					eachQuiz.quizioID,
				);
				return { ...eachQuiz, registered: !!registered, submitted: !!submitted };
			}),
		);

		return quizzes ? successResponseWithData(res, { quizzesPublishedByUser }) : notFoundResponse(res);
	},

	getQuizByID: async (req, res) => {
		const { userID, role } = req.user;
		const { quizID } = req.params;
		const quiz = await getQuizById(quizID);

		if (!quiz) {
			return notFoundResponse(res, 'Quiz not found!');
		}

		const submitted = await checkIfQuizIsSubmitted(userID, quizID);
		if (submitted) return unauthorizedResponse(res, 'Quiz already submitted!');

		if (role === 'superadmin') {
			return successResponseWithData(res, { role: 'superadmin', quiz });
		}
		if (quiz.creator === userID) {
			return successResponseWithData(res, { role: 'creator', quiz });
		}
		if (quiz.owners.includes(userID)) {
			return successResponseWithData(res, { role: 'owner', quiz });
		}

		// this makes accessCode hidden from the user giving the quiz so they cant see it by
		// inspect element only returns a boolean to know if a accessCode is needed or not
		if (quiz.accessCode == null) {
			quiz.accessCode = false;
		} else {
			quiz.accessCode = true;
		}

		const isRegistrant = await checkIfUserIsRegisteredForQuiz(userID, quiz.quizioID);
		if (isRegistrant) {
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
	getQuizCheckDetails: async (req, res) => {
		const { quizID } = req.params;
		const { registrantID } = req.body;
		let { total, autochecked, manualCheck } = 0;
		const quiz = await getQuizById(quizID);
		await Promise.all(
			quiz.sections.forEach(async (sectionID) => {
				const section = await getSectionByID(sectionID);
				// console.log('section: ', { sectionID, section });
				logger.info(`section : ${sectionID}`, `${section}`);
				// console.log(section);
				await Promise.all(
					section.questions.forEach(async (questionID) => {
						// console.log({ sectionID, questionID });
						logger.info(`sectionID, questionID : ${sectionID}`, `${questionID}`);
						await getQuestionByID(questionID);
						total += 1;
						const score = await getScore(registrantID, questionID);
						if (!score) {
							return;
						}
						if (score.autochecked === true) {
							autochecked += 1;
						} else if (!score.marks === null) {
							manualCheck += 1;
						}
					}),
				);
			}),
		);
		return successResponseWithData(res, {
			quizID,
			total,
			manualCheck,
			autochecked,
			// rankList: rankList.sort((a, b) => b.marks - a.marks),
		});
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
					logger.info(`section : ${sectionID}`, `${questions2}`);
					// return questions2.filter((question) => question.type === 'mcq');
					return questions2;
				}),
			)).flat();
			logger.info(`**Quiz Checking, checkingID=${checkingID}**\nGot list of all questions in the quiz...`);

			const mcqQuestions = questions.filter((question) => question.type === 'mcq');
			const subjectiveQuestions = questions.filter((question) => question.type === 'subjective');
			// console.log({ mcqQuestions, subjectiveQuestions });
			logger.info(`questions : ${mcqQuestions}`, `${subjectiveQuestions}`);

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
							logger.info(`registrant and responses : ${registrantID}`, `${response}`, `${choiceScores}`);
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
				logger.info(`questionScores : ${questionScores}`);
				logger.info(`**Quiz Checking, checkingID=${checkingID}**\nCalculated scores, saving to db`);
				const saved = await Promise.all(questionScores.map(async (questionScore) => {
					const created = await updateScore(questionScore);
					return !!created;
				}));
				actualUpdated = saved.length;
				logger.info(`**Quiz Checking, checkingID=${checkingID}**\nSaved ${saved.length} score documents to db`);
				// console.log({ saved });
				logger.info(`saved scores : ${saved}`);
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

	getRanklist: async (req, res) => {
		const { userID, role } = req.user;
		const { quizID } = req.params;
		const quiz = await getQuizById(quizID);
		if (!quiz) return notFoundResponse(res, 'Quiz not found!');
		if (role === 'superadmin' || quiz.creator === userID || quiz.owners.includes(userID)) {
			const ranklist = await getRanklist({ quizID });
			if (!ranklist) {
				return failureResponseWithMessage(res, 'failed to get ranklist!');
			}
			return successResponseWithData(res, { ...ranklist });
		}
		return unauthorizedResponse(res);
	},

};

export default controller;
