import express from 'express';
import { isAuth, isSuperAdmin } from '../helpers/authorizer';
import controller from '../controllers/quiz';
import sectionController from '../controllers/section';
import questionController from '../controllers/question';

const router = express.Router();

// Quiz Level
router.get('/', isAuth, isSuperAdmin, controller.getAllQuizzes); // DONE
router.get('/:quizioID', isAuth, controller.getQuizById); // DONE
router.post('/', isAuth, controller.addNewQuiz); // DONE
router.put('/:quizioID', isAuth, controller.updateQuiz); // DONE
router.delete('/:quizioID', isAuth, controller.deleteQuiz); // DONE

// Section Level
router.post('/:quizID/sections', isAuth, sectionController.addNewSectionToQuiz); // DONE
router.get('/sections/:quizioID', isAuth, sectionController.getSectionById);
router.put('/:quizId/sections/:sectionId', isAuth, sectionController.updateSectionInQuiz);
router.delete('/:quizId/sections/:sectionId', isAuth, sectionController.deleteSectionInQuiz);

// Question Level
router.post('/:quizId/sections/:sectionId', isAuth, questionController.addNewQuestionToSection);
router.delete('/:quizId/sections/:sectionId/questions/:questionId', isAuth,
	questionController.deleteQuestionInSection);
router.put('/:quizId/sections/:sectionId/questions/:questionId',
	isAuth, questionController.updateQuestionInSection);

export default router;
