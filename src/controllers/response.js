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
		const { username, quizioID } = req.user;
		const responseData = { ...req.body, username };
		const questionExists = await getQuestionByID(responseData.questionID);
		if (questionExists) {
			const sectionData = await getSectionByID(questionExists.sectionID);
			const submitExits = await checkSubmit(sectionData.quizID, quizioID);
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
};

export default controller;
