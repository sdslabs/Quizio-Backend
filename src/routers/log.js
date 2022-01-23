import express from 'express';

import {
	isAuth, isSuperAdmin,
} from '../helpers/authorizer';
import controller from '../controllers/log';

const router = express.Router();

router.get('/', isAuth, isSuperAdmin, controller.getAllLogs);
router.get('/:username', isAuth, isSuperAdmin, controller.getLogsForUser);
router.get('/:username/:quizId', isAuth, isSuperAdmin, controller.getQuizLogsForUser);
router.put('/:username', isAuth, controller.updateLog);
export default router;
