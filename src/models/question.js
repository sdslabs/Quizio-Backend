import quiz from '../schema/quiz';
// import user from '../schema/user';
// import logger from '../helpers/logger';

/**
 * Add a new question to a section in a quiz
 * @returns The updated quiz
 */
export const addNewQuestionToSection = async (quizId, sectionId, questionData) => {
	const filter = {
		_id: quizId,
		'sections._id': sectionId,
	};

	const updatedQuiz = await quiz.findOneAndUpdate(filter,
		{
			$addToSet: {
				'sections.$.questions': questionData,
			},
		}, { new: true });
	return updatedQuiz;
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
