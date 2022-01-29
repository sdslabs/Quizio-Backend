import {
	errorResponse,
	notFoundResponse,
	successResponseWithData,
} from '../helpers/responses';
import { getQuestionByID } from '../models/question';

import { saveResponse } from '../models/response';

const controller = {
	saveResponse: async (req, res) => {
		const { username } = req.user;
		const responseData = { ...req.body, username };
		const questionExists = await getQuestionByID(responseData.questionID);
		if (questionExists) {
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
