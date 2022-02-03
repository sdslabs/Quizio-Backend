import {
	errorResponse,
	notFoundResponse,
	successResponseWithData,
	successResponseWithMessage,
	unauthorizedResponse,
} from '../helpers/responses';
import {
	addNewQuestionToSection,
	deleteQuestion,
	getQuestionByID,
	updateQuestionByID,
} from '../models/question';
import { getQuizById } from '../models/quiz';
import { getSectionByID } from '../models/section';
import { isUserSubmitted } from '../models/submit';

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
			const isSubmitted = await isUserSubmitted(username);
			if (section) {
				const quiz = await getQuizById(section.quizID);
				if (quiz) {
					if ((role === 'superadmin'
						|| quiz.creator === username
						|| quiz.owners.includes(username)
						|| quiz.registrants.includes(username))
						&& !isSubmitted) {
						return successResponseWithData(res, { question });
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

		const question = await getQuestionByID(questionID);
		if (question) {
			const section = await getSectionByID(question.sectionID);
			if (section) {
				const quiz = await getQuizById(section.quizID);
				if (quiz) {
					if (role === 'superadmin'
						|| quiz.creator === username
						|| quiz.owners.includes(username)) {
						const question2 = await updateQuestionByID(questionID, questionData);
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
};

export default controller;
