import express from 'express';
import { isAuth } from '../helpers/authorizer';
import controller from '../controllers/register';

const router = express.Router();

router.post('/quizzes', isAuth, controller.registerUserForQuiz); // DONE
router.get('/quizzes', isAuth, controller.getRegisteredQuizzesForUser); // DONE
router.get('/quizzes/:quizID', isAuth, controller.getIfUserIsRegisteredForQuiz); // DONE
router.get('/users/quizzes/:quizID', isAuth, controller.getRegisteredUsersForQuiz); // DONE
router.get('/quizzes/:quizID/:accessCode', isAuth, controller.checkAccessCodeForQuiz);

export default router;
