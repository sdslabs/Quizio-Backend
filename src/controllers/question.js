import { successResponseWithData } from '../helpers/responses';
import {
	addNewQuestionToSection,
	deleteQuestionInSection,
	updateQuestionInSection,
} from '../models/question';

const controller = {
	addNewQuestionToSection: async (req, res) => {
		const quiz = await addNewQuestionToSection(req.params.quizId,
			req.params.sectionId,
			req.body.question);
		return successResponseWithData(res, {
			message: 'Quiz updated successfully!',
			quiz,
		}, 200);
	},
	deleteQuestionInSection: async (req, res) => {
		const quiz = await deleteQuestionInSection(req.params.quizId,
			req.params.sectionId,
			req.params.questionId);
		return successResponseWithData(res, {
			message: 'Quiz updated successfully!',
			quiz,
		}, 200);
	},
	updateQuestionInSection: async (req, res) => {
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
