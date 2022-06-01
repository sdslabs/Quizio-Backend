/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import {
	errorResponse,
	failureResponseWithMessage,
	notFoundResponse,
	successResponseWithData,
} from '../helpers/responses';
import { getQuestionByID, isChoiceInQuestion } from '../models/question';
import { getSectionByID } from '../models/section';
import { checkIfQuizIsSubmitted } from '../models/submit';

import { getResponse, saveResponse } from '../models/response';
import { getQuizById } from '../models/quiz';

const controller = {
	saveResponse: async (req, res) => {
		const { userID } = req.user;
		const responseData = { ...req.body, userID };

		const question = await getQuestionByID(responseData.questionID);
		if (!question) return notFoundResponse(res, 'Question does not exist!');

		const section = await getSectionByID(question.sectionID);
		if (!section) return notFoundResponse(res, 'Section not found!');

		const submitted = await checkIfQuizIsSubmitted(userID, section.quizID);
		if (submitted) return errorResponse(res, 'Quiz already submitted!');

		const quiz = await getQuizById(section.quizID);
		if (Date.now().valueOf() > quiz.endTime.valueOf()) {
			return errorResponse(res, 'Quiz time is already over');
		}

		const { status } = responseData;
		if (status == null) {
			return notFoundResponse(res, 'Question status not sent');
		}

		const mcqRes = 'answerChoices' in responseData;
		const subjectiveRes = 'answer' in responseData;

		if (subjectiveRes && mcqRes) {
			return failureResponseWithMessage(
				res,
				'Cannot submit both answerChoice and answer!',
			);
		}

		if (question.type === 'mcq' && subjectiveRes) {
			return failureResponseWithMessage(
				res,
				'Question is an mcq, you tried to submit subjective answer',
			);
		}

		if (question.type === 'subjective' && mcqRes) {
			return failureResponseWithMessage(
				res,
				'Question is subjective, you tried to submit mcq answer',
			);
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
		const { questionID, userID } = req.params;
		const responseData = await getResponse(userID, questionID);
		return responseData
			? successResponseWithData(res, responseData)
			: notFoundResponse(res, 'response not found!');
	},

	getAllQuestionStatus: async (req, res) => {
		const { quizID, userID } = req.params;
		const quiz = await getQuizById(quizID);
		const response = [];
		for (const section of quiz.sections) {
			const sec = await getSectionByID(section);
			for (const question of sec.questions) {
				const responseData = await getResponse(userID, question);
				if (responseData != null) {
					response.push({ questionID: question, status: responseData.status });
				}
			}
		}
		return successResponseWithData(res, response);
	},
};

export default controller;
