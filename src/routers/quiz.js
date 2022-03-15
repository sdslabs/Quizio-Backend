import express from 'express';
import { isAuth } from '../helpers/authorizer';
import controller from '../controllers/quiz';
import sectionController from '../controllers/section';
import questionController from '../controllers/question';

const router = express.Router();

// Quiz Level
router.post('/', isAuth, controller.addNewQuiz);
router.get('/', isAuth, controller.getAllQuizzes);
router.get('/:quizID', isAuth, controller.getQuizByID);
router.put('/:quizID', isAuth, controller.updateQuiz);
router.delete('/:quizID', isAuth, controller.deleteQuiz);

// Section Level
router.post('/:quizID/sections', isAuth, sectionController.addNewSectionToQuiz);
router.get('/sections/:sectionID', isAuth, sectionController.getSectionByID);
router.put('/sections/:sectionID', isAuth, sectionController.updateSectionByID);
router.delete('/sections/:sectionID', isAuth, sectionController.deleteSectionByID);

// Question Level
router.post('/sections/:sectionID/questions', isAuth, questionController.addNewQuestionToSection);
router.get('/sections/questions/:questionID', isAuth, questionController.getQuestionByID);
router.put(
	'/sections/questions/:questionID',
	isAuth,
	questionController.updateQuestionByID,
);
router.put(
	'/sections/questions/:questionID/toggle',
	isAuth,
	questionController.toggleQuestionByID,
);
router.put(
	'/sections/questions/:questionID/choices',
	isAuth,
	questionController.addChoiceToQuestionByID,
);
router.delete(
	'/sections/questions/:questionID/choices/:choiceID',
	isAuth,
	questionController.deleteChoiceInQuestionByID,
);
router.delete(
	'/sections/questions/:questionID/choices',
	isAuth,
	questionController.deleteAllChoicesInQuestionByID,
);
router.delete(
	'/sections/questions/:questionID',
	isAuth,
	questionController.deleteQuestionByID,
);

// Check a quiz
router.post('/:quizID/check', isAuth, controller.checkQuiz);
router.get('/sections/questions/:questionID/check', isAuth, questionController.sendQuestionMarks);
router.put('/sections/questions/:questionID/check', isAuth, questionController.checkQuestion);

// Publish quiz routes
router.get('/:quizID/publish', isAuth, controller.getPublishedQuiz);
router.post('/:quizID/publish', isAuth, controller.publishQuiz);

router.post('/:quizID/ranklist', isAuth, controller.generateRanklist);
export default router;
