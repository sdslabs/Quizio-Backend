import express from 'express';
import { isAuth } from '../helpers/authorizer';
import controller from '../controllers/register';

const router = express.Router();

router.get('/quizzes/:quizId', isAuth, controller.getRegisteredUsers);
router.post('/quizzes', isAuth, controller.AddToQuiz);
router.delete('/quizzes', isAuth, controller.removeFromQuiz);

export default router;
