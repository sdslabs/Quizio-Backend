import {
	errorResponse,
	notFoundResponse,
	successResponseWithData,
	successResponseWithMessage,
	unauthorizedResponse,
} from '../helpers/responses';
import { getQuizById } from '../models/quiz';
import {
	addNewSectionToQuiz,
	deleteSection,
	getSectionByID,
	updateSectionByID,
} from '../models/section';

const controller = {
	/**
	 * Adds a new section to quiz with the given id if the request is made by
	 * superadmin, owner or creator of the quiz
	 */
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

	/**
	 * Returns the section by it's id if the requesting user
	 * is superadmin, owner, creator, or registrant of the parent quiz
	 */
	getSectionById: async (req, res) => {
		const { username, role } = req.user;
		const { quizioID } = req.params;
		const section = await getSectionByID(quizioID);
		if (section) {
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
		}
		return notFoundResponse(res, 'Section not found!');
	},

	/**
	 * Update a section by it's id if the requesting user
	 * is superadmin, owner or creator of the parent quiz
	 */
	updateSectionByID: async (req, res) => {
		const { username, role } = req.user;
		const { quizioID } = req.params;
		const sectionData = req.body;

		const section = await getSectionByID(quizioID);
		if (section) {
			const quiz = await getQuizById(section.quizID);

			if (quiz) {
				if (role === 'superadmin'
					|| quiz.creator === username
					|| quiz.owners.includes(username)) {
					const section2 = await updateSectionByID(quizioID, sectionData);
					if (section2) {
						return successResponseWithData(res, {
							msg: 'Section updated successfully!',
							section: section2,
						});
					}
					return errorResponse(res, 'Unable to update Section');
				}
				return unauthorizedResponse(res);
			}
			return notFoundResponse(res, 'Quiz not found!');
		}
		return notFoundResponse(res, 'Section not found!');
	},

	deleteSectionByID: async (req, res) => {
		const { username, role } = req.user;
		const { quizioID } = req.params;

		const section = await getSectionByID(quizioID);

		if (section) {
			const quiz = await getQuizById(section.quizID);
			if (quiz) {
				if (role === 'superadmin'
					|| quiz.creator === username
					|| quiz.owners.includes(username)) {
					const section2 = await deleteSection(quizioID);
					if (section2) {
						return successResponseWithMessage(res, 'Section deleted successfully!');
					}
					return errorResponse(res, 'Unable to update Section');
				}
				return unauthorizedResponse(res);
			}
			return notFoundResponse(res, 'Quiz not found!');
		}
		return notFoundResponse(res, 'Section not found!');
	},
};

export default controller;
