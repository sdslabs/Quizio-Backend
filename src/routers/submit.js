import express from 'express';
import { isAuth } from '../helpers/authorizer';
import controller from '../controllers/submit';

const router = express.Router();

router.post('/:quizID', isAuth, controller.submitQuiz); // DONE

export default router;
