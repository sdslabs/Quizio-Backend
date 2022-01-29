import express from 'express';
import { isAuth } from '../helpers/authorizer';
import controller from '../controllers/response';

const router = express.Router();

router.put('/', isAuth, controller.saveResponse); // DONE
// router.get('/quizzes', isAuth, controller.getRegisteredQuizzesForUser); // DONE
// router.get('/users/quizzes/:quizID', isAuth, controller.getRegisteredUsersForQuiz); // DONE

export default router;
