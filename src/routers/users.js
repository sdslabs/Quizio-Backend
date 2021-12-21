import express from 'express';
import {
	isAuth, isSelfOrSuperAdmin, isSuperAdmin,
} from '../helpers/authorizer';
import controller from '../controllers/user';

const router = express.Router();

router.get('/', isAuth, isSuperAdmin, controller.getAllUsers);
router.get('/:username', isAuth, isSelfOrSuperAdmin, controller.getUserWithUsername);

router.put('/:username/quizzes', isAuth, controller.getAllQuizzesForUser);
router.put('/:username/quizzes/:quizId', isAuth, controller.addQuizforUser);
router.delete('/:username/quizzes/:quizId', isAuth, controller.removeQuizforUser);
router.put('/:type', isAuth, isSelfOrSuperAdmin, controller.updateUser);

export default router;
