import express from 'express';
import { isAuth, isSuperAdmin } from '../helpers/authorizer';
import controller from '../controllers/quiz';
import sectionController from '../controllers/section';
import questionController from '../controllers/question';

const router = express.Router();

// Quiz Level
router.get('/', isAuth, isSuperAdmin, controller.getAllQuizzes);
router.get('/:quizioID', isAuth, controller.getQuizById);
router.post('/', isAuth, controller.addNewQuiz);
router.put('/:quizId', isAuth, controller.updateQuiz);
router.delete('/:quizioId', isAuth, controller.deleteQuiz);

// Section Level
router.post('/:quizId/sections', isAuth, sectionController.addNewSectionToQuiz);
router.get('/:quizId/sections/:sectionId', isAuth, sectionController.getSectionInQuiz);
router.put('/:quizId/sections/:sectionId', isAuth, sectionController.updateSectionInQuiz);
router.delete('/:quizId/sections/:sectionId', isAuth, sectionController.deleteSectionInQuiz);

// Question Level
router.post('/:quizId/sections/:sectionId', isAuth, questionController.addNewQuestionToSection);
router.delete('/:quizId/sections/:sectionId/questions/:questionId', isAuth,
	questionController.deleteQuestionInSection);
router.put('/:quizId/sections/:sectionId/questions/:questionId',
	isAuth, questionController.updateQuestionInSection);

export default router;
