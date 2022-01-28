import express from 'express';
import { isAuth } from '../helpers/authorizer';
import controller from '../controllers/register';

const router = express.Router();

router.post('/quizzes/:quizID', isAuth, controller.registerUserForQuiz); // DONE

// router.get('/quizzes/:quizId', isAuth, controller.getRegisteredUsers);
// router.delete('/quizzes', isAuth, controller.removeFromQuiz);

export default router;
