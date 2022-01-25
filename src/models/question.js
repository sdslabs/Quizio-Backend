import { extractQuestionData, generateQuizioID } from '../helpers/utils';
import quiz from '../schema/quiz';
import section from '../schema/section';
import question from '../schema/question';

/**
 * Add a new question to a section in a quiz
 * @returns The updated quiz
 */
export const addNewQuestionToSection = async (sectionID, creator) => {
	const quizioID = generateQuizioID();

	const newQuestion = new question({ quizioID, sectionID, creator });
	const result = await newQuestion.save();
	if (result) {
		const sectionn = await section.updateOne({ quizioID: sectionID },
			{ $push: { questions: quizioID } });

		if (sectionn) {
			return extractQuestionData(result);
		}
		return null;
	}
	return null;
};

export const updateQuestionInSection = async (quizId, sectionId, questionId, questionData) => {
	const filter = {
		_id: quizId,
		'sections._id': sectionId,
	};

	const updateQuestionData = {};
	Object.keys(questionData).forEach((key) => {
		updateQuestionData[`sections.$[sid].questions.$[qid].${key}`] = questionData[key];
	});

	const updatedQuiz = await quiz.findOneAndUpdate(filter,
		{
			$set: updateQuestionData,
		},
		{
			arrayFilters: [
				{ 'sid._id': sectionId },
				{ 'qid._id': questionId },
			],
			new: true,
		});
	return updatedQuiz;
};

export const deleteQuestionInSection = async (quizId, sectionId, questionId) => {
	const filter = {
		_id: quizId,
		'sections._id': sectionId,
	};

	const updatedQuiz = await quiz.findOneAndUpdate(filter,
		{
			$pull: {
				'sections.$.questions': { _id: questionId },
			},
		}, { new: true });

	return updatedQuiz;
};
