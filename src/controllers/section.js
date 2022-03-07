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
	addNewSectionToQuiz: async (req, res) => {
		const { userID, role } = req.user;
		const { quizID } = req.params;

		const quiz = await getQuizById(quizID);

		if (!quiz) return notFoundResponse(res, 'Quiz not found!');

		if (role === 'superadmin'
			|| quiz.creator === userID
			|| quiz.owners.includes(userID)) {
			const section = await addNewSectionToQuiz(quizID, userID);

			if (section) {
				return successResponseWithData(res, {
					message: 'Section Added successfully!',
					section,
				});
			}
			return errorResponse(res, 'Unable to Add Section');
		}
		return unauthorizedResponse(res);
	},

	getSectionByID: async (req, res) => {
		const { userID, role } = req.user;
		const { sectionID } = req.params;

		const section = await getSectionByID(sectionID);
		if (!section) return notFoundResponse(res, 'Section not found!');

		const quiz = await getQuizById(section.quizID);
		if (!quiz) return notFoundResponse(res, 'Quiz not found!');

		if (role === 'superadmin'
			|| quiz.creator === userID
			|| quiz.owners?.includes(userID)
			|| quiz.registrants?.includes(userID)) {
			return successResponseWithData(res, { section });
		}
		return unauthorizedResponse(res);
	},

	updateSectionByID: async (req, res) => {
		const { userID, role } = req.user;
		const { sectionID } = req.params;
		const sectionData = req.body;

		const section = await getSectionByID(sectionID);
		if (!section) return notFoundResponse(res, 'Section not found!');

		const quiz = await getQuizById(section.quizID);
		if (!quiz) return notFoundResponse(res, 'Quiz not found!');

		if (role === 'superadmin'
			|| quiz.creator === userID
			|| quiz.owners.includes(userID)) {
			const section2 = await updateSectionByID(sectionID, sectionData);
			if (section2) {
				return successResponseWithData(res, {
					msg: 'Section updated successfully!',
					section: section2,
				});
			}
			return errorResponse(res, 'Unable to update Section');
		}
		return unauthorizedResponse(res);
	},

	deleteSectionByID: async (req, res) => {
		const { userID, role } = req.user;
		const { sectionID } = req.params;

		const section = await getSectionByID(sectionID);
		if (!section) return notFoundResponse(res, 'Section not found!');

		const quiz = await getQuizById(section.quizID);
		if (!quiz) return notFoundResponse(res, 'Quiz not found!');

		if (role === 'superadmin'
			|| quiz.creator === userID
			|| quiz.owners.includes(userID)) {
			const section2 = await deleteSection(sectionID);
			if (section2) {
				return successResponseWithMessage(res, 'Section deleted successfully!');
			}
			return errorResponse(res, 'Unable to update Section');
		}
		return unauthorizedResponse(res);
	},
};

export default controller;
