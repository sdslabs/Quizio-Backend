import { successResponseWithData } from '../helpers/responses';
import {
	addNewSectionToQuiz,
	deleteSectionInQuiz,
	updateSectionInQuiz,
	getSectionInQuiz,
} from '../models/section';

const controller = {
	addNewSectionToQuiz: async (req, res) => {
		const quiz = await addNewSectionToQuiz(req.params.quizId,
			req.body.section);
		return successResponseWithData(res, {
			message: 'Quiz updated successfully!',
			quiz,
		}, 200);
	},

	getSectionInQuiz: async (req, res) => {
		const section = await getSectionInQuiz(req.params.quizId,
			req.params.sectionId);
		return successResponseWithData(res, {
			message: 'Section fetched successfully!',
			section,
		}, 200);
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
