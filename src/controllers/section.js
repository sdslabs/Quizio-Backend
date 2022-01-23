import {
	errorResponse, notFoundResponse, successResponseWithData, unauthorizedResponse,
} from '../helpers/responses';
import { getQuizById } from '../models/quiz';
import {
	addNewSectionToQuiz,
	deleteSectionInQuiz,
	updateSectionInQuiz,

	getSectionByID,
} from '../models/section';

const controller = {
	addNewSectionToQuiz: async (req, res) => {
		const { username, role } = req.user;
		const { quizID } = req.params;
		const quiz = await getQuizById(quizID);
		if (quiz) {
			if (role === 'superadmin'
				|| quiz.creator === username
				|| quiz.owners.includes(username)) {
				const section = await addNewSectionToQuiz(quizID, username);
				if (section) {
					return successResponseWithData(res, {
						message: 'Section updated successfully!',
						section,
					});
				}
				return errorResponse(res, 'Unable to Add Section');
			}
		}
		return notFoundResponse(res, 'Quiz not found!');
	},

	getSectionById: async (req, res) => {
		const { username, role } = req.user;
		const { quizioID } = req.params;
		const section = await getSectionByID(quizioID);
		const quiz = await getQuizById(section.quizID);
		if (section && quiz) {
			if (role === 'superadmin'
			|| quiz.creator === username
			|| quiz.owners.includes(username)
			|| quiz.registrants.includes(username)) {
				return successResponseWithData(res, { section });
			}
			return unauthorizedResponse(res);
		}

		return notFoundResponse(res, 'Quiz not found!');
	},

	updateSectionInQuiz: async (req, res) => {
		const quiz = await updateSectionInQuiz(req.params.quizId,
			req.params.sectionId,
			req.body.section);
		return successResponseWithData(res, {
			message: 'Quiz updated successfully!',
			quiz,
		}, 200);
	},

	deleteSectionInQuiz: async (req, res) => {
		const quiz = await deleteSectionInQuiz(req.params.quizId,
			req.params.sectionId);
		return successResponseWithData(res, {
			message: 'Quiz updated successfully!',
			quiz,
		}, 200);
	},
};

export default controller;
