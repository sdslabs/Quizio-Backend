import {
	errorResponse, notFoundResponse, successResponseWithData, unauthorizedResponse,
} from '../helpers/responses';
import {
	addNewQuestionToSection,
	deleteQuestionInSection,
	getQuestionByID,
	updateQuestionInSection,
} from '../models/question';
import { getQuizById } from '../models/quiz';
import { getSectionByID } from '../models/section';

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
						|| quiz.owners.includes(username)
						|| quiz.registrants.includes(username)) {
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
		const quiz = await deleteQuestionInSection(req.params.quizId,
			req.params.sectionId,
			req.params.questionId);
		return successResponseWithData(res, {
			message: 'Quiz updated successfully!',
			quiz,
		}, 200);
	},
	updateQuestionByID: async (req, res) => {
		const quiz = await updateQuestionInSection(req.params.quizId,
			req.params.sectionId,
			req.params.questionId,
			req.body.question);
		return successResponseWithData(res, {
			message: 'Quiz updated successfully!',
			quiz,
		}, 200);
	},
};

export default controller;
