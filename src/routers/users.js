import express from 'express';
import { isAuth } from '../helpers/authorizer';
import controller from '../controllers/user';

const router = express.Router();

router.get('/', isAuth, controller.getAllUsers);
router.get('/:userID', isAuth, controller.getUserWithUserID);
router.get('/self', isAuth, controller.getSelfWithUserID);
router.get('/quizzes/owned', isAuth, controller.getAllQuizzesOwnedByUser);

export default router;
