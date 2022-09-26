import {
	errorResponse,
	notFoundResponse,
	successResponseWithData,
	successResponseWithMessage,
	unauthorizedResponse,
} from '../helpers/responses';
import { getQuizById } from '../models/quiz';
import { checkIfUserIsRegisteredForQuiz } from '../models/register';
import {
	addNewSectionToQuiz,
	deleteSection,
	getSectionByID,
	updateSectionByID,
} from '../models/section';
import registerController from './register';

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
			|| quiz.owners?.includes(userID)) {
			return successResponseWithData(res, { role, section });
		}
		const isRegistrant = await checkIfUserIsRegisteredForQuiz(userID, quiz.quizioID);
		if (isRegistrant) {
			return successResponseWithData(res, { role: 'registrant', section });
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

	getSectionByIDWithAccessCode: async (req, res) => {
		const { userID, role } = req.user;
		const { sectionID, accessCode } = req.params;

		const section = await getSectionByID(sectionID);
		if (!section) return notFoundResponse(res, 'Section not found!');

		const quiz = await getQuizById(section.quizID);
		if (!quiz) return notFoundResponse(res, 'Quiz not found!');
		console.log('in getsectionbyIDWITHACEESCODE', section.quizID, accessCode);
		const accessCodeData = await registerController.checkAccessCodeForQuiz(section.quizID,
			accessCode);
		const isAccessCodeCorrect = accessCodeData.data.data.correct;
		console.log('after getsectionbyIDWITHACEESCODE', section.quizID, accessCode);

		if (!isAccessCodeCorrect) {
			return notFoundResponse(res, 'Invalid access code');
		}

		if (role === 'superadmin'
			|| quiz.creator === userID
			|| quiz.owners?.includes(userID)) {
			return successResponseWithData(res, { role, section });
		}
		const isRegistrant = await checkIfUserIsRegisteredForQuiz(userID, quiz.quizioID);
		if (isRegistrant) {
			return successResponseWithData(res, { role: 'registrant', section });
		}
		return unauthorizedResponse(res);
	},
};

export default controller;
