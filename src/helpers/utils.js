import { nanoid } from 'nanoid';

export const verifyQuizioID = (id) => (id.length === 30 && id.includes('.') && id.split('.')[0] === 'quizioID');
export const generateQuizioID = () => `quizioID.${nanoid()}`;

export const extractQuizData = (data) => ({
	quizioID: data.quizioID,
	name: data.name,
	description: data.description,
	instructions: data.instructions,
	createdOn: data.createdOn,
	creator: data.creator,
	owners: data.owners,
	startTime: data.startTime,
	endTime: data.endTime,
	startWindow: data.startWindow,
	accessCode: data.accessCode,
	sections: data.sections,
	registrants: data.registrants,
	detail3: data.detail3,
	detail1: data.detail1,
	detail2: data.detail2,
});

export const extractSectionData = (data) => ({
	quizioID: data.quizioID,
	quizID: data.quizID,
	title: data.title,
	description: data.description,
	createdOn: data.createdOn,
	creator: data.creator,
	questions: data.questions,
});
