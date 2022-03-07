import {
	errorResponse,
	failureResponseWithMessage,
	notFoundResponse,
	successResponseWithData,
} from '../helpers/responses';
import { getQuestionByID, isChoiceInQuestion } from '../models/question';
import { getSectionByID } from '../models/section';
import { checkSubmit } from '../models/submit';

import { getResponse, saveResponse } from '../models/response';

const controller = {
	saveResponse: async (req, res) => {
		const { userID } = req.user;
		const responseData = { ...req.body, userID };

		const question = await getQuestionByID(responseData.questionID);
		if (!question) return notFoundResponse(res, 'Question does not exist!');

		const section = await getSectionByID(question.sectionID);
		if (!section) return notFoundResponse(res, 'Section not found!');

		const submitExits = await checkSubmit(section.quizID, userID);
		if (submitExits) return errorResponse(res, 'Quiz already submitted!');

		const mcqRes = 'answerChoices' in responseData;
		const subjectiveRes = 'answer' in responseData;

		if (subjectiveRes && mcqRes) {
			return failureResponseWithMessage(res, 'Cannot submit both answerChoice and answer!');
		}

		if (question.type === 'mcq' && subjectiveRes) {
			return failureResponseWithMessage(res, 'Question is an mcq, you tried to submit subjective answer');
		}

		if (question.type === 'subjective' && mcqRes) {
			return failureResponseWithMessage(res, 'Question is subjective, you tried to submit mcq answer');
		}

		if (mcqRes) {
			const validArr = await Promise.all(
				responseData.answerChoices.map(
					async (choice) => isChoiceInQuestion(
						choice,
						responseData.questionID,
					),
				),
			);

			responseData.answerChoices = responseData.answerChoices.filter(
				(_v, index) => validArr[index],
			);
		}

		const response = await saveResponse(responseData);
		if (!response) failureResponseWithMessage(res, 'Failed to save response!');

		return successResponseWithData(res, {
			msg: 'Response saved',
			response,
		});
	},

	getResponse: async (req, res) => {
		const { questionID, userID } = req.body;
		const responseData = await getResponse(userID, questionID);
		return responseData ? successResponseWithData(res, responseData) : notFoundResponse(res, 'response not found!');
	},
};

export default controller;
