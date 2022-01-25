import express from 'express';
import { isAuth, isSuperAdmin } from '../helpers/authorizer';
import controller from '../controllers/quiz';
import sectionController from '../controllers/section';
import questionController from '../controllers/question';

const router = express.Router();

// Quiz Level
router.post('/', isAuth, controller.addNewQuiz); // DONE
router.get('/', isAuth, isSuperAdmin, controller.getAllQuizzes); // DONE
router.get('/:quizID', isAuth, controller.getQuizByID); // DONE
router.put('/:quizID', isAuth, controller.updateQuiz); // DONE
router.delete('/:quizID', isAuth, controller.deleteQuiz); // DONE

// Section Level
router.post('/:quizID/sections', isAuth, sectionController.addNewSectionToQuiz); // DONE
router.get('/sections/:sectionID', isAuth, sectionController.getSectionByID); // DONE
router.put('/sections/:sectionID', isAuth, sectionController.updateSectionByID); // DONE
router.delete('/sections/:sectionID', isAuth, sectionController.deleteSectionByID); // DONE

// Question Level
router.post('/sections/:sectionID/questions', isAuth, questionController.addNewQuestionToSection); // DONE
router.get('/sections/questions/:questionID', isAuth, questionController.getQuestionByID); // DONE
router.put('/sections/questions/:questionID',
	isAuth, questionController.updateQuestionByID);
router.delete('/sections/questions/:questionID', isAuth,
	questionController.deleteQuestionByID);

export default router;
