import {
	errorResponse,
	notFoundResponse,
	successResponseWithData,
} from '../helpers/responses';
import { getQuestionByID } from '../models/question';
import { getSectionByID } from '../models/section';
import { checkSubmit } from '../models/submit';

import { saveResponse } from '../models/response';

const controller = {
	saveResponse: async (req, res) => {
		const { username } = req.user;
		const responseData = { ...req.body, username };
		console.log(responseData);
		const questionExists = await getQuestionByID(responseData.questionID);
		if (questionExists) {
			const sectionData = await getSectionByID(questionExists.sectionID);
			const submitExits = await checkSubmit(sectionData.quizID, username);
			if (submitExits) {
				return "You have already submitted this quiz";
			}
			const response = await saveResponse(responseData);
			console.log(response);
			return response ? successResponseWithData(res, {
				msg: 'Response saved',
				response,
			}) : errorResponse(res, 'Failed to save response!');
		}
		return notFoundResponse(res, 'Question does not exist!');
	},
};

export default controller;
