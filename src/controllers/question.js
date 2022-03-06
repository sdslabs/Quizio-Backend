import {
	errorResponse,
	failureResponseWithMessage,
	notFoundResponse,
	successResponseWithData,
	successResponseWithMessage,
	unauthorizedResponse,
} from '../helpers/responses';
import { extractChoicesData, filterQuestionForRegistrant, generateQuizioID } from '../helpers/utils';
import {
	addChoiceToQuestionByID,
	addNewQuestionToSection,
	deleteChoiceInQuestionByID,
	deleteQuestion,
	getQuestionByID,
	updateQuestionByID,
} from '../models/question';
import { getQuizById } from '../models/quiz';
import { updateScore } from '../models/score';
import { getSectionByID } from '../models/section';
import { getUserWithUserID } from '../models/user';

const controller = {
	addNewQuestionToSection: async (req, res) => {
		const { username, role } = req.user;
		const { sectionID } = req.params;

		const section = await getSectionByID(sectionID);
		if (section) {
			const quiz = await getQuizById(section.quizID);
			if (quiz) {
				if (role === 'superadmin'
					|| quiz.creator === username
					|| quiz.owners.includes(username)) {
					const question = await addNewQuestionToSection(sectionID, username);
					if (question) {
						return successResponseWithData(res, {
							msg: 'question added to section',
							question,
						});
					}
					return errorResponse(res, 'Unable to add question to section');
				}
				return unauthorizedResponse(res);
			}
			return notFoundResponse(res, 'Quiz not found!');
		}
		return notFoundResponse(res, 'Section not found!');
	},

	getQuestionByID: async (req, res) => {
		const { username, role } = req.user;
		const { questionID } = req.params;

		const question = await getQuestionByID(questionID);
		if (question) {
			const section = await getSectionByID(question.sectionID);

			if (section) {
				const quiz = await getQuizById(section.quizID);
				if (quiz) {
					if (role === 'superadmin'
						|| quiz.creator === username
						|| quiz.owners.includes(username)) {
						return successResponseWithData(res, { question });
					} if (quiz.registrants.includes(username)) {
						return successResponseWithData(res,
							{
								question: filterQuestionForRegistrant(question),
							});
					}
					return unauthorizedResponse(res);
				}
				return notFoundResponse(res, 'Quiz not found!');
			}
			return notFoundResponse(res, 'Section not found!');
		}
		return notFoundResponse(res, 'Question not found!');
	},

	deleteQuestionByID: async (req, res) => {
		const { username, role } = req.user;
		const { questionID } = req.params;
		const question = await getQuestionByID(questionID);

		if (question) {
			const section = await getSectionByID(question.sectionID);
			if (section) {
				const quiz = await getQuizById(section.quizID);
				if (quiz) {
					if (role === 'superadmin'
						|| quiz.creator === username
						|| quiz.owners.includes(username)) {
						const question2 = await deleteQuestion(questionID);
						if (question2) {
							return successResponseWithMessage(res, 'Question deleted successfully!');
						}
						return errorResponse(res, 'Unable to delete Question');
					}
					return unauthorizedResponse(res);
				}
				return notFoundResponse(res, 'Quiz not found!');
			}
			return notFoundResponse(res, 'Section not found!');
		}
		return notFoundResponse(res, 'Question not found!');
	},

	updateQuestionByID: async (req, res) => {
		const { username, role } = req.user;
		const { questionID } = req.params;
		const questionData = req.body;

		if (questionData.choices) {
			return failureResponseWithMessage(res, 'Cannot add choices from this api, use `/api/v2/quizzes/sections/questions/:questionID/choices`');
		}

		const question = await getQuestionByID(questionID);

		if (question) {
			if (question.type === 'mcq' && questionData.answer) {
				return failureResponseWithMessage(res, 'This is an mcq type question, cannot add a subjective answer to it! use `/api/v2/quizzes/sections/questions/:questionID/toggle` to change the type of question');
			}
			const section = await getSectionByID(question.sectionID);
			if (section) {
				const quiz = await getQuizById(section.quizID);
				if (quiz) {
					if (role === 'superadmin'
						|| quiz.creator === username
						|| quiz.owners.includes(username)) {
						const question2 = await updateQuestionByID(questionID, questionData);
						if (question2) {
							return successResponseWithData(res, { msg: 'Question updated successfully!', question: question2 });
						}
						return errorResponse(res, 'Unable to update Question');
					}
					return unauthorizedResponse(res);
				}
				return notFoundResponse(res, 'Quiz not found!');
			}
			return notFoundResponse(res, 'Section not found!');
		}
		return notFoundResponse(res, 'Question not found!');
	},

	toggleQuestionByID: async (req, res) => {
		const { username, role } = req.user;
		const { questionID } = req.params;
		const question = await getQuestionByID(questionID);
		if (question) {
			const section = await getSectionByID(question.sectionID);
			if (section) {
				const quiz = await getQuizById(section.quizID);
				if (quiz) {
					if (role === 'superadmin'
						|| quiz.creator === username
						|| quiz.owners.includes(username)) {
						const questionData = { ...question };
						if (question.type === 'mcq') {
							questionData.type = 'subjective';
							questionData.choices = [];
						} else if (question.type === 'subjective') {
							questionData.type = 'mcq';
							questionData.answer = null;
						}
						const question2 = await updateQuestionByID(questionID, questionData);
						if (question2) {
							return successResponseWithData(res, { msg: 'Question updated successfully!', question: question2 });
						}
						return errorResponse(res, 'Unable to update Question');
					}
					return unauthorizedResponse(res);
				}
				return notFoundResponse(res, 'Quiz not found!');
			}
			return notFoundResponse(res, 'Section not found!');
		}
		return notFoundResponse(res, 'Question not found!');
	},

	addChoiceToQuestionByID: async (req, res) => {
		const quizioID = generateQuizioID();
		const { username, role } = req.user;
		const { questionID } = req.params;
		const choiceData = { ...req.body, quizioID };

		const question = await getQuestionByID(questionID);
		if (question) {
			const section = await getSectionByID(question.sectionID);
			if (section) {
				const quiz = await getQuizById(section.quizID);
				if (quiz) {
					if (role === 'superadmin'
						|| quiz.creator === username
						|| quiz.owners.includes(username)) {
						const question2 = await addChoiceToQuestionByID(questionID, choiceData);
						if (question2) {
							return successResponseWithData(res, { msg: 'Question updated successfully!', choices: extractChoicesData(question2.choices) });
						}
						return errorResponse(res, 'Unable to update Question');
					}
					return unauthorizedResponse(res);
				}
				return notFoundResponse(res, 'Quiz not found!');
			}
			return notFoundResponse(res, 'Section not found!');
		}
		return notFoundResponse(res, 'Question not found!');
	},

	deleteChoiceInQuestionByID: async (req, res) => {
		const { username, role } = req.user;
		const { questionID, choiceID } = req.params;

		const question = await getQuestionByID(questionID);
		if (question) {
			const section = await getSectionByID(question.sectionID);
			if (section) {
				const quiz = await getQuizById(section.quizID);
				if (quiz) {
					if (role === 'superadmin'
						|| quiz.creator === username
						|| quiz.owners.includes(username)) {
						const question2 = await deleteChoiceInQuestionByID(questionID, choiceID);
						if (question2) {
							return successResponseWithData(res, { msg: 'Question updated successfully!', question2 });
						}
						return errorResponse(res, 'Unable to update Question');
					}
					return unauthorizedResponse(res);
				}
				return notFoundResponse(res, 'Quiz not found!');
			}
			return notFoundResponse(res, 'Section not found!');
		}
		return notFoundResponse(res, 'Question not found!');
	},

	checkQuestion: async (req, res) => {
		const { quizioID, role, username } = req.user;
		const { questionID } = req.params;
		const { marks, registrantID } = req.body;

		const scoreData = {
			questionID,
			registrantID,
			checkBy: quizioID,
			marks,
			autochecked: false,
		};

		const question = await getQuestionByID(questionID);
		const registrant = await getUserWithUserID(registrantID);
		if (!registrant) return notFoundResponse(res, 'Registrant not found');
		if (question) {
			const section = await getSectionByID(question.sectionID);
			if (section) {
				const quiz = await getQuizById(section.quizID);
				if (quiz) {
					if (role === 'superadmin'
						|| quiz.creator === username
						|| quiz.owners.includes(username)) {
						const created = await updateScore(scoreData);
						if (created) {
							return successResponseWithData(res, scoreData);
						}
						return failureResponseWithMessage(res, 'failed to save score!');
					}
				}
				return notFoundResponse(res, 'Quiz not found!');
			}
			return notFoundResponse(res, 'Section not found!');
		}
		return notFoundResponse(res, 'Question not found!');
	},
};

export default controller;
