import { getQuestionByID } from '../models/question';
import { getRegisteredUsersForQuiz } from '../models/register';
import { getScore } from '../models/score';
import { getSectionByID } from '../models/section';
import logger from './logger';
import { generateQuizioID } from './utils';

const generateRanklist = async (quiz) => {
	const generationID = generateQuizioID();
	logger.info(`**Ranklist Generation, generationID=${generationID}**`);

	const registrants = await getRegisteredUsersForQuiz(quiz.quizioID);
	const questions = (await Promise.all(
		quiz.sections.map(async (sectionID) => {
			const section = await getSectionByID(sectionID);
			// console.log('section: ', { sectionID, section });
			const questions2 = await Promise.all(
				section.questions.map(async (questionID) => {
					// console.log({ sectionID, questionID });
					const question = await getQuestionByID(questionID);
					return { ...question, sectionID };
				}),
			);
			// console.log({ sectionID, questions2 });
			// return questions2.filter((question) => question.type === 'mcq');
			return questions2;
		}),
	)).flat();

	const rankList = await Promise.all(registrants.map(async (registrantID) => {
		logger.info(`**Ranklist Generation, generationID=${generationID}**\nCalculating score for ${registrantID}`);
		const questionScores = await Promise.all(
			questions.map(async (question) => {
				const score = await getScore(registrantID, question.quizioID);
				return score.marks;
			}),
		);
		const quizScore = questionScores.reduce((prev, next) => prev + next, 0);
		return { quizScore, registrantID };
	}));

	return { rankList: rankList.sort((a, b) => b.quizScore - a.quizScore) };
};
export default generateRanklist;
