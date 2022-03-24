import express from 'express';
import { isAuth } from '../helpers/authorizer';
import controller from '../controllers/submit';

const router = express.Router();

router.get('/', isAuth, controller.getSubmittedQuizzes); // DONE
router.get('/:quizID', isAuth, controller.checkIfQuizIsSubmitted); // DONE
router.post('/:quizID', isAuth, controller.submitQuiz); // DONE

export default router;
