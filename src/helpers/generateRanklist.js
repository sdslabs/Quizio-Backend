import { getQuestionByID } from '../models/question';
import { getRegisteredUsersForQuiz } from '../models/register';
import { getScore } from '../models/score';
import { getSectionByID } from '../models/section';
import logger from './logger';
import { generateQuizioID } from './utils';
import { getUserWithUserID } from '../models/user';

const generateRanklist = async (quiz) => {
	const generationID = generateQuizioID();
	logger.info(`**Ranklist Generation, generationID=${generationID}**`);

	let totalQuestions = 0;
	let checkedQuestions = 0;

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
	console.log(registrants);

	const rankList = await Promise.all(registrants.map(async (registrantID) => {
		logger.info(`**Ranklist Generation, generationID=${generationID}**\nCalculating score for ${registrantID}`);
		const questionScores = await Promise.all(
			questions.map(async (question) => {
				totalQuestions += 1;
				const score = await getScore(registrantID, question.quizioID);
				if (score === null) {
					return 0;
				}

				checkedQuestions += 1;
				return score.marks;
			}),
		);

		const user = await getUserWithUserID(registrantID);
		const name = `${user.firstName} ${user.lastName}`;
		const quizScore = questionScores.reduce((prev, next) => prev + next, 0);
		const checkingProgress = (checkedQuestions / totalQuestions) * 100;
		return {
			quizScore, registrantID, checkingProgress, name,
		};
	}));

	return { rankList: rankList.sort((a, b) => b.quizScore - a.quizScore) };
};
export default generateRanklist;
