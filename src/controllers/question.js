import logger from '../helpers/logger';
import {
	errorResponse,
	failureResponseWithMessage,
	notFoundResponse,
	successResponseWithData,
	successResponseWithMessage,
	unauthorizedResponse,
} from '../helpers/responses';
import {
	extractChoicesData,
	filterQuestionForQuizAdmins,
	filterQuestionForRegistrant,
	generateQuizioID,
} from '../helpers/utils';
import {
	addChoiceToQuestionByID,
	addNewQuestionToSection,
	deleteAllChoicesInQuestionByID,
	deleteChoiceInQuestionByID,
	deleteQuestion,
	getQuestionByID,
	updateQuestionByID,
} from '../models/question';
import { getQuizById } from '../models/quiz';
import { checkIfUserIsRegisteredForQuiz } from '../models/register';
import { updateScore, getScore } from '../models/score';
import { getSectionByID } from '../models/section';
import { getUserWithUserID } from '../models/user';
import registerController from './register';

const controller = {
	addNewQuestionToSection: async (req, res) => {
		const { userID, role } = req.user;
		const { sectionID } = req.params;

		const section = await getSectionByID(sectionID);
		if (!section) return notFoundResponse(res, 'Section not found!');

		const quiz = await getQuizById(section.quizID);
		if (!quiz) return notFoundResponse(res, 'Quiz not found!');

		if (role === 'superadmin'
			|| quiz.creator === userID
			|| quiz.owners.includes(userID)) {
			const question = await addNewQuestionToSection(sectionID, userID);
			if (question) {
				return successResponseWithData(res, {
					msg: 'question added to section',
					question,
				});
			}
			return failureResponseWithMessage(res, 'Unable to add question to section');
		}
		return unauthorizedResponse(res);
	},

	getQuestionByID: async (req, res) => {
		const { userID, role } = req.user;
		const { questionID } = req.params;

		const question = await getQuestionByID(questionID);
		if (!question) return notFoundResponse(res, 'Question not found!');

		const section = await getSectionByID(question.sectionID);
		if (!section) return notFoundResponse(res, 'Section not found!');

		const quiz = await getQuizById(section.quizID);
		if (!quiz) return notFoundResponse(res, 'Quiz not found!');

		if (role === 'superadmin'
			|| quiz.creator === userID
			|| quiz.owners.includes(userID)) {
			return successResponseWithData(res, {
				role,
				question: filterQuestionForQuizAdmins(question),
			});
		}

		const isRegistrant = await checkIfUserIsRegisteredForQuiz(userID, quiz.quizioID);
		if (isRegistrant) {
			return successResponseWithData(res,
				{
					role: 'registrant',
					question: filterQuestionForRegistrant(question),
				});
		}
		return unauthorizedResponse(res);
	},

	deleteQuestionByID: async (req, res) => {
		const { userID, role } = req.user;
		const { questionID } = req.params;

		const question = await getQuestionByID(questionID);
		if (!question) return notFoundResponse(res, 'Question not found!');

		const section = await getSectionByID(question.sectionID);
		if (!section) return notFoundResponse(res, 'Section not found!');

		const quiz = await getQuizById(section.quizID);
		if (!quiz) return notFoundResponse(res, 'Quiz not found!');

		if (role === 'superadmin'
			|| quiz.creator === userID
			|| quiz.owners.includes(userID)) {
			const deletedQuestion = await deleteQuestion(questionID);
			if (deletedQuestion) {
				return successResponseWithMessage(res, 'Question deleted successfully!');
			}
			return failureResponseWithMessage(res, 'Unable to delete Question');
		}
		return unauthorizedResponse(res);
	},

	updateQuestionByID: async (req, res) => {
		const { userID, role } = req.user;
		const { questionID } = req.params;

		const questionData = req.body;

		if (questionData.choices) {
			return failureResponseWithMessage(res, 'Cannot add choices from this api, use `/api/v2/quizzes/sections/questions/:questionID/choices`');
		}

		const question = await getQuestionByID(questionID);
		if (!question) return notFoundResponse(res, 'Question not found!');

		if (question.type === 'mcq' && questionData.answer) {
			return failureResponseWithMessage(res, 'This is an mcq type question, cannot add a subjective answer to it! use `/api/v2/quizzes/sections/questions/:questionID/toggle` to change the type of question');
		}

		const section = await getSectionByID(question.sectionID);
		if (!section) return notFoundResponse(res, 'Section not found!');

		const quiz = await getQuizById(section.quizID);
		if (!quiz) return notFoundResponse(res, 'Quiz not found!');

		if (role === 'superadmin'
			|| quiz.creator === userID
			|| quiz.owners.includes(userID)) {
			const updatedQuestion = await updateQuestionByID(questionID, questionData);
			if (updatedQuestion) {
				return successResponseWithData(res, { msg: 'Question updated successfully!', updatedQuestion });
			}
			return errorResponse(res, 'Unable to update Question');
		}
		return unauthorizedResponse(res);
	},

	toggleQuestionByID: async (req, res) => {
		const { userID, role } = req.user;
		const { questionID } = req.params;
		const question = await getQuestionByID(questionID);
		if (!question) return notFoundResponse(res, 'Question not found!');

		const section = await getSectionByID(question.sectionID);
		if (!section) return notFoundResponse(res, 'Section not found!');

		const quiz = await getQuizById(section.quizID);
		if (!quiz) return notFoundResponse(res, 'Quiz not found!');

		if (role === 'superadmin'
			|| quiz.creator === userID
			|| quiz.owners.includes(userID)) {
			const questionData = { ...question };

			switch (question.type) {
			case 'mcq':
				questionData.type = 'subjective';
				questionData.choices = [];
				break;
			case 'subjective':
				questionData.type = 'mcq';
				questionData.answer = null;
				break;
			default:
				logger.error(`QUESTION WITH AN INVALID TYPE FOUND! type=${question.type}`);
			}

			const question2 = await updateQuestionByID(questionID, questionData);
			if (question2) {
				return successResponseWithData(res, { msg: 'Question updated successfully!', question: question2 });
			}
			return failureResponseWithMessage(res, 'Unable to update Question');
		}
		return unauthorizedResponse(res);
	},

	addChoiceToQuestionByID: async (req, res) => {
		const quizioID = generateQuizioID();
		const { userID, role } = req.user;
		const { questionID } = req.params;
		const choiceData = { ...req.body, quizioID };

		const question = await getQuestionByID(questionID);
		if (!question) return notFoundResponse(res, 'Question not found!');

		if (question.type === 'subjective') {
			return failureResponseWithMessage(res, 'Cannot add choice to subjective questions!  use `/api/v2/quizzes/sections/questions/:questionID/toggle` to change the type of question');
		}

		const section = await getSectionByID(question.sectionID);
		if (!section) return notFoundResponse(res, 'Section not found!');

		const quiz = await getQuizById(section.quizID);
		if (!quiz) return notFoundResponse(res, 'Quiz not found!');

		if (role === 'superadmin'
			|| quiz.creator === userID
			|| quiz.owners.includes(userID)) {
			const updatedQuestion = await addChoiceToQuestionByID(questionID, choiceData);
			if (updatedQuestion) {
				return successResponseWithData(res,
					{
						msg: 'Choice added successfully!',
						choices: extractChoicesData(updatedQuestion.choices),
					});
			}
			return failureResponseWithMessage(res, 'Unable to add choice');
		}
		return unauthorizedResponse(res);
	},

	deleteChoiceInQuestionByID: async (req, res) => {
		const { userID, role } = req.user;
		const { questionID, choiceID } = req.params;

		const question = await getQuestionByID(questionID);
		if (!question) return notFoundResponse(res, 'Question not found!');

		const section = await getSectionByID(question.sectionID);
		if (!section) return notFoundResponse(res, 'Section not found!');

		const quiz = await getQuizById(section.quizID);
		if (!quiz) return notFoundResponse(res, 'Quiz not found!');

		if (role === 'superadmin'
			|| quiz.creator === userID
			|| quiz.owners.includes(userID)) {
			const updatedQuestion = await deleteChoiceInQuestionByID(questionID, choiceID);
			if (updatedQuestion) {
				return successResponseWithData(res,
					{
						msg: 'Choice deleted successfully!',
						choices: extractChoicesData(updatedQuestion.choices),
					});
			}
			return failureResponseWithMessage(res, 'Unable to delete Choice');
		}
		return unauthorizedResponse(res);
	},
	deleteAllChoicesInQuestionByID: async (req, res) => {
		const { userID, role } = req.user;
		const { questionID } = req.params;

		const question = await getQuestionByID(questionID);
		if (!question) return notFoundResponse(res, 'Question not found!');

		const section = await getSectionByID(question.sectionID);
		if (!section) return notFoundResponse(res, 'Section not found!');

		const quiz = await getQuizById(section.quizID);
		if (!quiz) return notFoundResponse(res, 'Quiz not found!');

		if (role === 'superadmin'
			|| quiz.creator === userID
			|| quiz.owners.includes(userID)) {
			const updatedQuestion = await deleteAllChoicesInQuestionByID(questionID);
			if (updatedQuestion) {
				return successResponseWithData(res,
					{
						msg: 'Choices deleted successfully!',
						choices: extractChoicesData(updatedQuestion.choices),
					});
			}
			return failureResponseWithMessage(res, 'Unable to delete Choices');
		}
		return unauthorizedResponse(res);
	},

	checkQuestion: async (req, res) => {
		const { role, userID } = req.user;
		const { questionID } = req.params;
		const { marks, registrantID } = req.body;

		const scoreData = {
			questionID,
			registrantID,
			checkBy: userID,
			marks,
			autochecked: false,
		};

		const question = await getQuestionByID(questionID);
		if (!question) return notFoundResponse(res, 'Question not found!');

		const registrant = await getUserWithUserID(registrantID);
		if (!registrant) return notFoundResponse(res, 'Registrant not found');

		const section = await getSectionByID(question.sectionID);
		if (!section) return notFoundResponse(res, 'Section not found!');

		const quiz = await getQuizById(section.quizID);
		if (!quiz) return notFoundResponse(res, 'Quiz not found!');

		if (role === 'superadmin'
			|| quiz.creator === userID
			|| quiz.owners.includes(userID)) {
			const created = await updateScore(scoreData);
			if (created) {
				return successResponseWithData(res, scoreData);
			}
			return failureResponseWithMessage(res, 'failed to save score!');
		}
		return unauthorizedResponse(res);
	},

	sendQuestionMarks: async (req, res) => {
		const { questionID, registrantID } = req.params;

		const scoreData = await getScore(registrantID, questionID);
		if (!scoreData) return notFoundResponse(res, 'Marks not found!');

		const result = {
			marks: scoreData.marks,
			checkBy: scoreData.checkBy,
			autochecked: scoreData.autochecked,
		};
		// console.log({ result });
		return successResponseWithData(res, result);
	},

	getQuestionByIDWithAccessCode: async (req, res) => {
		const { userID, role } = req.user;
		const { questionID, accessCode } = req.params;

		const question = await getQuestionByID(questionID);
		if (!question) return notFoundResponse(res, 'Question not found!');

		const section = await getSectionByID(question.sectionID);
		if (!section) return notFoundResponse(res, 'Section not found!');

		const quiz = await getQuizById(section.quizID);
		if (!quiz) return notFoundResponse(res, 'Quiz not found!');

		console.log('in getQUestionbyIDWITHACEESCODE', section.quizID, accessCode);
		const { quizID } = section.quizID;
		const accessCodeData = await registerController.checkAccessCodeForQuiz({ quizID, accessCode });
		const isAccessCodeCorrect = accessCodeData.data.data.correct;
		console.log('after getQUIZbyIDWITHACEESCODE', section.quizID, accessCode);

		if (!isAccessCodeCorrect) {
			return unauthorizedResponse(res);
		}

		if (role === 'superadmin'
			|| quiz.creator === userID
			|| quiz.owners.includes(userID)) {
			return successResponseWithData(res, {
				role,
				question: filterQuestionForQuizAdmins(question),
			});
		}

		const isRegistrant = await checkIfUserIsRegisteredForQuiz(userID, quiz.quizioID);
		if (isRegistrant) {
			return successResponseWithData(res,
				{
					role: 'registrant',
					question: filterQuestionForRegistrant(question),
				});
		}
		return unauthorizedResponse(res);
	},
};

export default controller;
