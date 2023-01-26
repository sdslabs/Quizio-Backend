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
	// generateQuizioID,
} from '../helpers/utils';
import {
	// addChoiceToQuestionByID,
	addNewQuestionToSection,
	// deleteAllChoicesInQuestionByID,
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
};

export default controller;
