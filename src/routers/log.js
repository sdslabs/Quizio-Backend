import express from 'express';

import {
	isAuth, isSuperAdmin,
} from '../helpers/authorizer';
import controller from '../controllers/log';

const router = express.Router();

router.get('/', isAuth, isSuperAdmin, controller.getAllLogs);
router.get('/:userID', isAuth, isSuperAdmin, controller.getLogsForUser);
router.get('/:userID/:quizID', isAuth, isSuperAdmin, controller.getQuizLogsForUser);
router.put('/:userID', isAuth, controller.updateLog);
export default router;
