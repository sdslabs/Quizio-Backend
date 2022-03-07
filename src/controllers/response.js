import {
	errorResponse,
	notFoundResponse,
	successResponseWithData,
} from '../helpers/responses';
import { getQuestionByID } from '../models/question';
import { getSectionByID } from '../models/section';
import { checkSubmit } from '../models/submit';

import { getResponse, saveResponse } from '../models/response';

const controller = {
	saveResponse: async (req, res) => {
		const { userID } = req.user;
		const responseData = { ...req.body, userID };
		const questionExists = await getQuestionByID(responseData.questionID);
		if (questionExists) {
			const sectionData = await getSectionByID(questionExists.sectionID);
			const submitExits = await checkSubmit(sectionData.quizID, userID);
			if (submitExits) {
				return errorResponse(res, 'Quiz already submitted!');
			}
			const response = await saveResponse(responseData);
			return response ? successResponseWithData(res, {
				msg: 'Response saved',
				response,
			}) : errorResponse(res, 'Failed to save response!');
		}
		return notFoundResponse(res, 'Question does not exist!');
	},

	getResponse: async (req, res) => {
		const { questionID, userID } = req.body;
		const responseData = await getResponse(userID, questionID);
		return responseData ? successResponseWithData(res, responseData) : notFoundResponse(res, 'response not found!');
	},
};

export default controller;
