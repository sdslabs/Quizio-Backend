import quiz from '../schema/quiz';

/**
 * Add a new section to a quiz
 * @returns quizId and section data of the new section added to the quiz
 */
export const addNewSectionToQuiz = async (quizId, sectionData) => {
	const updatedQuiz = await quiz.updateOne(
		{ quizId },
		{ $push: { sections: sectionData } },
	);
	return updatedQuiz;
};

/**
 * Add a new section to a quiz
 * @returns quizId and section data of the new section added to the quiz
 */
export const getSectionInQuiz = async (quizId, sectionId) => {
	const filter = { _id: quizId };
	const section = await quiz.findOne(filter)
		.select({ sections: { $elemMatch: { _id: sectionId } } });
	return section;
};

/**
 * Delete the section using the quizId and sectionId
 * @returns quizID and section data of the section deleted from the quiz
 */
export const deleteSectionInQuiz = async (quizId, sectionId) => {
	const filter = {
		_id: quizId,
	};

	const updatedQuiz = await quiz.findOneAndUpdate(filter,
		{
			$pull: {
				sections: {
					_id: sectionId,
				},
			},
		},
		{ new: true });
	return updatedQuiz;
};

/**
 * Update the section using the quizId and sectionId
 * @returns quizID and section data of the section updated in the quiz
 */
export const updateSectionInQuiz = async (quizId, sectionId, sectionData) => {
	const filter = {
		_id: quizId,
		'sections._id': sectionId,
	};

	const updateSectionData = {};
	Object.keys(sectionData).forEach((key) => {
		updateSectionData[`sections.$.${key}`] = sectionData[key];
	});

	const updatedQuiz = await quiz.findOneAndUpdate(filter,
		{
			$set: updateSectionData,
		}, { new: true });
	return updatedQuiz;
};
