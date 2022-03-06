import { nanoid } from 'nanoid';

export const verifyQuizioID = (id) => (id.length === 30 && id.includes('.') && id.split('.')[0] === 'quizioID');
export const generateQuizioID = () => `quizioID.${nanoid()}`;
export const generateUserName = (firstName, lastName) => `${firstName?.toLowerCase()}_${lastName?.toLowerCase()}_${nanoid(3)}`;

export const extractQuizData = (data) => ({
	quizioID: data.quizioID || null,
	name: data.name || null,
	description: data.description || null,
	instructions: data.instructions || null,
	createdOn: data.createdOn || null,
	creator: data.creator || null,
	owners: data.owners || null,
	startTime: data.startTime || null,
	endTime: data.endTime || null,
	startWindow: data.startWindow || null,
	accessCode: data.accessCode || null,
	sections: data.sections || null,
	registrants: data.registrants || null,
	detail3: data.detail3 || null,
	detail1: data.detail1 || null,
	detail2: data.detail2 || null,
});

export const extractQuizzesData = (data) => data.map((entry) => extractQuizData(entry));

export const extractSectionData = (data) => ({
	quizioID: data.quizioID || null,
	quizID: data.quizID || null,
	title: data.title || null,
	description: data.description || null,
	createdOn: data.createdOn || null,
	creator: data.creator || null,
	questions: data.questions || null,
});

export const extractChoiceData = (data) => ({
	quizioID: data.quizioID || null,
	choice: data.choice || null,
	marks: data.marks || 0,
	isNeeded: data.isNeeded || false,
});

export const extractChoicesData = (data) => data.map((entry) => extractChoiceData(entry));

export const extractQuestionData = (data) => ({
	quizioID: data.quizioID || null,
	sectionID: data.sectionID || null,
	type: data.type || null,
	question: data.question || null,
	isMCQ: data.isMCQ || null,
	choices: extractChoicesData(data.choices) || null, // array of {quizioID, choice}
	answer: data.answer || null,
	checkerNotes: data.checkerNotes || null,
	minMarks: data.minMarks || null,
	maxMarks: data.maxMarks || null,
	defaultMarks: data.defaultMarks || null,
	autocheck: data.autocheck || null,
});

export const filterQuestionForRegistrant = (question) => {
	const question2 = { ...question };
	question2.choices = question.choices?.map((data) => ({
		quizioID: data.quizioID,
		choice: data.choice,
	}));
	question2.answer = null;
	return question2;
};

// Registrant helpers
export const extractRegistrantData = (data) => ({
	quizioID: data.quizioID || null,
	quizID: data.quizID || null,
	username: data.username || null,
	firstName: data.firstName || null,
	lastName: data.lastName || null,
	email: data.email || null,
	contactNo: data.contactNo || null,
	orgName: data.orgName || null,
	detail1: data.detail1 || null,
	detail2: data.detail2 || null,
	detail3: data.detail3 || null,
});
export const extractRegistrantQuizList = (data) => data.map((entry) => (entry.quizID));
export const extractRegistrantUserNameList = (data) => data.map((entry) => (entry.username));

// response helpers
export const extractResponseData = (data) => ({
	quizioID: data.quizioID || null,
	userID: data.userID || null,
	questionID: data.questionID || null,
	time: data.time || null,
	answerChoice: data.answerChoice || null,
	answer: data.answer || null,
});

// submit helpers
export const extractSubmitData = (data) => ({
	quizioID: data.quizioID || null,
	userID: data.userID || null,
	quizID: data.quizID || null,
	time: data.time || null,
});

export const extractSubmitsData = (data) => data.map((entry) => extractSubmitData(entry));

// user helpers
export const extractUserDataPrivate = (data) => ({
	quizioID: data.quizioID || null,
	username: data.username || null,
	email: data.email || null,
	role: data.role || null,
	githubAvatar: data.githubAvatar || null,
	googleAvatar: data.googleAvatar || null,
	githubUsername: data.githubUsername || null,
	firstName: data.firstName || null,
	lastName: data.lastName || null,
	instiName: data.instiName || null,
	country: data.country || null,
	city: data.city || null,
	phoneNumber: data.phoneNumber || null,
	handle1: data.handle1 || null,
	handle2: data.handle2 || null,
	handle3: data.handle3 || null,
});

export const extractUserDataPublic = (data) => ({
	quizioID: data.quizioID || null,
	username: data.username || null,
	email: data.email || null,
	role: data.role || null,
	githubAvatar: data.githubAvatar || null,
	googleAvatar: data.googleAvatar || null,
	githubUsername: data.githubUsername || null,
	firstName: data.firstName || null,
	lastName: data.lastName || null,
	instiName: data.instiName || null,
	country: data.country || null,
	city: data.city || null,
	phoneNumber: data.phoneNumber || null,
	handle1: data.handle1 || null,
	handle2: data.handle2 || null,
	handle3: data.handle3 || null,
});

// publish helpers
export const extractPublishData = (data) => ({
	quizioID: data.quizioID || null,
	publishedBy: data.publishedBy || null,
	quizID: data.quizID || null,
	time: data.time || null,
});
